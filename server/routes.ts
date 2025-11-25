import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, type BudgetFilter } from "./storage";
import { z } from "zod";
import type { Department, AccountCategory } from "@shared/schema";
import { getAuthenticatedUser, listRepositories, createRepository, getRepository } from "./github";

const DEPARTMENTS: Department[] = [
  "DX전략 Core Group",
  "서비스혁신 Core",
  "플랫폼혁신 Core",
  "백오피스혁신 Core",
];

const ACCOUNT_CATEGORIES: AccountCategory[] = [
  "광고선전비(이벤트)",
  "통신비",
  "지급수수료",
  "지급수수료(은행수수료)",
  "지급수수료(외부용역,자문료)",
  "지급수수료(유지보수료)",
  "지급수수료(저작료)",
  "지급수수료(제휴)",
];

const budgetFilterSchema = z.object({
  startMonth: z.coerce.number().min(1).max(12).optional(),
  endMonth: z.coerce.number().min(1).max(12).optional(),
  year: z.coerce.number().optional(),
  departments: z.array(z.string()).optional(),
  accountCategories: z.array(z.string()).optional(),
});

const budgetEntrySchema = z.object({
  department: z.enum(DEPARTMENTS as [string, ...string[]]),
  accountCategory: z.enum(ACCOUNT_CATEGORIES as [string, ...string[]]),
  month: z.number().min(1).max(12),
  year: z.number(),
  budgetAmount: z.number().min(0),
  actualAmount: z.number().min(0),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all budget entries with optional filtering
  app.get("/api/budget", async (req, res) => {
    try {
      const query = req.query;
      
      // Parse departments and accountCategories from query string
      let departments: string[] | undefined;
      let accountCategories: string[] | undefined;
      
      if (query.departments) {
        departments = Array.isArray(query.departments) 
          ? query.departments as string[]
          : [query.departments as string];
      }
      
      if (query.accountCategories) {
        accountCategories = Array.isArray(query.accountCategories)
          ? query.accountCategories as string[]
          : [query.accountCategories as string];
      }

      const filters: BudgetFilter = {
        startMonth: query.startMonth ? parseInt(query.startMonth as string) : undefined,
        endMonth: query.endMonth ? parseInt(query.endMonth as string) : undefined,
        year: query.year ? parseInt(query.year as string) : undefined,
        departments: departments as Department[] | undefined,
        accountCategories: accountCategories as AccountCategory[] | undefined,
      };

      const entries = await storage.getBudgetEntries(filters);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch budget entries" });
    }
  });

  // Get single budget entry
  app.get("/api/budget/:id", async (req, res) => {
    try {
      const entry = await storage.getBudgetEntry(req.params.id);
      if (!entry) {
        return res.status(404).json({ error: "Budget entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch budget entry" });
    }
  });

  // Create budget entry
  app.post("/api/budget", async (req, res) => {
    try {
      const result = budgetEntrySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid budget entry data", details: result.error.issues });
      }

      const data = result.data;
      // Storage layer handles executionRate calculation and settlement-month constraint
      const entry = await storage.createBudgetEntry({
        ...data,
        department: data.department as Department,
        accountCategory: data.accountCategory as AccountCategory,
        executionRate: 0, // Will be recalculated by storage
      });
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to create budget entry" });
    }
  });

  // Update budget entry
  app.patch("/api/budget/:id", async (req, res) => {
    try {
      const partialSchema = budgetEntrySchema.partial();
      const result = partialSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid budget entry data", details: result.error.issues });
      }

      const data = result.data;
      const updateData: Partial<{
        department: Department;
        accountCategory: AccountCategory;
        month: number;
        year: number;
        budgetAmount: number;
        actualAmount: number;
      }> = {};

      if (data.department) updateData.department = data.department as Department;
      if (data.accountCategory) updateData.accountCategory = data.accountCategory as AccountCategory;
      if (data.month !== undefined) updateData.month = data.month;
      if (data.year !== undefined) updateData.year = data.year;
      if (data.budgetAmount !== undefined) updateData.budgetAmount = data.budgetAmount;
      if (data.actualAmount !== undefined) updateData.actualAmount = data.actualAmount;

      const entry = await storage.updateBudgetEntry(req.params.id, updateData);
      if (!entry) {
        return res.status(404).json({ error: "Budget entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to update budget entry" });
    }
  });

  // Delete budget entry
  app.delete("/api/budget/:id", async (req, res) => {
    try {
      const success = await storage.deleteBudgetEntry(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Budget entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete budget entry" });
    }
  });

  // Get summary statistics
  app.get("/api/budget/summary/stats", async (req, res) => {
    try {
      const entries = await storage.getAllBudgetEntries();
      const settlementMonth = 9;
      
      const settledEntries = entries.filter(e => e.month <= settlementMonth);
      
      const totalBudget = entries.reduce((sum, e) => sum + e.budgetAmount, 0);
      const settledBudget = settledEntries.reduce((sum, e) => sum + e.budgetAmount, 0);
      const totalActual = entries.reduce((sum, e) => sum + e.actualAmount, 0);
      const executionRate = settledBudget > 0 ? (totalActual / settledBudget) * 100 : 0;
      const projectedAnnual = settlementMonth > 0 ? (totalActual / settlementMonth) * 12 : 0;
      const remainingBudget = totalBudget - totalActual;

      res.json({
        totalBudget,
        totalActual,
        executionRate,
        projectedAnnual,
        remainingBudget,
        settlementMonth,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate summary" });
    }
  });

  // Export all data as JSON
  app.get("/api/budget/export/json", async (req, res) => {
    try {
      const entries = await storage.getAllBudgetEntries();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=budget_data_${new Date().toISOString().split('T')[0]}.json`);
      res.json({
        exportDate: new Date().toISOString(),
        settlementMonth: 9,
        departments: DEPARTMENTS,
        accountCategories: ACCOUNT_CATEGORIES,
        data: entries,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to export data" });
    }
  });

  // Export as CSV
  app.get("/api/budget/export/csv", async (req, res) => {
    try {
      const entries = await storage.getAllBudgetEntries();
      
      const headers = ["ID", "부서", "계정과목", "월", "연도", "예산", "실제", "집행률"];
      const csvRows = [
        headers.join(","),
        ...entries.map(e => [
          e.id,
          `"${e.department}"`,
          `"${e.accountCategory}"`,
          e.month,
          e.year,
          e.budgetAmount,
          e.actualAmount,
          e.executionRate.toFixed(2),
        ].join(",")),
      ];
      
      const csvContent = "\uFEFF" + csvRows.join("\n");
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=budget_data_${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ error: "Failed to export CSV" });
    }
  });

  // Get template CSV for data import
  app.get("/api/budget/template/csv", async (req, res) => {
    try {
      const headers = ["부서", "계정과목", "월", "연도", "예산", "실제"];
      const exampleRows = [
        [`"${DEPARTMENTS[0]}"`, `"${ACCOUNT_CATEGORIES[0]}"`, "1", "2025", "10000000", "8000000"],
        [`"${DEPARTMENTS[1]}"`, `"${ACCOUNT_CATEGORIES[1]}"`, "2", "2025", "15000000", "12000000"],
      ];
      
      const csvContent = "\uFEFF" + [headers.join(","), ...exampleRows.map(r => r.join(","))].join("\n");
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=budget_template.csv');
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate template" });
    }
  });

  // GitHub API routes
  app.get("/api/github/user", async (req, res) => {
    try {
      const user = await getAuthenticatedUser();
      res.json({ login: user.login, name: user.name, avatar_url: user.avatar_url });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get GitHub user", message: error.message });
    }
  });

  app.get("/api/github/repos", async (req, res) => {
    try {
      const repos = await listRepositories();
      res.json(repos.map(r => ({ name: r.name, full_name: r.full_name, html_url: r.html_url, private: r.private })));
    } catch (error: any) {
      res.status(500).json({ error: "Failed to list repositories", message: error.message });
    }
  });

  app.post("/api/github/repos", async (req, res) => {
    try {
      const { name, description, isPrivate } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Repository name is required" });
      }
      const repo = await createRepository(name, description || "", isPrivate || false);
      res.status(201).json({ name: repo.name, full_name: repo.full_name, html_url: repo.html_url, clone_url: repo.clone_url });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to create repository", message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

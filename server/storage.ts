import { type User, type InsertUser, type BudgetEntry, type Department, type AccountCategory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Budget operations
  getAllBudgetEntries(): Promise<BudgetEntry[]>;
  getBudgetEntries(filters: BudgetFilter): Promise<BudgetEntry[]>;
  getBudgetEntry(id: string): Promise<BudgetEntry | undefined>;
  createBudgetEntry(entry: Omit<BudgetEntry, 'id'>): Promise<BudgetEntry>;
  updateBudgetEntry(id: string, entry: Partial<BudgetEntry>): Promise<BudgetEntry | undefined>;
  deleteBudgetEntry(id: string): Promise<boolean>;
}

export interface BudgetFilter {
  startMonth?: number;
  endMonth?: number;
  year?: number;
  departments?: Department[];
  accountCategories?: AccountCategory[];
}

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

const SETTLEMENT_MONTH = 9;

function calculateExecutionRate(budgetAmount: number, actualAmount: number): number {
  return budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0;
}

function enforceSettlementConstraint(month: number, actualAmount: number): number {
  return month > SETTLEMENT_MONTH ? 0 : actualAmount;
}

function generateMockBudgetData(): BudgetEntry[] {
  const data: BudgetEntry[] = [];
  let id = 1;

  DEPARTMENTS.forEach(dept => {
    ACCOUNT_CATEGORIES.forEach(category => {
      for (let month = 1; month <= 12; month++) {
        const budgetAmount = Math.floor(Math.random() * 30000000) + 10000000;
        const actualAmount = month <= SETTLEMENT_MONTH 
          ? Math.floor(budgetAmount * (0.5 + Math.random() * 0.4))
          : 0;
        data.push({
          id: `entry-${id++}`,
          department: dept,
          accountCategory: category,
          month,
          year: 2025,
          budgetAmount,
          actualAmount,
          executionRate: budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0,
        });
      }
    });
  });

  return data;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private budgetEntries: Map<string, BudgetEntry>;

  constructor() {
    this.users = new Map();
    this.budgetEntries = new Map();
    
    // Initialize with mock budget data
    const mockData = generateMockBudgetData();
    mockData.forEach(entry => {
      this.budgetEntries.set(entry.id, entry);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllBudgetEntries(): Promise<BudgetEntry[]> {
    return Array.from(this.budgetEntries.values());
  }

  async getBudgetEntries(filters: BudgetFilter): Promise<BudgetEntry[]> {
    let entries = Array.from(this.budgetEntries.values());

    if (filters.startMonth !== undefined) {
      entries = entries.filter(e => e.month >= filters.startMonth!);
    }
    if (filters.endMonth !== undefined) {
      entries = entries.filter(e => e.month <= filters.endMonth!);
    }
    if (filters.year !== undefined) {
      entries = entries.filter(e => e.year === filters.year);
    }
    if (filters.departments && filters.departments.length > 0) {
      entries = entries.filter(e => filters.departments!.includes(e.department));
    }
    if (filters.accountCategories && filters.accountCategories.length > 0) {
      entries = entries.filter(e => filters.accountCategories!.includes(e.accountCategory));
    }

    return entries;
  }

  async getBudgetEntry(id: string): Promise<BudgetEntry | undefined> {
    return this.budgetEntries.get(id);
  }

  async createBudgetEntry(entry: Omit<BudgetEntry, 'id'>): Promise<BudgetEntry> {
    const id = randomUUID();
    const actualAmount = enforceSettlementConstraint(entry.month, entry.actualAmount);
    const executionRate = calculateExecutionRate(entry.budgetAmount, actualAmount);
    const newEntry: BudgetEntry = { 
      ...entry, 
      id,
      actualAmount,
      executionRate,
    };
    this.budgetEntries.set(id, newEntry);
    return newEntry;
  }

  async updateBudgetEntry(id: string, updates: Partial<BudgetEntry>): Promise<BudgetEntry | undefined> {
    const existing = this.budgetEntries.get(id);
    if (!existing) return undefined;
    
    const month = updates.month ?? existing.month;
    const budgetAmount = updates.budgetAmount ?? existing.budgetAmount;
    const rawActualAmount = updates.actualAmount ?? existing.actualAmount;
    const actualAmount = enforceSettlementConstraint(month, rawActualAmount);
    const executionRate = calculateExecutionRate(budgetAmount, actualAmount);
    
    const updated: BudgetEntry = { 
      ...existing, 
      ...updates, 
      id,
      actualAmount,
      executionRate,
    };
    
    this.budgetEntries.set(id, updated);
    return updated;
  }

  async deleteBudgetEntry(id: string): Promise<boolean> {
    return this.budgetEntries.delete(id);
  }
}

export const storage = new MemStorage();

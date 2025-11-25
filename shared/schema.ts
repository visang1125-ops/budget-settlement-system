import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Budget and settlement types
export type Department = 
  | "DX전략 Core Group"
  | "서비스혁신 Core"
  | "플랫폼혁신 Core"
  | "백오피스혁신 Core";

export type AccountCategory = 
  | "광고선전비(이벤트)"
  | "통신비"
  | "지급수수료"
  | "지급수수료(은행수수료)"
  | "지급수수료(외부용역,자문료)"
  | "지급수수료(유지보수료)"
  | "지급수수료(저작료)"
  | "지급수수료(제휴)";

export interface BudgetEntry {
  id: string;
  department: Department;
  accountCategory: AccountCategory;
  month: number; // 1-12
  year: number;
  budgetAmount: number;
  actualAmount: number;
  executionRate: number; // percentage
}

export interface MonthlyData {
  month: number;
  year: number;
  totalBudget: number;
  totalActual: number;
  executionRate: number;
}

export interface DepartmentSummary {
  department: Department;
  totalBudget: number;
  totalActual: number;
  executionRate: number;
  projectedAnnual: number;
}

export interface AccountCategorySummary {
  accountCategory: AccountCategory;
  totalBudget: number;
  totalActual: number;
  executionRate: number;
}

export interface FilterParams {
  startMonth?: number;
  endMonth?: number;
  year?: number;
  departments?: Department[];
  accountCategories?: AccountCategory[];
}

import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ==================== 埋点数据表 ====================

/**
 * 页面访问记录表 - 记录 UV/PV
 */
export const pageViews = mysqlTable("page_views", {
  id: int("id").autoincrement().primaryKey(),
  /** 访客唯一标识（基于设备/浏览器指纹） */
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  /** 访问的页面路径 */
  pagePath: varchar("pagePath", { length: 255 }).notNull(),
  /** 用户代理 */
  userAgent: text("userAgent"),
  /** 访问时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = typeof pageViews.$inferInsert;

/**
 * 用户昵称记录表
 */
export const userNicknames = mysqlTable("user_nicknames", {
  id: int("id").autoincrement().primaryKey(),
  /** 访客唯一标识 */
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  /** 用户设置的昵称 */
  nickname: varchar("nickname", { length: 100 }).notNull(),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserNickname = typeof userNicknames.$inferSelect;
export type InsertUserNickname = typeof userNicknames.$inferInsert;

/**
 * 夸奖生成记录表
 */
export const praiseRecords = mysqlTable("praise_records", {
  id: int("id").autoincrement().primaryKey(),
  /** 访客唯一标识 */
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  /** 用户昵称 */
  nickname: varchar("nickname", { length: 100 }),
  /** 用户输入的内容（定制化夸奖时） */
  userInput: text("userInput"),
  /** 选择的主题 ID */
  themeId: varchar("themeId", { length: 50 }).notNull(),
  /** 选择的主题名称 */
  themeName: varchar("themeName", { length: 100 }).notNull(),
  /** AI 生成的夸奖文案 */
  generatedPraise: text("generatedPraise").notNull(),
  /** 是否被收藏 */
  isSaved: boolean("isSaved").default(false).notNull(),
  /** 收藏类型（共鸣/回响/高光时刻） */
  saveType: varchar("saveType", { length: 50 }),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PraiseRecord = typeof praiseRecords.$inferSelect;
export type InsertPraiseRecord = typeof praiseRecords.$inferInsert;

/**
 * 主题点击记录表
 */
export const themeClicks = mysqlTable("theme_clicks", {
  id: int("id").autoincrement().primaryKey(),
  /** 访客唯一标识 */
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  /** 主题 ID */
  themeId: varchar("themeId", { length: 50 }).notNull(),
  /** 主题名称 */
  themeName: varchar("themeName", { length: 100 }).notNull(),
  /** 点击时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ThemeClick = typeof themeClicks.$inferSelect;
export type InsertThemeClick = typeof themeClicks.$inferInsert;

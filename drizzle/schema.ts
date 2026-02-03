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
 * 页面访问记录 - UV/PV 统计
 */
export const pageViews = mysqlTable("page_views", {
  id: int("id").autoincrement().primaryKey(),
  /** 访客唯一标识（基于浏览器指纹或 localStorage） */
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  /** 访问页面路径 */
  pagePath: varchar("pagePath", { length: 255 }).notNull(),
  /** 用户代理 */
  userAgent: text("userAgent"),
  /** 来源 referrer */
  referrer: text("referrer"),
  /** 访问时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = typeof pageViews.$inferInsert;

/**
 * 用户昵称记录
 */
export const userNicknames = mysqlTable("user_nicknames", {
  id: int("id").autoincrement().primaryKey(),
  /** 访客唯一标识 */
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  /** 用户设置的昵称 */
  nickname: varchar("nickname", { length: 100 }).notNull(),
  /** 设置时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserNickname = typeof userNicknames.$inferSelect;
export type InsertUserNickname = typeof userNicknames.$inferInsert;

/**
 * 夸奖生成记录
 */
export const praiseRecords = mysqlTable("praise_records", {
  id: int("id").autoincrement().primaryKey(),
  /** 访客唯一标识 */
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  /** 用户昵称 */
  nickname: varchar("nickname", { length: 100 }),
  /** 选择的主题 ID */
  themeId: varchar("themeId", { length: 50 }).notNull(),
  /** 主题名称 */
  themeName: varchar("themeName", { length: 100 }),
  /** 用户输入的原文 */
  userInput: text("userInput"),
  /** AI 生成的夸奖文案 */
  generatedPraise: text("generatedPraise").notNull(),
  /** 是否被收藏 */
  isSaved: boolean("isSaved").default(false).notNull(),
  /** 收藏类型：self/others/highlight */
  saveType: varchar("saveType", { length: 20 }),
  /** 生成时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间（收藏状态变更） */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PraiseRecord = typeof praiseRecords.$inferSelect;
export type InsertPraiseRecord = typeof praiseRecords.$inferInsert;

/**
 * 主题点击统计
 */
export const themeClicks = mysqlTable("theme_clicks", {
  id: int("id").autoincrement().primaryKey(),
  /** 访客唯一标识 */
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  /** 主题 ID */
  themeId: varchar("themeId", { length: 50 }).notNull(),
  /** 主题名称 */
  themeName: varchar("themeName", { length: 100 }),
  /** 点击时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ThemeClick = typeof themeClicks.$inferSelect;
export type InsertThemeClick = typeof themeClicks.$inferInsert;

/**
 * 管理员密码表（简单认证）
 */
export const adminConfig = mysqlTable("admin_config", {
  id: int("id").autoincrement().primaryKey(),
  /** 配置键 */
  configKey: varchar("configKey", { length: 50 }).notNull().unique(),
  /** 配置值 */
  configValue: text("configValue").notNull(),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminConfig = typeof adminConfig.$inferSelect;
export type InsertAdminConfig = typeof adminConfig.$inferInsert;

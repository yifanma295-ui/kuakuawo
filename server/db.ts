import { eq, desc, sql, and, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  pageViews,
  userNicknames,
  praiseRecords,
  themeClicks,
  adminConfig,
  InsertPageView,
  InsertUserNickname,
  InsertPraiseRecord,
  InsertThemeClick,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== 埋点数据函数 ====================

/**
 * 记录页面访问
 */
export async function recordPageView(data: InsertPageView) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot record page view: database not available");
    return;
  }

  try {
    await db.insert(pageViews).values(data);
  } catch (error) {
    console.error("[Database] Failed to record page view:", error);
  }
}

/**
 * 记录用户昵称
 */
export async function recordNickname(data: InsertUserNickname) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot record nickname: database not available");
    return;
  }

  try {
    await db.insert(userNicknames).values(data);
  } catch (error) {
    console.error("[Database] Failed to record nickname:", error);
  }
}

/**
 * 记录夸奖生成
 */
export async function recordPraise(data: InsertPraiseRecord) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot record praise: database not available");
    return null;
  }

  try {
    const result = await db.insert(praiseRecords).values(data);
    return result[0].insertId;
  } catch (error) {
    console.error("[Database] Failed to record praise:", error);
    return null;
  }
}

/**
 * 更新夸奖收藏状态
 */
export async function updatePraiseSaveStatus(
  id: number, 
  isSaved: boolean, 
  saveType?: string
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update praise: database not available");
    return;
  }

  try {
    await db.update(praiseRecords)
      .set({ isSaved, saveType: saveType || null })
      .where(eq(praiseRecords.id, id));
  } catch (error) {
    console.error("[Database] Failed to update praise:", error);
  }
}

/**
 * 记录主题点击
 */
export async function recordThemeClick(data: InsertThemeClick) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot record theme click: database not available");
    return;
  }

  try {
    await db.insert(themeClicks).values(data);
  } catch (error) {
    console.error("[Database] Failed to record theme click:", error);
  }
}

// ==================== 管理后台数据查询 ====================

/**
 * 获取 UV/PV 统计
 */
export async function getTrafficStats() {
  const db = await getDb();
  if (!db) return { uv: 0, pv: 0 };

  try {
    // 总 PV
    const pvResult = await db.select({ count: sql<number>`count(*)` }).from(pageViews);
    const pv = pvResult[0]?.count || 0;

    // 总 UV（独立访客数）
    const uvResult = await db.select({ count: sql<number>`count(distinct ${pageViews.visitorId})` }).from(pageViews);
    const uv = uvResult[0]?.count || 0;

    return { uv, pv };
  } catch (error) {
    console.error("[Database] Failed to get traffic stats:", error);
    return { uv: 0, pv: 0 };
  }
}

/**
 * 获取今日 UV/PV
 */
export async function getTodayTrafficStats() {
  const db = await getDb();
  if (!db) return { uv: 0, pv: 0 };

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 今日 PV
    const pvResult = await db.select({ count: sql<number>`count(*)` })
      .from(pageViews)
      .where(gte(pageViews.createdAt, today));
    const pv = pvResult[0]?.count || 0;

    // 今日 UV
    const uvResult = await db.select({ count: sql<number>`count(distinct ${pageViews.visitorId})` })
      .from(pageViews)
      .where(gte(pageViews.createdAt, today));
    const uv = uvResult[0]?.count || 0;

    return { uv, pv };
  } catch (error) {
    console.error("[Database] Failed to get today traffic stats:", error);
    return { uv: 0, pv: 0 };
  }
}

/**
 * 获取所有用户昵称（时间倒序）
 */
export async function getAllNicknames(limit = 100) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select()
      .from(userNicknames)
      .orderBy(desc(userNicknames.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get nicknames:", error);
    return [];
  }
}

/**
 * 获取所有夸奖记录（时间倒序）
 */
export async function getAllPraiseRecords(limit = 100) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select()
      .from(praiseRecords)
      .orderBy(desc(praiseRecords.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get praise records:", error);
    return [];
  }
}

/**
 * 获取主题点击统计
 */
export async function getThemeClickStats() {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.select({
      themeId: themeClicks.themeId,
      themeName: themeClicks.themeName,
      count: sql<number>`count(*)`,
    })
      .from(themeClicks)
      .groupBy(themeClicks.themeId, themeClicks.themeName)
      .orderBy(desc(sql`count(*)`));
    
    return result;
  } catch (error) {
    console.error("[Database] Failed to get theme click stats:", error);
    return [];
  }
}

/**
 * 获取最近的主题点击记录
 */
export async function getRecentThemeClicks(limit = 100) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select()
      .from(themeClicks)
      .orderBy(desc(themeClicks.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get recent theme clicks:", error);
    return [];
  }
}

/**
 * 获取管理员密码
 */
export async function getAdminPassword() {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select()
      .from(adminConfig)
      .where(eq(adminConfig.configKey, "admin_password"))
      .limit(1);
    
    return result[0]?.configValue || null;
  } catch (error) {
    console.error("[Database] Failed to get admin password:", error);
    return null;
  }
}

/**
 * 设置管理员密码
 */
export async function setAdminPassword(password: string) {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.insert(adminConfig)
      .values({ configKey: "admin_password", configValue: password })
      .onDuplicateKeyUpdate({ set: { configValue: password } });
    return true;
  } catch (error) {
    console.error("[Database] Failed to set admin password:", error);
    return false;
  }
}

/**
 * 获取收藏的夸奖数量
 */
export async function getSavedPraiseCount() {
  const db = await getDb();
  if (!db) return 0;

  try {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(praiseRecords)
      .where(eq(praiseRecords.isSaved, true));
    return result[0]?.count || 0;
  } catch (error) {
    console.error("[Database] Failed to get saved praise count:", error);
    return 0;
  }
}

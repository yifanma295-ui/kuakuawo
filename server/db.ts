import { eq, desc, sql, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  pageViews, 
  userNicknames, 
  praiseRecords, 
  themeClicks,
  InsertPageView,
  InsertUserNickname,
  InsertPraiseRecord,
  InsertThemeClick
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
export async function recordUserNickname(data: InsertUserNickname) {
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
export async function updatePraiseSaveStatus(id: number, isSaved: boolean, saveType?: string) {
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

// ==================== 管理后台查询函数 ====================

/**
 * 获取 UV（独立访客数）
 */
export async function getUniqueVisitors() {
  const db = await getDb();
  if (!db) return 0;
  
  try {
    const result = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${pageViews.visitorId})` })
      .from(pageViews);
    return result[0]?.count || 0;
  } catch (error) {
    console.error("[Database] Failed to get UV:", error);
    return 0;
  }
}

/**
 * 获取 PV（总访问次数）
 */
export async function getTotalPageViews() {
  const db = await getDb();
  if (!db) return 0;
  
  try {
    const result = await db.select({ count: count() }).from(pageViews);
    return result[0]?.count || 0;
  } catch (error) {
    console.error("[Database] Failed to get PV:", error);
    return 0;
  }
}

/**
 * 获取所有用户昵称（时间倒序）
 */
export async function getAllNicknames(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db
      .select()
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
    return await db
      .select()
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
    return await db
      .select({
        themeId: themeClicks.themeId,
        themeName: themeClicks.themeName,
        clickCount: count(),
      })
      .from(themeClicks)
      .groupBy(themeClicks.themeId, themeClicks.themeName)
      .orderBy(desc(count()));
  } catch (error) {
    console.error("[Database] Failed to get theme stats:", error);
    return [];
  }
}

/**
 * 获取所有主题点击记录（时间倒序）
 */
export async function getAllThemeClicks(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db
      .select()
      .from(themeClicks)
      .orderBy(desc(themeClicks.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get theme clicks:", error);
    return [];
  }
}

/**
 * 获取管理后台统计数据汇总
 */
export async function getAdminStats() {
  const [uv, pv, nicknames, praiseList, themeStats, themeClickList] = await Promise.all([
    getUniqueVisitors(),
    getTotalPageViews(),
    getAllNicknames(),
    getAllPraiseRecords(),
    getThemeClickStats(),
    getAllThemeClicks(),
  ]);
  
  return {
    uv,
    pv,
    nicknames,
    praiseRecords: praiseList,
    themeStats,
    themeClicks: themeClickList,
  };
}

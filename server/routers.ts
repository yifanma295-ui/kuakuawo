import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { generatePraiseWithDeepSeek } from "./deepseek";
import * as db from "./db";

// 默认管理员密码（首次使用时会写入数据库）
const DEFAULT_ADMIN_PASSWORD = "kuakuawo2024";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // 夸奖生成 API
  praise: router({
    generate: publicProcedure
      .input(
        z.object({
          nickname: z.string().min(1).max(50),
          themeName: z.string().min(1).max(50),
          themeStyle: z.string().min(1).max(200),
          userInput: z.string().max(500).optional(),
          visitorId: z.string().max(64).optional(),
          themeId: z.string().max(50).optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const praises = await generatePraiseWithDeepSeek(
            input.nickname,
            input.themeName,
            input.themeStyle,
            input.userInput
          );

          // 记录到数据库
          if (input.visitorId && praises.length > 0) {
            const praiseId = await db.recordPraise({
              visitorId: input.visitorId,
              nickname: input.nickname,
              themeId: input.themeId || "unknown",
              themeName: input.themeName,
              userInput: input.userInput || null,
              generatedPraise: praises[0],
              isSaved: false,
            });
            
            return {
              success: true,
              praises,
              praiseId,
            };
          }

          return {
            success: true,
            praises,
          };
        } catch (error) {
          console.error("Praise generation error:", error);
          return {
            success: false,
            praises: [],
            error: "生成夸奖时出错，请稍后再试",
          };
        }
      }),

    // 更新收藏状态
    updateSaveStatus: publicProcedure
      .input(
        z.object({
          praiseId: z.number(),
          isSaved: z.boolean(),
          saveType: z.string().max(20).optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.updatePraiseSaveStatus(input.praiseId, input.isSaved, input.saveType);
        return { success: true };
      }),
  }),

  // 埋点 API
  analytics: router({
    // 记录页面访问
    recordPageView: publicProcedure
      .input(
        z.object({
          visitorId: z.string().max(64),
          pagePath: z.string().max(255),
          userAgent: z.string().max(500).optional(),
          referrer: z.string().max(500).optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.recordPageView({
          visitorId: input.visitorId,
          pagePath: input.pagePath,
          userAgent: input.userAgent || null,
          referrer: input.referrer || null,
        });
        return { success: true };
      }),

    // 记录用户昵称
    recordNickname: publicProcedure
      .input(
        z.object({
          visitorId: z.string().max(64),
          nickname: z.string().max(100),
        })
      )
      .mutation(async ({ input }) => {
        await db.recordNickname({
          visitorId: input.visitorId,
          nickname: input.nickname,
        });
        return { success: true };
      }),

    // 记录主题点击
    recordThemeClick: publicProcedure
      .input(
        z.object({
          visitorId: z.string().max(64),
          themeId: z.string().max(50),
          themeName: z.string().max(100).optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.recordThemeClick({
          visitorId: input.visitorId,
          themeId: input.themeId,
          themeName: input.themeName || null,
        });
        return { success: true };
      }),
  }),

  // 管理后台 API
  admin: router({
    // 验证管理员密码
    login: publicProcedure
      .input(
        z.object({
          password: z.string().min(1).max(100),
        })
      )
      .mutation(async ({ input }) => {
        let storedPassword = await db.getAdminPassword();
        
        // 如果没有设置密码，使用默认密码并保存
        if (!storedPassword) {
          await db.setAdminPassword(DEFAULT_ADMIN_PASSWORD);
          storedPassword = DEFAULT_ADMIN_PASSWORD;
        }

        if (input.password === storedPassword) {
          return { success: true };
        }
        return { success: false, error: "密码错误" };
      }),

    // 获取流量统计
    getTrafficStats: publicProcedure.query(async () => {
      const total = await db.getTrafficStats();
      const today = await db.getTodayTrafficStats();
      return { total, today };
    }),

    // 获取所有昵称
    getNicknames: publicProcedure
      .input(z.object({ limit: z.number().max(500).optional() }).optional())
      .query(async ({ input }) => {
        return await db.getAllNicknames(input?.limit || 100);
      }),

    // 获取所有夸奖记录
    getPraiseRecords: publicProcedure
      .input(z.object({ limit: z.number().max(500).optional() }).optional())
      .query(async ({ input }) => {
        return await db.getAllPraiseRecords(input?.limit || 100);
      }),

    // 获取主题点击统计
    getThemeStats: publicProcedure.query(async () => {
      return await db.getThemeClickStats();
    }),

    // 获取最近主题点击
    getRecentThemeClicks: publicProcedure
      .input(z.object({ limit: z.number().max(500).optional() }).optional())
      .query(async ({ input }) => {
        return await db.getRecentThemeClicks(input?.limit || 100);
      }),

    // 获取收藏数量
    getSavedCount: publicProcedure.query(async () => {
      return await db.getSavedPraiseCount();
    }),

    // 修改管理员密码
    changePassword: publicProcedure
      .input(
        z.object({
          oldPassword: z.string().min(1).max(100),
          newPassword: z.string().min(6).max(100),
        })
      )
      .mutation(async ({ input }) => {
        const storedPassword = await db.getAdminPassword();
        
        if (input.oldPassword !== storedPassword) {
          return { success: false, error: "原密码错误" };
        }

        const result = await db.setAdminPassword(input.newPassword);
        return { success: result };
      }),
  }),
});

export type AppRouter = typeof appRouter;

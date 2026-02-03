import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { generatePraiseWithDeepSeek } from "./deepseek";
import * as db from "./db";

// 管理员密码（可通过环境变量配置）
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kuakuawo2024";

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
          visitorId: z.string().optional(),
          themeId: z.string().optional(),
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
          
          // 记录夸奖生成到数据库
          if (input.visitorId && praises.length > 0) {
            for (const praise of praises) {
              await db.recordPraise({
                visitorId: input.visitorId,
                nickname: input.nickname,
                userInput: input.userInput || null,
                themeId: input.themeId || "unknown",
                themeName: input.themeName,
                generatedPraise: praise,
                isSaved: false,
              });
            }
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
  }),

  // 埋点 API
  analytics: router({
    // 记录页面访问
    recordPageView: publicProcedure
      .input(
        z.object({
          visitorId: z.string().min(1).max(64),
          pagePath: z.string().min(1).max(255),
          userAgent: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.recordPageView({
          visitorId: input.visitorId,
          pagePath: input.pagePath,
          userAgent: input.userAgent || null,
        });
        return { success: true };
      }),

    // 记录用户昵称
    recordNickname: publicProcedure
      .input(
        z.object({
          visitorId: z.string().min(1).max(64),
          nickname: z.string().min(1).max(100),
        })
      )
      .mutation(async ({ input }) => {
        await db.recordUserNickname({
          visitorId: input.visitorId,
          nickname: input.nickname,
        });
        return { success: true };
      }),

    // 记录主题点击
    recordThemeClick: publicProcedure
      .input(
        z.object({
          visitorId: z.string().min(1).max(64),
          themeId: z.string().min(1).max(50),
          themeName: z.string().min(1).max(100),
        })
      )
      .mutation(async ({ input }) => {
        await db.recordThemeClick({
          visitorId: input.visitorId,
          themeId: input.themeId,
          themeName: input.themeName,
        });
        return { success: true };
      }),

    // 更新夸奖收藏状态
    updatePraiseSave: publicProcedure
      .input(
        z.object({
          praiseId: z.number(),
          isSaved: z.boolean(),
          saveType: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.updatePraiseSaveStatus(input.praiseId, input.isSaved, input.saveType);
        return { success: true };
      }),
  }),

  // 管理后台 API
  admin: router({
    // 验证管理员密码
    login: publicProcedure
      .input(
        z.object({
          password: z.string().min(1),
        })
      )
      .mutation(({ input }) => {
        const isValid = input.password === ADMIN_PASSWORD;
        return { success: isValid };
      }),

    // 获取统计数据
    getStats: publicProcedure
      .input(
        z.object({
          password: z.string().min(1),
        })
      )
      .query(async ({ input }) => {
        if (input.password !== ADMIN_PASSWORD) {
          return { success: false, error: "密码错误" };
        }
        
        const stats = await db.getAdminStats();
        return {
          success: true,
          data: stats,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;

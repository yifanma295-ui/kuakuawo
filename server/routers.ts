import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { generatePraiseWithDeepSeek } from "./deepseek";

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
});

export type AppRouter = typeof appRouter;

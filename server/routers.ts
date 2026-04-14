import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import {
  createSession,
  getSessionsByUserId,
  getSessionById,
  getMessagesBySessionId,
  addMessage,
  updateSessionSummary,
  markSessionEmailSent,
  getUserPreferences,
  upsertUserPreferences,
  deleteSession,
  renameSession,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { sendEmail, generateSessionSummaryEmail } from "./email";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  chat: router({
    createSession: protectedProcedure
      .input(z.object({ title: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const session = await createSession(
          ctx.user.id,
          input.title || `Session ${new Date().toLocaleDateString()}`
        );
        return session;
      }),

    getSessions: protectedProcedure.query(async ({ ctx }) => {
      const userSessions = await getSessionsByUserId(ctx.user.id);
      return userSessions;
    }),

    deleteSession: protectedProcedure
      .input(z.object({ sessionId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await deleteSession(input.sessionId, ctx.user.id);
      }),

    renameSession: protectedProcedure
      .input(z.object({ sessionId: z.number(), newTitle: z.string().min(1).max(255) }))
      .mutation(async ({ ctx, input }) => {
        return await renameSession(input.sessionId, ctx.user.id, input.newTitle);
      }),

    getSession: protectedProcedure
      .input(z.object({ sessionId: z.number() }))
      .query(async ({ ctx, input }) => {
        const session = await getSessionById(input.sessionId);
        if (!session || session.userId !== ctx.user.id) {
          throw new Error("Session not found or unauthorized");
        }
        const msgs = await getMessagesBySessionId(input.sessionId);
        return { session, messages: msgs };
      }),

    sendMessage: protectedProcedure
      .input(
        z.object({
          sessionId: z.number(),
          message: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const session = await getSessionById(input.sessionId);
        if (!session || session.userId !== ctx.user.id) {
          throw new Error("Session not found or unauthorized");
        }

        // Add user message to database
        await addMessage(input.sessionId, "user", input.message);

        // Get conversation history
        const msgs = await getMessagesBySessionId(input.sessionId);
        const conversationHistory = msgs.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

        // Generate AI response with business therapist persona
        const systemPrompt = `You are Business Therapist, an empathetic and solution-focused AI coach specializing in helping professionals navigate business challenges. Your approach combines business acumen with therapeutic listening skills.

Core principles:
- Listen deeply and validate the user's concerns
- Ask clarifying questions to understand the root cause
- Provide actionable, practical solutions
- Maintain a supportive, non-judgmental tone
- Help users identify patterns and develop resilience
- Balance empathy with pragmatic business advice
- Encourage reflection and self-discovery

Always respond in a warm, professional manner. When appropriate, suggest concrete action items.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            ...conversationHistory,
          ],
        });

        const assistantMessageContent = response.choices[0]?.message?.content;
        const assistantMessage = typeof assistantMessageContent === "string" 
          ? assistantMessageContent 
          : "I apologize, I couldn't generate a response.";

        // Add AI response to database
        if (typeof assistantMessage === "string") {
          await addMessage(input.sessionId, "assistant", assistantMessage);
        }

        return { message: typeof assistantMessage === "string" ? assistantMessage : "" };
      }),

    generateSummary: protectedProcedure
      .input(z.object({ sessionId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const session = await getSessionById(input.sessionId);
        if (!session || session.userId !== ctx.user.id) {
          throw new Error("Session not found or unauthorized");
        }

        const msgs = await getMessagesBySessionId(input.sessionId);
        const conversationText = msgs
          .map((m) => `${m.role === "user" ? "User" : "Therapist"}: ${m.content}`)
          .join("\n\n");

        // Generate summary and action items
        const summaryResponse = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a business coach summarizing a therapy session. Provide:
1. A brief 2-3 sentence summary of the main challenge discussed
2. A JSON array of 3-5 specific, actionable items the user should focus on

Respond ONLY with valid JSON in this format:
{
  "summary": "Brief summary here",
  "actionItems": ["Action 1", "Action 2", "Action 3"]
}`,
            },
            {
              role: "user",
              content: `Please summarize this session:\n\n${conversationText}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "session_summary",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  summary: { type: "string" },
                  actionItems: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: ["summary", "actionItems"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = summaryResponse.choices[0]?.message?.content;
        if (typeof content !== "string") {
          throw new Error("Invalid response from LLM");
        }
        const parsed = JSON.parse(content);

        await updateSessionSummary(
          input.sessionId,
          parsed.summary,
          JSON.stringify(parsed.actionItems)
        );

        // Send email with summary and action items
        try {
          const userEmail = ctx.user.email;
          const userName = ctx.user.name || "User";
          
          if (userEmail) {
            const htmlContent = generateSessionSummaryEmail(
              userName,
              session.title,
              parsed.summary,
              parsed.actionItems
            );

            await sendEmail({
              to: userEmail,
              subject: `Business Therapist Session Summary: ${session.title}`,
              htmlContent,
            });

            // Mark email as sent
            await markSessionEmailSent(input.sessionId);
          }
        } catch (error) {
          console.error("[Email] Failed to send session summary email:", error);
          // Don't throw - email failure shouldn't block the summary generation
        }

        return parsed;
      }),
  }),

  profile: router({
    getPreferences: protectedProcedure.query(async ({ ctx }) => {
      const prefs = await getUserPreferences(ctx.user.id);
      return prefs || {
        userId: ctx.user.id,
        theme: "dark",
        language: "en",
        emailNotifications: 1,
        summaryNotifications: 1,
        weeklyDigest: 0,
        timezone: "UTC",
      };
    }),

    updatePreferences: protectedProcedure
      .input(
        z.object({
          theme: z.enum(["dark", "light"]).optional(),
          language: z.string().optional(),
          emailNotifications: z.boolean().optional(),
          summaryNotifications: z.boolean().optional(),
          weeklyDigest: z.boolean().optional(),
          timezone: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const updateData: Record<string, any> = {};
        if (input.theme !== undefined) updateData.theme = input.theme;
        if (input.language !== undefined) updateData.language = input.language;
        if (input.emailNotifications !== undefined) updateData.emailNotifications = input.emailNotifications ? 1 : 0;
        if (input.summaryNotifications !== undefined) updateData.summaryNotifications = input.summaryNotifications ? 1 : 0;
        if (input.weeklyDigest !== undefined) updateData.weeklyDigest = input.weeklyDigest ? 1 : 0;
        if (input.timezone !== undefined) updateData.timezone = input.timezone;

        const updated = await upsertUserPreferences(ctx.user.id, updateData);
        return updated;
      }),
  }),
});

export type AppRouter = typeof appRouter;

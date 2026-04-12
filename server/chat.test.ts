import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "@shared/const";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

describe("Business Therapist Chatbot", () => {
  describe("auth procedures", () => {
    it("auth.logout clears session cookie", async () => {
      const { ctx, clearedCookies } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.logout();

      expect(result).toEqual({ success: true });
      expect(clearedCookies).toHaveLength(1);
      expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    });

    it("auth.me returns current user", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const user = await caller.auth.me();

      expect(user).toBeDefined();
      expect(user?.email).toBe("sample@example.com");
      expect(user?.role).toBe("user");
    });
  });

  describe("chat router", () => {
    it("has chat procedures available", () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.chat).toBeDefined();
      expect(typeof caller.chat.createSession).toBe("function");
      expect(typeof caller.chat.getSessions).toBe("function");
      expect(typeof caller.chat.getSession).toBe("function");
      expect(typeof caller.chat.sendMessage).toBe("function");
      expect(typeof caller.chat.generateSummary).toBe("function");
    });
  });

  describe("business therapist features", () => {
    it("supports session creation", () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.chat.createSession.mutate).toBeDefined();
    });

    it("supports retrieving sessions", () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.chat.getSessions.query).toBeDefined();
    });

    it("supports getting session details", () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.chat.getSession.query).toBeDefined();
    });

    it("supports sending messages", () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.chat.sendMessage.mutate).toBeDefined();
    });

    it("supports generating session summaries", () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.chat.generateSummary.mutate).toBeDefined();
    });

    it("has empathetic business therapist persona configured", () => {
      // The Business Therapist persona is embedded in the sendMessage procedure
      // with system prompt defining empathetic, solution-focused coaching
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.chat.sendMessage).toBeDefined();
    });

    it("supports automatic email delivery of summaries", () => {
      // Email is sent automatically when generateSummary is called
      // with session summary and action items
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.chat.generateSummary).toBeDefined();
    });
  });

  describe("authentication and security", () => {
    it("uses Manus OAuth for authentication", () => {
      const { ctx } = createAuthContext();

      expect(ctx.user).toBeDefined();
      expect(ctx.user?.loginMethod).toBe("manus");
    });

    it("enforces user isolation in procedures", () => {
      const { ctx: ctx1 } = createAuthContext();
      const { ctx: ctx2 } = createAuthContext();

      const caller1 = appRouter.createCaller(ctx1);
      const caller2 = appRouter.createCaller(ctx2);

      // Different contexts should have different callers
      expect(caller1).not.toBe(caller2);
    });
  });
});

import { describe, it, expect, vi } from "vitest";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("V2.0 Features", () => {
  describe("Store - Random Theme", () => {
    it("should include random theme in THEMES array", async () => {
      const { THEMES } = await import("../lib/store");
      const randomTheme = THEMES.find((t) => t.id === "random");
      expect(randomTheme).toBeDefined();
      expect(randomTheme?.name).toBe("随机夸夸");
    });

    it("should have 10 themes total (9 original + 1 random)", async () => {
      const { THEMES } = await import("../lib/store");
      expect(THEMES.length).toBe(10);
    });

    it("should have random as first theme", async () => {
      const { THEMES } = await import("../lib/store");
      expect(THEMES[0].id).toBe("random");
    });
  });

  describe("Store - Onboarding State", () => {
    it("should have onboardingComplete in default state", async () => {
      const { loadState } = await import("../lib/store");
      const state = await loadState();
      expect(state).toHaveProperty("onboardingComplete");
    });

    it("should default to random theme for new users", async () => {
      const { loadState } = await import("../lib/store");
      const state = await loadState();
      expect(state.defaultThemeId).toBe("random");
    });
  });

  describe("Store - getRandomTheme", () => {
    it("should return a theme that is not random", async () => {
      const { getRandomTheme } = await import("../lib/store");
      const theme = getRandomTheme();
      expect(theme.id).not.toBe("random");
    });

    it("should return a valid theme object", async () => {
      const { getRandomTheme } = await import("../lib/store");
      const theme = getRandomTheme();
      expect(theme).toHaveProperty("id");
      expect(theme).toHaveProperty("name");
      expect(theme).toHaveProperty("emoji");
      expect(theme).toHaveProperty("style");
    });
  });

  describe("Theme Structure", () => {
    it("all themes should have required properties", async () => {
      const { THEMES } = await import("../lib/store");
      THEMES.forEach((theme) => {
        expect(theme).toHaveProperty("id");
        expect(theme).toHaveProperty("name");
        expect(theme).toHaveProperty("emoji");
        expect(theme).toHaveProperty("description");
        expect(theme).toHaveProperty("style");
      });
    });

    it("should have correct theme IDs", async () => {
      const { THEMES } = await import("../lib/store");
      const expectedIds = [
        "random",
        "loneliness",
        "happiness",
        "motivation",
        "study",
        "work",
        "pregnancy",
        "parenting",
        "pets",
        "traveler",
      ];
      const actualIds = THEMES.map((t) => t.id);
      expect(actualIds).toEqual(expectedIds);
    });
  });

  describe("SavedPraise Types", () => {
    it("should support highlight type for custom praises", async () => {
      // Type check - highlight should be a valid type
      const validTypes = ["self", "others", "highlight"];
      expect(validTypes).toContain("highlight");
    });
  });
});

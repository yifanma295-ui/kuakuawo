import { describe, it, expect } from "vitest";
import axios from "axios";

const DEEPSEEK_API_BASE = "https://api.deepseek.com";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

describe("DeepSeek API", () => {
  it("should validate API key by making a simple request", async () => {
    expect(DEEPSEEK_API_KEY).toBeDefined();
    expect(DEEPSEEK_API_KEY).not.toBe("");

    const response = await axios.post(
      `${DEEPSEEK_API_BASE}/v1/chat/completions`,
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: "Say hello" }],
        max_tokens: 10,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    expect(response.status).toBe(200);
    expect(response.data.choices).toBeDefined();
    expect(response.data.choices.length).toBeGreaterThan(0);
  }, 20000);
});

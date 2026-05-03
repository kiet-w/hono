import { expect, test, describe } from "bun:test";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigService } from "@nestjs/config";

describe("JwtStrategy", () => {
  test("should validate and return formatted user payload", async () => {
    // Mock ConfigService
    const mockConfigService = {
      get: (key: string) => {
        if (key === "supabase.jwtSecret") return "test-secret";
        return null;
      },
    } as ConfigService;

    const strategy = new JwtStrategy(mockConfigService);

    const payload = {
      sub: "user-123",
      email: "test@example.com",
      role: "authenticated"
    };

    const result = await strategy.validate(payload);

    expect(result).toEqual({
      userId: "user-123",
      email: "test@example.com",
      role: "authenticated",
    });
  });
});

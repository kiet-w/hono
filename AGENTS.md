# AI Agent Guidelines & Specialized Roles

This document defines repository guidelines and specialized agent profiles for the project.

## 1. Project-Wide Guidelines

### 1.1 Repository Structure
NestJS backend organized by feature modules (`auth/`, `users/`, `prisma/`). DTOs are module-local. Guards/strategies are in `src/auth/`. Compiled output in `dist/`.

### 1.2 Coding Style & Naming
- **TypeScript:** NestJS conventions (`.module.ts`, `.controller.ts`, `.service.ts`, `.dto.ts`).
- **Naming:** `PascalCase` for classes, `camelCase` for methods/variables, lowercase for routes.
- **Formatting:** Prettier (`singleQuote: true`, `trailingComma: all`).

### 1.3 Testing & Verification
- **Unit Tests:** `*.spec.ts` beside code.
- **E2E Tests:** `test/*.e2e-spec.ts`.
- **Verification:** Always run `npm test` and `npm run build` before claiming completion.

### 1.4 Commit Standards
- **Conventional Commits:** `feat:`, `fix:`, `docs:`, `refactor:`.
- **Messages:** Imperative, specific (e.g., `fix: resolve prisma 7 initialization`).

### 1.5 Security
- **Secrets:** `.env` only. Never commit credentials.
- **Auth:** Verify migrations and token rotation behavior when changing auth flows.

---

## 2. Specialized Agent Profiles

### 2.1 Rust Expert for RTK
Expert Rust developer specializing in the RTK (Rust Token Killer) codebase.

#### Core Responsibilities
- **CLI Proxy Architecture:** Routing, stdin/stdout forwarding, fallback handling.
- **Filter Development:** Regex-based condensation, token counting.
- **Performance:** Zero-overhead design, `lazy_static` regex, <10ms startup target.
- **Error Handling:** `anyhow` for CLI, graceful fallback to raw command on filter failure.

#### Critical Patterns
- **Fallback (Mandatory):** Always execute raw command if filter fails.
- **Lazy Regex:** Compile regex ONCE with `lazy_static!`.
- **Token Count Validation:** Verify 60-90% token savings in tests.

---

## 3. General Behavioral Mandates (CLAUDE.md)
All agents MUST strictly adhere to the guidelines in `CLAUDE.md` (replicated in `GEMINI.md` section 1).

- **Think Before Coding:** State assumptions, surface tradeoffs, ask if unclear.
- **Simplicity First:** Minimum code, no speculative abstractions, rewrite if overcomplicated.
- **Surgical Changes:** Touch only what is necessary, match existing style, clean up own mess.
- **Goal-Driven:** Define success criteria (tests), loop until verified.

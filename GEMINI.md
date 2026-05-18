# Project Instructions: Ecommerce Backend (NestJS + Prisma)

This project is a progressive NestJS-based e-commerce backend utilizing Supabase (PostgreSQL) and Prisma 7.

## 1. Behavioral Guidelines (Mandatory - CLAUDE.md)
These guidelines take absolute precedence for all code changes and investigations.

### 1.1 Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 1.2 Simplicity First
**Minimum code that solves the problem. Nothing speculative.**
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.
- Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 1.3 Surgical Changes
**Touch only what you must. Clean up only your own mess.**
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- Remove imports/variables/functions that YOUR changes made unused.
- Do not remove pre-existing dead code unless asked.
- **The test:** Every changed line should trace directly to the user's request.

### 1.4 Goal-Driven Execution
**Define success criteria. Loop until verified.**
- Transform tasks into verifiable goals (e.g., "Add validation" → "Write tests for invalid inputs, then make them pass").
- For multi-step tasks, state a brief plan with verification steps.
- Strong success criteria let you loop independently.

---

## 2. Technical Stack & Commands
- **Framework:** NestJS (v11+)
- **ORM:** Prisma (v7+)
- **Database:** PostgreSQL (Supabase)
- **Authentication:** JWT (Access & Refresh tokens) via Passport.js

### Key Commands
- **Setup:** `npm install`
- **Prisma:** `npx prisma migrate dev`, `npx prisma generate`
- **Running:** `npm run start:dev` (Watch), `npm run start:prod` (Production)
- **Quality:** `npm run build`, `npm run lint`, `npm run format`
- **Testing:** `npm run test` (Unit), `npm run test:e2e` (E2E)

---

## 3. Development Conventions
- **Modular Architecture:** Organize by feature (e.g., `src/auth`, `src/users`).
- **Prisma 7 Compatibility:** 
  - Prisma 7 requires explicit connection handling via Driver Adapters.
  - Use `src/prisma/prisma.service.ts` (implements `PrismaPg` adapter and connection pooling).
  - Do NOT pass connection URLs directly to `super()`.
- **Testing:**
  - Unit tests live beside implementation as `*.spec.ts`.
  - Mock external dependencies (`PrismaService`, `JwtService`, etc.).
  - Global Jest types are enabled in `tsconfig.json`.
- **Validation:** Use `class-validator` and `class-transformer` in DTOs.

---

## 4. Key Files Reference
- `prisma/schema.prisma`: Database schema.
- `prisma.config.ts`: Prisma 7 connection configuration.
- `src/prisma/prisma.service.ts`: Database service with driver adapter.
- `src/auth/`: Core authentication logic and strategies.
- `src/users/`: User and profile management.

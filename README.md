## Export Software Frontend

Built on top of [fe-zen-arch](git@github.com:shivamkj/fe-zen-arch.git) — the core shared architecture for B2B SaaS frontends.

### Libraries

- **React** [Docs](https://react.dev/reference/react)
- **Tailwind CSS** [Docs](https://tailwindcss.com/docs/installation)
- **React Query** [Docs](https://tanstack.com/query/latest/docs/framework/react/overview)
- **React Hook Form** [Docs](https://www.react-hook-form.com/get-started)
- **Zustand** [Docs](https://zustand.docs.pmnd.rs/)

### Setup

```bash
pnpm install   # fe-zen-arch is included as a git submodule, init it first if missing
pnpm dev       # dev server on port 5173
pnpm lint      # prettier + tsc + eslint (fe-zen-arch lint pipeline)
pnpm build     # production build
```

### Notes

- `core`, `ui`, `auth`, `icons` are fe-zen-arch workspace packages, aliased via tsconfig paths & vite aliases.
- Forms are built directly with `useForm` from `core/form` + `Form` / `SubmitButton` from `core/form/components` — no generic form templates.
- Routing uses fe-zen-arch's zustand router: routes defined in `src/shared/routes.tsx`, paths in `src/shared/route-paths.ts`.
- Auth uses the fe-zen-arch auth module (routes, interceptors, login pages) out of the box.
- API base URL comes from `PUBLIC_API_URL` (`.env`).
- Don't use react-query mutation for react-hook-form submit handler.
- For HMR (hot refresh), the file must export only react component, and not any other constant or object.
- While most input elements use `...register('name')`, custom elements like select require `<Select<T> name="name" />` instead.

---

## AI Usage & Approach

### 1. AI Tools & Environment
* **AI Coding Assistant:** Google Antigravity IDE powered by Google DeepMind advanced agentic AI.
* **Autonomous Tooling:** File system inspection (`list_dir`, `view_file`, `grep_search`), structured file edits (`replace_file_content`, `write_to_file`), and verification (`run_command` executing `pnpm`, `tsc`, `vite build`, and `prettier`).

### 2. Workflow & Step-by-Step Approach

1. **Repository Inspection & Discovery:**
   * Inspected monorepo configuration (`pnpm-workspace.yaml`, `.gitmodules`, `package.json`, `tsconfig.json`, `vite.config.js`).
   * Located the core shared architecture in submodule `fe-zen-arch` (`core`, `ui`, `icons`).
   * Located the existing Shipping Bill creation form at `src/shipping-bills/shipping-bill-form.tsx` (1,762 lines).
   * Verified that no new dependencies were required.

2. **Architectural Analysis & Problem Identification:**
   * Diagnosed that `shipping-bill-form.tsx` was a monolithic God-component combining validation schemas, 5 dynamic field arrays, async search, UI cards, draft persistence, and API calls.
   * Discovered existing TypeScript compiler errors in the base file (unused imports, incorrect `clsx` argument count, and missing generic typing on `InputError`).
   * Identified absence of unified async mock services, empty-state indicators for dynamic lists, and submission loading states.

3. **Modular Refactoring:**
   * **Data Access Layer (`src/shipping-bills/services/`):**
     * Created `options-mock-service.ts` providing Promise-based async methods for ports, document codes, marks & numbers, schemes, units, states, and metadata with realistic network latency.
     * Created `shipping-bill-mock-service.ts` for asynchronous Shipping Bill creation, draft saving, bill retrieval, and graceful offline fallback.
   * **Validation Layer (`src/shipping-bills/schema/`):**
     * Extracted `bill-validation.ts` containing `billSchema`, `positiveNumber`, and `nonNegativeNumber` refinements.
   * **Custom Hooks (`src/shipping-bills/hooks/`):**
     * Built `use-shipping-bill-form.ts` encapsulating form initialization, 5 field arrays, tab synchronization, draft persistence, error-driven tab switching, and submission orchestration.
     * Built `use-async-options.ts` for managing async data lifecycle states (`isLoading`, `isError`, `isEmpty`, `refetch`).
   * **UI Component Layer (`src/shipping-bills/components/`):**
     * Common: `AsyncSearchSelect` (with loading spinner, empty state, and retry action), `SectionHeading`, `AdvancedAccordion`, `PersistentTab`, `EmptyCardState`, `PartyFields`.
     * Details Tab: `ShipmentBasicsSection`, `RouteSection`, `PackageDetailsSection`.
     * Invoices Tab: `InvoiceListSection`, `InvoiceEditorCard`, `GoodsItemCard` (with dynamic drawback fields, HS codes, and inline calculations).
     * Others Tab: `ContainersSection`, `DocumentsSection`, `LicensesSection`.
     * Actions: `FormNavigationBar` (with loading indicator and submission protection).
   * **Page Orchestrator:**
     * Streamlined `shipping-bill-form.tsx` into a clean, readable orchestrator (~120 lines) exporting default `ShippingBillPage` for HMR compliance.

### 3. Key Architectural Decisions & Trade-offs
* **Zero Dependencies Added:** Kept strictly to the workspace packages (`fe-zen-arch/core`, `fe-zen-arch/ui`) and packages already installed.
* **Persistent Tab Rendering:** Retained hidden fields in the DOM across tab navigation so React Hook Form validates the entire multi-tab bill on submission.
* **Resilient Service Abstraction:** Decoupled persistence logic so that `shipping-bill-mock-service.ts` works seamlessly offline with `demo-store.ts` while remaining ready for a real REST API endpoint swap.
* **Strict Type Safety:** Resolved all TypeScript typing issues (e.g. `FormContextData<ShippingBillFormValues>` and `InputError<ShippingBillFormValues>`).

### 4. Verification & Checks Performed
* **TypeScript Compilation:** Executed `npx tsc --noEmit` — passed with 0 errors.
* **Production Build:** Executed `npx vite build -- src/index.tsx` — built successfully in ~6.5s.
* **Code Formatting:** Executed `npx prettier --write "src/shipping-bills/**/*.{ts,tsx}"` — formatted to repository standards.


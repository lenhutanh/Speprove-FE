# Speprove UI & Layout Guidelines (Strict Rules)

This document is the single source of truth for all UI design guidelines, layout structures, spacing scales, and color systems in the Speprove-FE codebase. All developers and AI agents **MUST** strictly adhere to these rules.

---

## 1. Layout & Container Rules (MUST)

To prevent fragmented page widths and custom wrapper implementations:

- **MANDATORY RULE:** All standard content pages **MUST** wrap their main content in the shared `<Container>` component imported from `@/components/layout/container`. Writing custom `max-w-*` or `mx-auto` outer wrappers at the page level is strictly forbidden.
- **Standard Container Sizes (`size` prop):**
  - `default` (Default - max width `1320px` / `max-w-330`): Used for most screens (Forecast listings, Dashboard, main catalogs).
  - `narrow` (Narrow - max width `1152px` / `max-w-6xl`): Used for focused content pages (Forecast Details, Mock Test Room layout).
  - `small` (Small - max width `768px` / `max-w-3xl`): Used for advanced settings grids or mid-size panels.
  - `form` (Form - max width `448px` / `max-w-md`): Used for narrow forms and authentication cards (Login, Register, Reset Password).
  - `full` (Full screen): Used for workspace layouts (Practice rooms) requiring full viewport utilization.
- **Responsive Page Padding:** The Container component **MUST** integrate standard responsive horizontal padding: `px-4 sm:px-6 lg:px-8` to ensure content does not touch screen edges on mobile devices.

---

## 2. Existing Pattern Consistency (MUST)

When modifying or adding features:

- **MANDATORY RULE (MUST):** Always reuse the existing visual and interaction patterns. Match spacing, typography, card structures, and action placements already used in neighboring screens.
- **PROHIBITED (MUST NOT):** Do not redesign a feature or introduce a new layout layout in isolation if similar visual patterns already exist in the app.

---

## 3. Shared Component Reuse & Modification Policy (MUST)

Before creating a new UI pattern, component, or layout abstraction:

- **MANDATORY CHECK:** Verify if a suitable component already exists in:
  1.  `src/components/ui/` (Shared primitive elements)
  2.  `src/components/form/` (Form field wrappers)
  3.  `src/components/layout/` (Layout grids and blocks)
- **Shadcn First Principle:** For common application patterns (Dialog, Sheet, Drawer, Popover, Table, Form, Combobox, Calendar, Command), prefer the official shadcn implementation before creating custom solutions. Always query the shadcn MCP registry first.
- **PROHIBITED (MUST NOT):** Do not create duplicate abstractions or custom wrappers that overlap with existing shared components. Reuse first, customize only when necessary.

### Shared Component Modification Policy

Shared components are considered reusable application primitives. Before modifying an existing shared component:

- Verify that the change benefits most or all usages of the component.
- Feature-specific requirements **MUST** be implemented through composition, variants, or local wrappers. Do not modify shared primitives solely to satisfy a single page, route, or feature.

**Examples of acceptable modifications:**

- Accessibility improvements
- Bug fixes
- Dark mode fixes
- New reusable variants
- Global design system updates

**Examples of prohibited modifications:**

- Styling changes required by a single page
- Route-specific layouts
- Feature-specific business logic

---

## 4. Color & Accent Role Conventions

Speprove uses a semantic color tokens system registered in `src/app/globals.css`.

- **PROHIBITED (MUST NOT):** Using arbitrary gray/slate/zinc color utilities for page layouts, surfaces, and primary text (e.g. `bg-gray-100`, `text-slate-700`). Doing so breaks dark mode styling.
- **MANDATORY (MUST):** Always use semantic color tokens to ensure out-of-the-box Dark/Light mode compatibility:
  - Page background: `bg-background`
  - Card background: `bg-card`
  - Borders: `border-border` or `border-input`
  - Primary text: `text-foreground`
  - Muted/Supporting text: `text-muted-foreground`
  - Hover state background: `hover:bg-accent` / `hover:text-accent-foreground`
- **Accent Color Roles:** State indicators and semantic badges may use approved accent colors.
  - **Success** (High scores $\ge$ 7.0, successful attempts, active states)
  - **Warning** (Costs/Points, balance checks, pending actions)
  - **Error** (Validation errors, failed actions, dangerous operations)
  - **Learning** (Audio player, vocabulary lists, study hints)
  - **Exam** (Mock test room UI, test progress indicators)
- **Preferred Accent Mappings:**
  - Success $\rightarrow$ **Emerald**
  - Warning $\rightarrow$ **Amber**
  - Error $\rightarrow$ **Red**
  - Learning $\rightarrow$ **Indigo**
  - Exam $\rightarrow$ **Blue**
  - _Note:_ These mappings represent preferred application conventions and should be preferred when introducing new UI elements. Existing screens may contain historical variations.

---

## 5. Responsive Breakpoint Standards (MUST)

To maintain a clean responsive codebase:

- **MANDATORY RULE:** Always use Tailwind's default responsive breakpoints:
  - `sm`: `640px`
  - `md`: `768px`
  - `lg`: `1024px`
  - `xl`: `1280px`
  - `2xl`: `1536px`
- **PROHIBITED (MUST NOT):** Do not write custom inline media queries or arbitrary range class modifiers (e.g., `min-[900px]:`, `max-[1100px]:`) unless absolutely necessary.

---

## 6. Card & Panel Standards (Prefer)

- **Card Reuse:** Always check for and prefer existing shared card components first (e.g., `ForecastCard` or `PackageCard`). Only use the default card style when no suitable shared component exists.
- **Default Card Style:** When creating a standard content panel or container card, prefer using the following class combination:
  `bg-card border rounded-xl p-4 sm:p-5 transition-all`
- **Inner Division:** Avoid nesting cards within cards. Use `<Separator />` or standard border utilities (`border-t`, `divide-y`) to separate content sections instead.

---

## 7. Form & Validation Standards (MUST)

- **MANDATORY RULE:** All form structures **MUST** use the wrapper field components located in `src/components/form/` (e.g., `InputField`, `PasswordField`, `TextAreaField`, `CheckboxField`, `RadioGroupField`).
- **Underlying Components:** If custom form layouts are required, always wrap inputs inside Shadcn's form primitives: `FormField`, `FormItem`, `FormLabel`, `FormMessage` from `src/components/ui/form.tsx`.
- **PROHIBITED (MUST NOT):** Do not write raw `<label>` or `<input>` tags, or manually compile inline error blocks (e.g., `<span>{errors.message}</span>`).

---

## 8. Component Hierarchy & Action States

- **MANDATORY RULE:** Never write raw HTML elements if a shared primitive exists in `src/components/ui/` or `src/components/form/` (e.g., use `<Button>` instead of `<button>`, `<Input>` instead of `<input>`).
- **State Affordance:** Custom interactive components **MUST** explicitly define hover, focus-visible, active, and disabled states.
- **Primitive Exemption:** Shared primitives from `src/components/ui/` already satisfy hover/focus requirements and **MUST NOT** reimplement or clutter elements with custom focus/disabled utility classes unless customization is explicitly needed.

---

## 9. Spacing & Typography Scales

- **Typography Hierarchy:**
  - Page Titles: `text-xl font-semibold sm:text-2xl`
  - Section Headers / Card Titles: `text-sm font-semibold` or `text-base font-semibold`
  - Muted captions / Metadata: `text-xs` or `text-sm text-muted-foreground`
  - _Application Scope:_ These typography scales are default standards for application screens, dashboards, settings, and forms. Marketing or landing page layouts may scale typography independently as needed.
- **Spacing Grid:** Layout spacings must adhere to a strict 4px/8px factor scale:
  - Section spacing: `space-y-6` or `gap-6`
  - Component layout gaps: `space-y-4` or `gap-4`
  - Card inner padding: `p-4` or `p-5`

---

## 10. State Standards (MUST)

Every dynamic, data-driven screen or resource list **MUST** handle the following states:

- **Loading State:** Provide appropriate feedback (e.g., `Skeleton` cards that mimic the final page layout, or local inline spinners). Do not display blank blocks.
- **Empty State:** Empty states should be visually centered, clearly explain the situation, and guide the user toward the next action.
- **Error State:** Show helpful error messages or alert dialogs using `Sonner` toasts or inline error alerts.

---

## 11. Iconography Standards (MUST)

- **MANDATORY RULE:** Use only **Lucide** icons (from `lucide-react`) for buttons, indicators, and navigation labels.
- **Icon Reuse:** Prefer icons from `lucide-react` already imported throughout the codebase.
- **PROHIBITED (MUST NOT):** Do not install or import icons from other libraries (e.g., FontAwesome, Heroicons, Remix Icons) to keep visual styles uniform.

---

## 12. Accessibility Standards (MUST)

- **Icon-only buttons:** All buttons containing only an icon (e.g. delete buttons, trigger icons) **MUST** have an explicit `aria-label` or `title` prop.
- **Form fields:** All inputs must be associated with a label (e.g., via `FormLabel` or `htmlFor`).
- **Keyboard Navigation:** Non-native interactive elements (e.g. clickable divs) **MUST** provide keyboard accessibility via `tabIndex` and keyboard handlers (e.g. Enter/Space key down listeners). Native controls (button, input, anchor) should rely on their default behavior and should not be cluttered with unnecessary `tabIndex` attributes.

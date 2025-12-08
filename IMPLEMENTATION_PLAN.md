- **Scroll Reveal**: Elements (text, images, cards) fade in and move up slightly as they enter the viewport.
- **Buttons & Links**:
  - Hover: Magnetic effect or subtle scale/lift.
  - Click: Ripple effect or active scale down.
  - Focus rings for accessibility with a modern style.
- **Loading States**: Custom animated skeleton loaders or a branded spinner for data fetching.

### 2. Home Page

- **Hero Section**:
  - Text stagger animation (Headline → Subtext → CTA).
  - Background parallax or slow zoom effect on images.
- **Service Cards**:
  - Hover: Card lifts up (`translateY`), shadow deepens, icon pulses or rotates.
  - Entrance: Staggered fade-in when scrolling to the section.
- **Testimonials/Portfolio Preview**:
  - Smooth carousel transitions (auto-play with pause on hover).

### 3. Services Pages (Design, Print, Training)

- **Feature Lists**: Staggered entrance for list items (one by one).
- **Pricing/Commitment Cards**:
  - "Pop" effect on hover.
  - Highlight "Recommended" or "Popular" options with a subtle glow.
- **Images**:
  - Parallax scrolling for section backgrounds.
  - Interactive hover states (zoom in within container).

### 4. Portfolio Page

- **Filtering**: Smooth layout reorganization (`LayoutGroup` from framer-motion) when changing categories.
- **Grid Items**:
  - Hover: Overlay slides in with details, image zooms slightly.
  - Click: Hero transition to detail view (if applicable) or lightbox opening.

### 5. Navigation & Footer

- **Navbar**:
  - Glassmorphism effect (blur background) on scroll.
  - Mobile Menu: Smooth slide-in/drawer animation.
- **Footer**: Social icons hover bounce/color fill.

---

## Phase 2: Admin Dashboard (Secondary)

### 1. Dashboard Overview

- **Stats Cards**:
  - Count-up animation for numbers (0 → 1,234).
  - Entrance animation (slide in from bottom).
- **Charts (Future)**: Draw-in animations for line/bar charts.

### 2. Data Tables (Transactions, Invoices, etc.)

- **Rows**:
  - Hover highlight (light background change).
  - New rows (e.g., after creation) flash briefly.
- **Actions**: Tooltips with smooth fade-in.

### 3. Interactive Elements

- **Modals**:
  - Backdrop fade-in.
  - Modal panel scale-in (0.95 → 1.0) and fade-in.
- **Notifications/Toasts**: Slide in from top-right, auto-dismiss with progress bar.
- **Sidebar**: Smooth collapse/expand transition (if collapsible).

## Technical Approach

- **Library**: `framer-motion` (already installed).
- **CSS**: Tailwind CSS `transition-*`, `duration-*`, `ease-*` classes for simple micro-interactions.
- **Performance**: Use `will-change` sparingly; prefer `transform` and `opacity` changes to avoid layout thrashing.

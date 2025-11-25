# Design Guidelines: Corporate Budget & Settlement Visualization System

## Design Approach
**Skeuomorphic Dashboard Design** - A data-intensive financial application with realistic depth, textures, and physical metaphors. Drawing inspiration from classic iOS design principles combined with modern dashboard patterns from Tableau and Power BI for data visualization clarity.

## Core Design Principles
1. **Realistic Depth**: Multi-layered interface with pronounced shadows and elevation
2. **Tactile Textures**: Subtle gradients and material-like surfaces for cards and panels
3. **Physical Metaphors**: Components that mimic real-world objects (paper, metal, glass)
4. **Data Clarity**: Skeuomorphic elements enhance, not distract from financial data

## Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - UI elements, labels, body text
- Data/Numbers: 'Roboto Mono' (Google Fonts) - financial figures, tables

**Hierarchy:**
- H1: 2xl (36px), font-bold - Dashboard title
- H2: xl (24px), font-semibold - Section headers
- H3: lg (20px), font-medium - Card titles
- Body: base (16px), font-normal - General content
- Data: base (16px), font-medium - Numbers and metrics
- Caption: sm (14px), font-normal - Labels and secondary info

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8 (consistent 8px grid system)

**Structure:**
- Sidebar: Fixed 280px width (w-70), full height with overflow-y-auto
- Main Dashboard: Remaining width with max-w-screen-2xl, mx-auto
- Content padding: p-6 on desktop, p-4 on mobile
- Card gaps: gap-6 for grid layouts
- Section spacing: mb-8 between major sections

**Grid System:**
- KPI Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Charts: grid-cols-1 lg:grid-cols-2 for paired visualizations
- Full-width charts: Single column when detail is critical

## Skeuomorphic Component Design

**Sidebar:**
- Background: Subtle vertical gradient suggesting brushed metal
- Inset shadow at top for depth
- Menu items: Raised appearance on hover with soft glow
- Active state: Pressed inset effect with darker background

**KPI Cards:**
- Glossy finish with subtle radial gradient overlay
- Pronounced drop shadow (shadow-xl with custom blur)
- Inner highlight line at top edge for glass effect
- Beveled borders using multiple nested divs with gradients
- Icon badges with metallic gradient backgrounds
- Trend indicators: Arrow icons with soft glow effects

**Charts:**
- Card containers with layered paper texture effect
- Chart titles on embossed header bars
- Legend items with subtle raised appearance
- Tooltips: Floating glass panels with backdrop blur

**Data Table:**
- Header: Dark gradient suggesting leather or dark wood
- Rows: Alternating subtle texture patterns
- Borders: Embossed separator lines between rows
- Sort icons: Metallic appearance with shine gradient
- Pagination: Button group with raised/pressed states

**Filter Components:**
- Date pickers: Calendar icon with metallic sheen
- Dropdowns: Beveled select boxes with inner shadow
- Apply button: Primary action with glossy gradient and specular highlight
- Reset button: Secondary with flat matte appearance

**Dark Mode Toggle:**
- Switch with realistic slider mechanism
- Track: Inset groove effect
- Thumb: Glossy sphere with specular highlight and reflection
- Smooth transition (300ms) between states

## Chart Specifications

**Bar Chart (Department Budget):**
- 3D-effect bars with gradient fills from light to dark
- Top edge highlight for cylindrical appearance
- Y-axis with subtle grid lines (dashed, low opacity)
- Hover: Bar raises slightly with increased shadow

**Line Chart (Execution Rate Timeline):**
- Thick stroke (3px) with subtle shadow underneath
- Data points: Circular markers with ring highlight
- Area fill: Gradient from line color to transparent
- Grid: Subtle embossed lines

**Donut Chart (Budget vs Actual):**
- 3D ring effect with inner/outer shadows
- Center: Inset circle displaying total with raised text
- Segments: Gradient fills suggesting curved surface
- Legend: Color swatches with glossy finish

## Data Table Features

**Layout:**
- Sticky header with gradient background
- Row height: Comfortable spacing (h-14)
- Column alignment: Numbers right-aligned, text left-aligned
- Action icons: Subtle button style with hover glow

**Interactive Elements:**
- Sort arrows: Toggle between neutral/ascending/descending states
- Filters: Icon buttons with active state highlighting
- CSV Download: Icon button with download animation on click
- Pagination: Numeric buttons with current page raised effect

## Mobile Responsive Adaptations

**Breakpoint Strategy:**
- Mobile (base): Sidebar becomes slide-out drawer with hamburger menu
- Tablet (md: 768px): 2-column KPI cards, stacked charts
- Desktop (lg: 1024px): Full 4-column KPIs, side-by-side charts

**Mobile Optimizations:**
- Sidebar: Full-width overlay with backdrop blur
- KPI Cards: Stack to single column, maintain skeuomorphic depth
- Charts: Reduce height, simplify tooltips for touch
- Tables: Horizontal scroll with sticky first column
- Filters: Collapsible accordion sections

## Dark Mode Implementation

**Color Inversion:**
- Light surfaces become dark with inverted gradients
- Shadows become highlights and vice versa
- Maintain skeuomorphic depth perception through contrast
- Charts: Darker backgrounds with brighter data colors
- Text: High contrast ratios maintained (WCAG AA minimum)

**Transition:** All elements transition smoothly (transition-colors duration-300)

## Accessibility Standards

- Focus states: Prominent outline with glow effect (ring-4 ring-offset-2)
- Color contrast: Minimum 4.5:1 for text, 3:1 for UI components
- Keyboard navigation: Full support with visible focus indicators
- Screen readers: Semantic HTML, ARIA labels for charts and interactive elements
- Touch targets: Minimum 44x44px for all interactive elements

## Animation Guidelines

**Subtle Enhancements:**
- Card hover: Slight elevation increase (translate-y-1) with shadow expansion
- Button interactions: Scale down on press (scale-95), return on release
- Chart loading: Fade-in with stagger effect for data points
- Filter application: Brief pulse animation on updated components
- Drawer open/close: Slide transition with easing

**Performance:** Use transform and opacity only, avoid layout-triggering animations

## Images

This dashboard does not require hero images or decorative photography. All visual elements are functional (charts, graphs, data visualizations).
# Design Guidelines: Bangladesh National Voting System (বাংলাদেশ জাতীয় ভোটিং সিস্টেম)

## Design Approach
**System-Based Approach** using principles from Material Design and government digital services (GOV.UK, US Web Design System) - prioritizing trust, accessibility, and clarity for a democratic civic application. This is a function-critical system where user confidence and ease of use are paramount.

## Core Design Principles
1. **Trust Through Transparency**: Visual design communicates security, legitimacy, and governmental authority
2. **Bengali-First Interface**: All primary content in Bangla with clear typography
3. **Accessibility Excellence**: WCAG 2.1 AAA compliance for diverse user base
4. **Progressive Disclosure**: Complex blockchain concepts simplified through clear UI

## Color Palette

### Light Mode
- **Primary (Bangladesh Green)**: 160 70% 35% - represents national flag, used for CTAs and key actions
- **Secondary (Deep Red)**: 0 75% 40% - national flag accent, used sparingly for verification badges
- **Background**: 0 0% 98% - soft white for main backgrounds
- **Surface**: 0 0% 100% - pure white for cards and elevated elements
- **Text Primary**: 0 0% 13% - near black for main content
- **Text Secondary**: 0 0% 45% - medium gray for supporting text
- **Success**: 142 70% 45% - vote confirmation states
- **Warning**: 38 90% 50% - alert states
- **Border**: 0 0% 88% - subtle dividers

### Dark Mode  
- **Primary**: 160 60% 50% - adjusted for dark backgrounds
- **Secondary**: 0 65% 55% - softer red for dark mode
- **Background**: 0 0% 10% - deep charcoal
- **Surface**: 0 0% 14% - elevated cards
- **Text Primary**: 0 0% 95% - near white
- **Text Secondary**: 0 0% 65% - muted for hierarchy
- **Border**: 0 0% 25% - visible but subtle

## Typography

### Font Families
- **Primary**: 'Noto Sans Bengali', 'Hind Siliguri' - Google Fonts for Bengali text (via CDN)
- **English Fallback**: 'Inter', system-ui - for NID numbers and technical elements
- **Monospace**: 'JetBrains Mono' - for blockchain hashes and verification codes

### Type Scale
- **Hero/H1**: text-5xl (48px) font-bold - page titles
- **H2**: text-3xl (30px) font-semibold - section headers  
- **H3**: text-xl (20px) font-semibold - card headers
- **Body**: text-base (16px) - main content
- **Caption**: text-sm (14px) - metadata, timestamps
- **Code/Hash**: text-sm font-mono - blockchain hashes

## Layout System

### Spacing Primitives
Use Tailwind units: **2, 4, 6, 8, 12, 16, 20** for consistent rhythm
- Micro spacing (between related elements): 2, 4
- Component internal: 6, 8
- Section spacing: 12, 16, 20
- Page margins: 16, 20

### Grid & Containers
- **Max Width**: max-w-7xl (1280px) for main content
- **Form Containers**: max-w-md (448px) for login/signup
- **Dashboard**: max-w-6xl (1152px) for voting interface
- **Statistics**: Full width with max-w-7xl inner container

## Component Library

### Navigation
- **Top Navigation Bar**: Fixed header with Bangladesh flag colors (green/red accent), contains logo (জাতীয় ভোটিং সিস্টেম), user profile, logout
- **Language Toggle**: Bengali/English switcher (Bengali default)
- **Breadcrumb**: For geographic navigation (বিভাগ → জেলা → উপজেলা → ওয়ার্ড)

### Authentication Components
- **Login Card**: Centered card (max-w-md) with National Emblem header, NID input, password field, "লগইন করুন" button
- **Input Fields**: Outlined style with Bengali labels, validation states with clear error messages in Bangla
- **Demo Credentials Display**: Small info badge showing "পরীক্ষা: ১২৩৪৫৬৭৮৯০ / NoPassword" for testing

### Voting Dashboard
- **Candidate Cards**: Grid layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
  - Party logo/symbol prominent
  - Candidate photo (rounded-lg)
  - Name in large Bengali text
  - Candidate number in badge
  - Party name with color indicator
  - "ভোট দিন" button (disabled after voting)
- **Area Selector**: Dropdown cascade for Division → District → Upazila → Ward selection
- **Vote Status Banner**: Prominent alert showing "আপনি ভোট দিয়েছেন" or "ভোট দেওয়া বাকি" with appropriate colors

### Blockchain Verification
- **Hash Display Card**: 
  - Large monospace hash (e.g., "RHS-134-ABCD...")
  - QR code for mobile verification
  - Timestamp in Bengali numerals
  - Verified checkmark with "যাচাইকৃত" badge
- **Verification Form**: Simple NID input with "যাচাই করুন" button
- **Block Chain Visual**: Simplified linked-block diagram showing vote → candidate → timestamp chain

### Statistics Dashboard
- **Chart Cards**: Elevated cards with rounded corners
  - Pie chart for vote distribution (using Chart.js)
  - Bar charts for regional comparison
  - Real-time vote counter with animated numbers
- **Geographic Filter**: Tab-based selection (ওয়ার্ড | জেলা | বিভাগ | সম্পূর্ণ দেশ)
- **Party Legend**: Color-coded list with party symbols
  - Jamaat-e-Islami: 200 60% 40%
  - BNP: 45 70% 50%
  - NCP: 270 65% 45%
  - Jatiya Party: 25 75% 55%

### Data Display
- **Vote Receipt**: Printable card with:
  - Voter info (name, NID - partially masked)
  - Candidate details
  - Blockchain hash
  - QR verification code
  - Official seal graphic
- **Profile Card**: Shows name, NID, address, voting status with clear visual indicators

### Admin Panel
- **Data Tables**: Striped rows, sortable columns, pagination
- **Regional Map**: Interactive Bangladesh map showing vote distribution
- **Alert System**: Color-coded notifications for system status

### Forms & Inputs
- **Text Inputs**: Outlined with floating Bengali labels, focus states with primary color
- **Dropdowns**: Custom styled with Bengali text, hierarchical for geographic selection
- **Radio Buttons**: Large touch targets for candidate selection, visual feedback on selection
- **Submit Buttons**: Primary green, full width on mobile, with loading states

### Trust Indicators
- **Security Badges**: "ব্লকচেইন সুরক্ষিত" badge with shield icon
- **Encryption Indicator**: Padlock icon with "এনক্রিপ্টেড" text in header
- **Government Seal**: Bangladesh national emblem in footer
- **Verified Checkmarks**: Green checkmarks for confirmed actions

## Animations & Interactions
Use sparingly - only for feedback and trust building:
- **Vote Confirmation**: Gentle scale animation (scale-105) on button press, success checkmark animation
- **Loading States**: Subtle spinner for blockchain verification
- **Number Counters**: Smooth counting animation for statistics
- **Hash Generation**: Brief shimmer effect when generating blockchain hash

## Images

### Hero Section (Login/Landing Page)
- **Large Hero Image**: Bangladesh Parliament building or national monument (1920x800px), overlay with gradient (from transparent to 0 0% 10% at 50%)
- **Alternative**: Abstract geometric pattern in national colors (green/red) with subtle blockchain network visualization

### Other Images
- **Candidate Photos**: Square headshots (400x400px minimum), placeholder silhouettes for missing photos
- **Party Logos**: SVG preferred, 100x100px, transparent backgrounds
- **National Emblem**: High-res official seal for headers/footers
- **Verification Graphics**: QR code generation, blockchain chain visualization icons
- **Regional Map**: SVG Bangladesh map with clickable regions

### Icons
Use **Heroicons** (outline style) via CDN for:
- Shield (security), Check (verification), User (profile), Chart (statistics)
- Lock (encryption), Document (receipt), Map (regions), Globe (expatriate)
- Customize with national color accents where appropriate

## Accessibility & Localization
- All form inputs have Bengali labels with English helper text
- High contrast ratios (4.5:1 minimum for text)
- Keyboard navigation for all interactive elements
- Screen reader optimized with Bengali ARIA labels
- RTL support for Bengali text where needed
- Large touch targets (44x44px minimum) for mobile
- Error messages in clear Bengali with recovery instructions

## Responsive Breakpoints
- Mobile: Base styles, single column layouts
- Tablet (md: 768px): Two-column candidate grids, side-by-side forms
- Desktop (lg: 1024px): Three-column grids, expanded navigation
- Wide (xl: 1280px): Full statistics dashboard, multi-panel admin view
# Changelog

All notable changes to the Emotional Mirror app.

## [Phase 2] - December 21, 2025

### ✨ Added - High-Value Intelligence Features

#### 1. Weekly Emotional Summary
- **Text-based weekly analysis** that feels AI-powered
- Analyzes last 7 days: dominant moods, calm periods, peak challenging days
- Recovery pattern recognition with empathetic tone
- Growth tracking comparing this week vs last week
- Trend direction indicators (improving/stable/challenging)
- Example: "This week you felt calm 60% of the time. You found peace in mornings. Challenging moments peaked Monday evenings. You recovered quickly — that's growth."

#### 2. Mood Streaks & Milestones
- **Daily check-in streak** tracking with positive reinforcement
- **Calm mood streak** celebrating consecutive peaceful moments
- **Recovery streak** recognizing bouncing back from challenges
- **8 Achievement milestones**:
  - 🌱 First Step (first check-in)
  - 📅 7 Days of Awareness
  - 🎯 30 Check-ins milestone
  - 🔍 First trigger identified
  - 🔥 7-day streak
  - 🌊 5 consecutive calm moments
  - 💪 Resilient recovery
  - ✍️ First journal entry
- Progress bars for incomplete milestones
- **Non-judgmental language**: "You can restart anytime" (no "you failed")

#### 3. Time-Block Heatmap
- **Simplified 4×7 visualization** (Morning/Afternoon/Evening/Night × Days)
- Color-coded mood intensity (green=calm, red=intense)
- Easier to read than 24-hour breakdown
- Hover tooltips with intensity labels
- Numbers show entry count per block
- Instant pattern revelation: "Now I see when I struggle"

#### 4. Reflection Prompts & Journaling (Phase 1.5)
- **Mood-specific reflection questions** after check-in
- Smart emotional quotes matching your state
- Optional micro-journaling (500 character limit)
- Two-step check-in flow: mood → reflection → save
- Examples:
  - Anxious: "What triggered this? What do you need?"
  - Calm: "What helped you feel this way?"
  - Sad: "What loss are you grieving right now?"

#### 5. Journal View Page
- New dedicated page to browse all journal entries
- Shows mood context with emoji
- Full note text display
- Trigger labels included
- Reflection responses visible

### 🎨 Improved - Enhanced User Experience

#### Mirror Page Redesign
- Weekly summary card at top (purple gradient)
- Streaks & momentum section (orange gradient)
- Milestones grid (blue gradient) with 6 visible achievements
- All original insights preserved below
- Better visual hierarchy

#### Correlations Page Enhancement
- Simplified time-block heatmap added first
- Detailed 24×7 heatmap moved below
- Clear section headers distinguishing both views
- Better mobile responsiveness

### 📱 Mobile Responsiveness (Continued)
- All new components fully responsive
- Touch-friendly interactions
- Proper text scaling (10px-16px based on screen)
- Optimized for 320px-1920px viewports

### 🔧 Technical

#### New Utilities
- `src/utils/weeklySummary.ts` - Weekly analysis logic
- `src/utils/streaks.ts` - Streak calculation & milestone generation
- `src/utils/reflections.ts` - Mood-specific prompts & quotes

#### New Components
- `src/components/TimeBlockHeatmap.tsx` - Simplified heatmap
- `src/components/ReflectionPrompt.tsx` - Question display
- `src/components/JournalInput.tsx` - Note input with counter

#### Updated Components
- `src/app/mirror/page.tsx` - Integrated weekly summary, streaks, milestones
- `src/app/check-in/page.tsx` - Added reflection & journaling flow
- `src/app/correlations/page.tsx` - Added time-block heatmap
- `src/components/NavBar.tsx` - Added Journal route

#### Data Model Extensions
- Added `notes?: string` to EmotionEntry
- Added `reflection?: string` to EmotionEntry

### 📊 Impact

**Before Phase 2:**
- Basic mood tracking
- Pattern insights (5 types)
- Timeline view
- Heatmap correlations

**After Phase 2:**
- ✅ Feels "AI-powered" with weekly summaries
- ✅ Gamification without pressure (streaks/milestones)
- ✅ Deeper introspection (reflection prompts)
- ✅ Easier pattern recognition (time-block view)
- ✅ More emotional engagement
- ✅ Better retention through momentum tracking

---

## [Phase 1.5] - December 2025

### Added - Responsive Design Overhaul
- Mobile-first CSS with responsive breakpoints
- Touch-friendly components (active states, larger tap targets)
- Responsive typography (14px mobile → 16px desktop)
- All pages optimized for 320px-1920px screens
- NavBar condensed for mobile
- Heatmap horizontal scroll on small screens

### Fixed
- Next.js viewport metadata warnings (moved to `export const viewport`)
- Overflow issues on mobile devices

---

## [Phase 1] - Initial Release

### Added - Core Features
- Daily micro check-ins (mood + trigger)
- IndexedDB local storage
- Pattern detection insights (5 types)
- Timeline view
- Mirror insights page
- 24×7 mood correlation heatmap
- Emotional hotspots calculation
- Privacy-first, offline-first architecture
- Warm pastel UI design
- No-scrollbar design philosophy

---

## Philosophy

All features maintain:
- ✅ **Non-judgmental language** ("You can restart anytime")
- ✅ **Privacy-first** (all data local)
- ✅ **Empathetic tone** (growth-focused, not blame-focused)
- ✅ **No external dependencies** (rule-based, not AI/ML)
- ✅ **Offline-capable** (works without internet)

---

**Product North Star:** "Understand yourself first. Relationships change naturally after that."

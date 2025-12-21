# Commit Message

```
feat(phase-2): add weekly summaries, streaks, milestones & time-block heatmap

## High-Value Intelligence Features

### 1. Weekly Emotional Summary (src/utils/weeklySummary.ts)
- Text-based analysis of last 7 days with empathetic tone
- Dominant mood percentage, calm periods, peak challenging days
- Recovery pattern recognition & growth tracking
- Trend direction (improving/stable/challenging)
- Generates human-feeling insights without ML/AI

### 2. Streaks & Milestones System (src/utils/streaks.ts)
- Daily check-in streak tracking with positive reinforcement
- Calm mood streak celebrating peaceful moments
- Recovery streak recognizing resilience
- 8 achievement milestones with progress bars
- Non-judgmental language ("restart anytime" not "you failed")

### 3. Time-Block Heatmap (src/components/TimeBlockHeatmap.tsx)
- Simplified 4×7 grid (Morning/Afternoon/Evening/Night × Days)
- Color-coded mood intensity (green=calm → red=intense)
- Easier pattern recognition than 24-hour version
- Hover tooltips, entry counts, responsive design

### 4. Reflection Prompts & Journaling
- Mood-specific questions after check-in (src/utils/reflections.ts)
- Smart emotional quotes matching emotional state
- Optional micro-journaling with 500 char limit
- Two-step flow: mood → reflection → save
- Journal view page for browsing entries

## UI Enhancements

### Mirror Page Redesign (src/app/mirror/page.tsx)
- Weekly summary card (purple gradient)
- Streaks & momentum section (orange gradient)
- Milestones grid (blue gradient) with 6 visible achievements
- Better visual hierarchy with original insights preserved

### Correlations Page (src/app/correlations/page.tsx)
- Added simplified time-block heatmap first
- Detailed 24×7 heatmap moved below with clear headers
- Better mobile responsiveness

### Navigation
- Added Journal route to NavBar
- New /journal page for browsing entries with notes

## Data Model
- Extended EmotionEntry with `notes?: string` field
- Extended EmotionEntry with `reflection?: string` field

## Technical Details

New Files:
- src/utils/weeklySummary.ts (weekly analysis logic)
- src/utils/streaks.ts (streaks & milestones)
- src/utils/reflections.ts (prompts & quotes)
- src/components/TimeBlockHeatmap.tsx (simplified heatmap)
- src/components/ReflectionPrompt.tsx (question display)
- src/components/JournalInput.tsx (note input)
- src/app/journal/page.tsx (journal entries view)
- CHANGELOG.md (phase documentation)

Updated Files:
- src/app/mirror/page.tsx (integrated new features)
- src/app/check-in/page.tsx (added reflection flow)
- src/app/correlations/page.tsx (added time-block view)
- src/components/NavBar.tsx (added journal route)
- src/types/index.ts (extended EmotionEntry)
- README.md (updated with Phase 2 features)

## Impact

Before: Basic tracking with insights
After: Feels "AI-powered", gamified engagement, deeper introspection

All features maintain:
✅ Non-judgmental language
✅ Privacy-first (local data)
✅ Empathetic tone
✅ No external dependencies
✅ Offline-capable

Build: ✓ Successful
```

---

## Short Version (for git commit)

```
feat(phase-2): add weekly summaries, streaks & time-block heatmap

- Weekly emotional summary with empathetic text generation
- Streaks & milestones system (8 achievements, progress tracking)
- Simplified 4×7 time-block heatmap for instant pattern recognition
- Reflection prompts & journaling (mood-specific questions)
- Journal view page for browsing entries
- Mirror page redesigned with summary/streaks/milestones sections
- Extended EmotionEntry with notes & reflection fields

Technical: 7 new files, 6 updated components, fully responsive
Build: ✓ Successful
```

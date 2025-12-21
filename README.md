# 🪞 Emotional Mirror

A gentle, judgment-free web app designed to help you understand your emotional patterns before blaming others. Built with Next.js, TypeScript, and Tailwind CSS.

**Product North Star:** "Understand yourself first. Relationships change naturally after that."

---

## 🎯 Core Concept

People often expect others to change without understanding themselves. **Emotional Mirror** acts as a non-judgmental mirror, reflecting your emotional habits, triggers, and patterns back to you in a gentle, supportive way.

The app helps you:
- ✨ **Recognize patterns** in your emotions
- 🔍 **Discover triggers** that affect your mood
- 📈 **Track your journey** over time
- 🤝 **Own your growth** with self-awareness

---

## 🚀 Features

### 1. **Daily Micro Check-Ins**
- Quick, 1-2 tap interactions (no typing)
- Select your current mood from 5 options:
  - 😊 Calm
  - 😐 Neutral
  - 😟 Anxious
  - 😞 Sad
  - 😠 Frustrated
- Optional trigger selection:
  - Delayed reply
  - Argument
  - Felt ignored
  - Overthinking
  - Unknown

### 2. **Emotional Pattern Detection** ⭐ Key USP
After 5-7 entries, the app generates personalized insights:
- **Frequency Insights**: "You often feel anxious in your recent check-ins"
- **Trigger Patterns**: "Delayed replies tend to trigger anxiety"
- **Emotional Escalation**: "Emotions are building up—consider rest"
- **Withdrawal Patterns**: "You tend to withdraw when overwhelmed"
- **Timing Insights**: "Your evenings bring more intensity"

### 3. **Weekly Emotional Summary** 🆕 **Phase 2**
Text-based weekly analysis that feels "AI-powered":
- Dominant mood percentage
- Peak challenging days and times
- Calm periods identification
- Recovery pattern recognition
- Growth tracking with empathetic tone
- Trend direction (improving/stable/challenging)

**Example Output:**
> "This week you felt calm about 60% of the time. You found the most peace in the mornings (75% calm). Challenging moments peaked on Monday evenings & Thursday afternoons. You recovered quickly from difficult moments — that's real growth. You showed up consistently this week. Your emotional baseline is lifting — that's meaningful progress."

### 4. **Mood Streaks & Milestones** 🆕 **Phase 2**
Gamification without pressure, using positive language:
- **Daily check-in streak**: Tracks consecutive days
- **Calm mood streak**: Celebrates peaceful moments
- **Recovery streak**: Recognizes bouncing back
- **Achievement milestones**:
  - 🌱 First Step (first check-in)
  - 📅 7 Days of Awareness
  - 🎯 30 check-ins milestone
  - 🔍 First trigger identified
  - 🔥 7-day streak
  - 🌊 5 consecutive calm moments
  - 💪 Resilient recovery
  - ✍️ First journal entry

**Key Feature**: No "you failed" language—only "You can restart anytime"

### 5. **Reflection Prompts & Journaling** 🆕 **Phase 1.5**
Guided introspection after check-ins:
- Mood-specific reflection questions
- Smart emotional quotes matching your state
- Optional micro-journaling (500 chars)
- Questions like:
  - Anxious: "What triggered this? What do you need?"
  - Calm: "What helped you feel this way?"
  - Sad: "What loss are you grieving right now?"

### 6. **Time-Block Heatmap** 🆕 **Phase 2**
Simplified 4×7 visualization (Morning/Afternoon/Evening/Night × Days):
- Instant pattern revelation: "This explains a LOT"
- Color-coded mood intensity
- Easier to read than 24-hour breakdown
- Shows when you need support most

### 7. **Emotional Mirror Insight Screen**
Displays:
- Weekly emotional summary (3+ entries)
- Current streaks and momentum
- Achievement milestones with progress
- 3-5 generated insights with confidence scores
- Soft reminders: "This is not about blaming yourself. Awareness creates choice."

### 8. **Timeline View**
Simple vertical timeline showing:
- Date
- Mood emoji
- Trigger label (if selected)
- Chronological order for easy review

### 9. **Journal View**
Browse all journal entries with notes:
- Mood context for each entry
- Full journal text display
- Optional reflection responses
- Trigger labels

### 10. **Mood Correlation Analytics**
Advanced pattern detection:
- 24-hour × 7-day detailed heatmap
- Emotional hotspots (top 10 intense mood-time combos)
- Time-of-day correlation insights
- Weekday vs weekend patterns

### 11. **Privacy-First & Offline-First**
- ✅ **All data stored locally** in IndexedDB
- ✅ **No backend server** required
- ✅ **No authentication** needed
- ✅ **Works offline** completely
- ✅ **Zero cloud tracking**

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS (pastel color palette)
- **Storage**: IndexedDB (browser-based, offline)
- **Insights**: Rule-based pattern detection (no external AI)

---

## 📦 Project Structure

```
emotional-mirror/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── check-in/page.tsx     # Daily check-in with reflection
│   │   ├── mirror/page.tsx       # Insights + summary + streaks
│   │   ├── timeline/page.tsx     # Timeline view
│   │   ├── correlations/page.tsx # Mood pattern heatmaps
│   │   ├── journal/page.tsx      # Journal entries view
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── MoodSelector.tsx      # Mood picker component
│   │   ├── TriggerSelector.tsx   # Trigger picker component
│   │   ├── ReflectionPrompt.tsx  # Mood-specific questions
│   │   ├── JournalInput.tsx      # Optional note input
│   │   ├── InsightCard.tsx       # Insight display card
│   │   ├── TimelineEntry.tsx     # Timeline item
│   │   ├── MoodHeatmap.tsx       # 24×7 detailed heatmap
│   │   ├── TimeBlockHeatmap.tsx  # 4×7 simplified heatmap
│   │   └── NavBar.tsx            # Bottom navigation
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   └── utils/
│       ├── db.ts                 # IndexedDB wrapper
│       ├── insights.ts           # Insight generation logic
│       ├── weeklySummary.ts      # Weekly analysis 🆕
│       ├── streaks.ts            # Streaks & milestones 🆕
│       ├── reflections.ts        # Reflection prompts 🆕
│       ├── correlations.ts       # Time-based patterns
│       └── migration.ts          # Data migration
├── tailwind.config.ts            # Tailwind configuration
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## 💾 Data Model

### EmotionEntry (IndexedDB)
```typescript
{
  id: string                          // Unique identifier
  date: string                        // ISO date (YYYY-MM-DD)
  mood: "calm" | "neutral" | "anxious" | "sad" | "frustrated"
  trigger?: "delayed_reply" | "argument" | "ignored" | "overthinking" | "unknown"
  timestamp: number                   // Milliseconds since epoch
  hour: number                        // 0-23 (for correlations)
  dayOfWeek: DayOfWeek               // Monday-Sunday
  timeOfDay: TimeOfDay               // morning/afternoon/evening/night
  notes?: string                      // Optional journal entry (500 chars)
  reflection?: string                 // Optional reflection response
}
```

---

## 🧠 Insight Generation Logic

### Frequency Analysis
Detects when certain moods dominate (≥40% of entries):
- "You often feel anxious" → Suggests pattern awareness
- "Calm dominates your entries" → Positive affirmation

### Trigger Co-Occurrence
Identifies mood-trigger connections (≥3 occurrences):
- If "delayed_reply" + "anxious" appears ≥3 times:
  → "Delayed replies often trigger anxious feelings"

### Pattern Detection
- **Escalation**: Detects emotional buildup over recent days
- **Withdrawal**: Identifies anxiety → sadness transitions
- "You tend to withdraw when overwhelmed"

### Timing Insights
Analyzes emotional intensity by time of day:
- Morning, afternoon, or evening patterns
- "Your evenings often bring more intensity"

---

## 🎨 Design Philosophy

### Emotional Safety
- **Calm colors**: Pastel blues, roses, purples, ambers
- **Rounded cards**: Soft, approachable UI
- **No red alerts**: No judgmental language
- **Encouraging copy**: "It's okay to notice patterns"

### Micro-Copy Examples
- "You're learning about yourself"
- "This is not about blaming yourself"
- "Awareness creates choice"
- "It's okay to feel this"
- "Understanding comes before change"

---

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

---

## 📱 Page Guide

### Home Page (`/`)
- Welcoming landing screen
- Explains the app's purpose
- "Start Your Check-In" CTA button
- Fully responsive design

### Check-In Page (`/check-in`)
- Mood selector (5 options)
- Optional trigger selector
- Mood-specific reflection prompts 🆕
- Optional journaling (500 chars) 🆕
- Two-step flow: mood selection → reflection → save
- Once-per-day check indicator

### Mirror Page (`/mirror`)
- Weekly emotional summary 🆕
- Current streaks & momentum 🆕
- Achievement milestones 🆕
- Generated insights (after 5+ entries)
- Displays confidence scores
- Emotional safety reminders
- Progress bar for new users

### Correlations Page (`/correlations`)
- Simplified 4×7 time-block heatmap 🆕
- Detailed 24×7 hour-by-hour heatmap
- Emotional hotspots (top 10)
- Pattern insights text

### Journal Page (`/journal`) 🆕
- Browse all journal entries
- Mood context with emoji
- Full note text display
- Trigger labels
- Reflection responses

### Timeline Page (`/timeline`)
- Chronological list of all entries
- Mood emoji + trigger labels
- Entry count display
- Clear history option

---

## 🔐 Privacy & Data

- **✅ Your data is yours**: Stored entirely on your device
- **✅ No servers**: This is a frontend-only app
- **✅ No tracking**: No analytics, no third-party scripts
- **✅ Works offline**: Everything happens locally
- **✅ Portable**: Export/backup via browser DevTools (IndexedDB)

---

## 🤝 Emotional Logic Examples

### Scenario 1: Building Awareness
After 5 entries with "anxious" mood and "delayed_reply" trigger appearing 3 times:
```
Insight Generated:
"Delayed replies often trigger anxious feelings. 
Noticing this connection gives you choices."
```

### Scenario 2: Withdrawal Pattern
Timeline shows: Anxious → Anxious → Sad → Calm
```
Insight Generated:
"You tend to withdraw when overwhelmed. 
This is a natural protection mechanism. 
Self-compassion is key here."
```

### Scenario 3: Timing Pattern
Evening check-ins consistently show frustrated/anxious moods:
```
Insight Generated:
"Your evenings often bring more intensity. 
What's happening then? Is it routine, 
relationships, or energy levels?"
```

---

## 🚫 What This App Does NOT Do

- ❌ Replace therapy or professional help
- ❌ Predict future behavior
- ❌ Make relationship diagnoses
- ❌ Use AI/ML for mood predictions
- ❌ Store data in the cloud
- ❌ Require authentication
- ❌ Show astrology or personality labels

---

## 🎯 Philosophy

This app operates on a simple truth:

> **Most relationship conflicts aren't caused by the other person. They're caused by our unmet expectations, unprocessed emotions, and unexamined patterns.**

By helping you see your own patterns first, you're not blaming yourself—you're taking responsibility. And taking responsibility is the foundation of all healthy change.

---

## 💡 Future Enhancements (Not Implemented)

- Export insights as PDF
- Multi-language support
- Mood trend charts
- Custom mood labels
- Integration with journaling

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🙏 Support

Have questions or ideas? This is a frontend-only app, so all data stays with you. Feel free to use it as a foundation for your own emotional awareness journey.

**Remember**: Understanding yourself first. Relationships change naturally after that. 💚

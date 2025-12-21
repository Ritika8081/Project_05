'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MoodSelector from '@/components/MoodSelector';
import TriggerSelector from '@/components/TriggerSelector';
import ContributorsSelector from '@/components/ContributorsSelector';
import ReflectionPrompt from '@/components/ReflectionPrompt';
import JournalInput from '@/components/JournalInput';
import NavBar from '@/components/NavBar';
import { saveEmotionEntry, getTodaysEntries, detectRecovery, canCreateNewEntry } from '@/utils/db';
import { EmotionEntry, TimeOfDay, DayOfWeek } from '@/types';

export default function CheckInPage() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [selectedContributor, setSelectedContributor] = useState<string | null>(null);
  const [journalNote, setJournalNote] = useState('');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [todaysCheckIns, setTodaysCheckIns] = useState(0);
  const [spamWarning, setSpamWarning] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadTodaysCheckIns();
  }, []);

  const loadTodaysCheckIns = async () => {
    try {
      const entries = await getTodaysEntries();
      setTodaysCheckIns(entries.length);
    } catch (error) {
      console.error('Error loading check-ins:', error);
    }
  };

  const handleSaveCheckIn = async () => {
    if (!selectedMood) {
      alert('Please select a mood');
      return;
    }

    // Show reflection prompt after mood selection
    if (!showReflection) {
      setShowReflection(true);
      return;
    }

    // Check spam prevention
    const canCreate = await canCreateNewEntry();
    if (!canCreate) {
      setSpamWarning(true);
      setTimeout(() => setSpamWarning(false), 3000);
      return;
    }

    setLoading(true);

    try {
      const now = new Date();
      const hour = now.getHours();
      const dayNum = now.getDay();
      const daysOfWeek: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayOfWeek = daysOfWeek[dayNum];
      
      const getTimeOfDay = (hour: number): TimeOfDay => {
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
      };

      // Detect recovery from previous moods
      const recovery = await detectRecovery(selectedMood as any);

      const entry: EmotionEntry = {
        id: `emotion-${Date.now()}`,
        date: now.toISOString().split('T')[0],
        mood: selectedMood as any,
        trigger: selectedTrigger as any,
        contributor: selectedContributor as any,
        timestamp: now.getTime(),
        hour: hour,
        dayOfWeek: dayOfWeek,
        timeOfDay: getTimeOfDay(hour),
        notes: journalNote || undefined,
        recoveryStartMood: recovery.recoveryStartMood,
        recoveryStartTime: recovery.recoveryStartTime,
        recoveryDuration: recovery.recoveryDuration,
      };

      await saveEmotionEntry(entry);
      setTodaysCheckIns(todaysCheckIns + 1);

      setTimeout(() => {
        router.push('/mirror');
      }, 800);
    } catch (error) {
      console.error('Error saving check-in:', error);
      alert('Failed to save check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <main className="flex-1 px-3 sm:px-4 md:px-6 py-3 sm:py-5 max-w-3xl md:max-w-4xl mx-auto w-full overflow-y-auto overflow-x-hidden pb-24 sm:pb-28">
        <div className="text-center mb-4 sm:mb-5">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-900 mb-1">How Are You Feeling?</h1>
          <p className="text-orange-800/70 text-xs sm:text-sm">
            {todaysCheckIns === 0 
              ? 'Check in anytime. Your awareness is building resilience.' 
              : `You've checked in ${todaysCheckIns} time${todaysCheckIns === 1 ? '' : 's'} today. Update anytime.`}
          </p>
        </div>

        <div className="bg-gradient-to-br from-white/90 to-orange-50/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-orange-200/50 space-y-4 sm:space-y-5">
          {spamWarning && (
            <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-3 rounded-lg text-sm">
              ⏱️ Please wait 30 seconds between check-ins to prevent spam logging.
            </div>
          )}
          
          <MoodSelector selectedMood={selectedMood} onChange={setSelectedMood} />

          <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

          {/* Only show triggers for negative emotions: anxious, sad, frustrated */}
          {selectedMood && ['anxious', 'sad', 'frustrated'].includes(selectedMood) && (
            <TriggerSelector selectedTrigger={selectedTrigger} onChange={setSelectedTrigger} />
          )}

          {selectedMood && ['calm', 'neutral'].includes(selectedMood) && (
            <ContributorsSelector
              selectedContributor={selectedContributor}
              onChange={setSelectedContributor}
            />
          )}

          {/* Show reflection prompts after mood selection */}
          {showReflection && selectedMood && (
            <>
              <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
              <ReflectionPrompt mood={selectedMood as any} />
              <JournalInput mood={selectedMood as any} onNoteChange={setJournalNote} />
            </>
          )}

          <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => {
                setSelectedMood(null);
                setSelectedTrigger(null);
                setJournalNote('');
                setShowReflection(false);
              }}
              className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-900 font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 text-sm sm:text-base"
            >
              Clear
            </button>
            <button
              onClick={handleSaveCheckIn}
              disabled={!selectedMood || loading}
              className={`
                flex-1 font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 text-sm sm:text-base
                ${
                  !selectedMood || loading
                    ? 'bg-orange-200 text-orange-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl'
                }
              `}
            >
              {loading ? 'Saving...' : showReflection ? 'Save Check-In' : 'Next'}
            </button>
          </div>
        </div>

        <div className="mt-4 sm:mt-5 bg-gradient-to-r from-orange-50 to-rose-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-200/50">
          <h3 className="font-semibold text-orange-900 mb-2 text-xs sm:text-sm">💡 Why check in?</h3>
          <ul className="space-y-1 text-xs sm:text-sm text-orange-800/80">
            <li>• Build awareness of your patterns</li>
            <li>• Discover emotional triggers</li>
            <li>• Track your journey</li>
          </ul>
        </div>
      </main>
      <NavBar currentPath="/check-in" />
    </div>
  );
}

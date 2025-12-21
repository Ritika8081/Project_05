import { Mood } from '@/types';

export interface ReflectionPrompt {
  questions: string[];
  quote: string;
  suggestion: string;
}

export const reflectionPrompts: Record<Mood, ReflectionPrompt> = {
  calm: {
    questions: [
      'What helped you feel this way?',
      'How can you hold onto this feeling?',
      'What are you grateful for right now?',
    ],
    quote: '"In the midst of chaos, there is also opportunity." - Bruce Lee',
    suggestion: 'Reflect on what brought you peace. Notice these moments.',
  },
  neutral: {
    questions: [
      'What would shift your mood right now?',
      'Are you avoiding or ignoring something?',
      'What small thing could bring you joy today?',
    ],
    quote: '"The greatest glory in living lies not in never falling, but in rising every time we fall." - Nelson Mandela',
    suggestion: 'Neutral moods are often preparing you for growth. Prepare gently.',
  },
  anxious: {
    questions: [
      'What triggered this anxiety? Be specific.',
      'What do you need right now—rest, movement, connection?',
      'What would make you feel safer?',
      'Is this about something that happened, or something you fear might happen?',
    ],
    quote: '"Worry is like a rocking chair: it gives you something to do but gets you nowhere." - Van Trace',
    suggestion: 'Your anxiety is trying to protect you. Listen to what it needs.',
  },
  sad: {
    questions: [
      'What loss are you grieving right now?',
      'What would feel good to do? (even something small)',
      'Who could you reach out to?',
      'What does your sadness want to tell you?',
    ],
    quote: '"Sadness is just love with no place to go." - Jamie Anderson',
    suggestion: 'Sadness is a sign your heart cares deeply. Honor that.',
  },
  frustrated: {
    questions: [
      'What boundary of yours was crossed?',
      'What do you need that you\'re not getting?',
      'What would respect look like right now?',
      'Is this frustration about one thing, or something deeper?',
    ],
    quote: '"Frustration, although quite painful, is a very positive sign." - Robert Kiyosaki',
    suggestion: 'Frustration signals unmet needs or boundaries. Listen to it.',
  },
};

export function getReflectionPrompt(mood: Mood): ReflectionPrompt {
  return reflectionPrompts[mood];
}

export const emotionalQuotes: Record<Mood, string[]> = {
  calm: [
    '"Peace comes from within. Do not seek it without." - Buddha',
    '"The greatest wealth is health." - Virgil',
    '"Serenity is not freedom from the storm, but peace amid the storm." - Unknown',
    '"In a gentle way, you can shake the world." - Mahatma Gandhi',
  ],
  neutral: [
    '"Life is what happens when you\'re busy making other plans." - John Lennon',
    '"The only way to do great work is to love what you do." - Steve Jobs',
    '"Every moment is a fresh beginning." - T.S. Eliot',
  ],
  anxious: [
    '"Anxiety is love\'s greatest gift." - Rainer Maria Rilke',
    '"The brave man is not he who does not feel afraid, but he who conquers that fear." - Nelson Mandela',
    '"Fear is a reaction. Courage is a decision." - Winston Churchill',
    '"You are braver than you believe, stronger than you seem, and smarter than you think." - A.A. Milne',
  ],
  sad: [
    '"The only way out is through." - Robert Frost',
    '"Tears are the silent language of grief." - Voltaire',
    '"Sorrow is how we learn to love." - David Whyte',
    '"What we have once enjoyed, we can never lose. All that we love deeply becomes a part of us." - Helen Keller',
  ],
  frustrated: [
    '"The obstacle is the way." - Marcus Aurelius',
    '"Everything you want is on the other side of fear." - George Addair',
    '"Difficulties strengthen the mind, as labor does the body." - Seneca',
    '"The wound is the place where the light enters you." - Rumi',
  ],
};

export function getRandomQuote(mood: Mood): string {
  const quotes = emotionalQuotes[mood];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export const journalPrompts: Record<Mood, string[]> = {
  calm: [
    'Write about what you\'re appreciating right now...',
    'Describe the feeling of calm in your body...',
    'What would you like to remember about this moment?',
  ],
  neutral: [
    'What are you noticing today?',
    'Write about what you\'re observing without judgment...',
    'What\'s present, but not demanding attention?',
  ],
  anxious: [
    'Write about what you\'re worried about...',
    'What is your anxiety trying to tell you?',
    'What would help you feel grounded right now?',
  ],
  sad: [
    'Write about what you\'re grieving...',
    'What does your sadness want to say?',
    'If your sadness could speak, what would it tell you?',
  ],
  frustrated: [
    'Write about what\'s frustrating you...',
    'What boundary is being crossed?',
    'What would need to change for you to feel respected?',
  ],
};

export function getJournalPrompt(mood: Mood): string {
  const prompts = journalPrompts[mood];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

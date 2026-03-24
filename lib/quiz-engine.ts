import { Place, RegionType, ALL_DATA, INDIA_DATA, AMERICAS_DATA, getTypeLabel, getTypeShortLabel } from './data';

export type QuestionType =
  | 'state_or_ut'          // Given Indian name → is it a State or UT?
  | 'north_or_south'       // Given Americas country → is it North or South America?
  | 'name_the_capital'     // Given state/country → what is the capital?
  | 'name_the_place';      // Given capital → which state/country?

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  correctAnswer: string;
  options: string[];
  place: Place;
}

export interface QuizState {
  currentQuestion: Question | null;
  score: number;
  totalAsked: number;
  correctCount: number;
  streak: number;
  bestStreak: number;
  roundNumber: number;
  roundQueue: string[];   // ids of places not yet asked in current round
  answeredInRound: number;
  lastFeedback: Feedback | null;
}

export interface Feedback {
  wasCorrect: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  place: Place;
  points: number;
  streakBonus: number;
}

// Shuffle an array using Fisher-Yates
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWrongOptions(correct: string, pool: string[], count: number): string[] {
  const filtered = pool.filter(x => x !== correct);
  return shuffle(filtered).slice(0, count);
}

export function generateQuestion(place: Place): Question {
  // Decide question type based on place type
  const questionTypes: QuestionType[] = [];

  if (place.type === 'state' || place.type === 'union_territory') {
    questionTypes.push('state_or_ut');
  }
  if (place.type === 'north_america' || place.type === 'south_america') {
    questionTypes.push('north_or_south');
  }
  questionTypes.push('name_the_capital');
  questionTypes.push('name_the_place');

  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  return buildQuestion(place, type);
}

export function buildQuestion(place: Place, type: QuestionType): Question {
  switch (type) {
    case 'state_or_ut': {
      const options = ['State', 'Union Territory'];
      const correctAnswer = place.type === 'state' ? 'State' : 'Union Territory';
      return {
        id: `${place.id}-sut`,
        type,
        prompt: `Is "${place.name}" an Indian State or a Union Territory?`,
        correctAnswer,
        options,
        place,
      };
    }

    case 'north_or_south': {
      const options = ['North America', 'South America'];
      const correctAnswer = place.type === 'north_america' ? 'North America' : 'South America';
      return {
        id: `${place.id}-ns`,
        type,
        prompt: `Is "${place.name}" a country in North America or South America?`,
        correctAnswer,
        options,
        place,
      };
    }

    case 'name_the_capital': {
      const sameRegionPool =
        place.type === 'state' || place.type === 'union_territory'
          ? INDIA_DATA.map(p => p.capital)
          : AMERICAS_DATA.map(p => p.capital);

      const wrongs = pickWrongOptions(place.capital, sameRegionPool, 3);
      const options = shuffle([place.capital, ...wrongs]);
      return {
        id: `${place.id}-cap`,
        type,
        prompt: `What is the capital of "${place.name}"?`,
        correctAnswer: place.capital,
        options,
        place,
      };
    }

    case 'name_the_place': {
      const sameRegionPool =
        place.type === 'state' || place.type === 'union_territory'
          ? INDIA_DATA.map(p => p.name)
          : AMERICAS_DATA.map(p => p.name);

      const wrongs = pickWrongOptions(place.name, sameRegionPool, 3);
      const options = shuffle([place.name, ...wrongs]);
      return {
        id: `${place.id}-plc`,
        type,
        prompt: `The capital "${place.capital}" belongs to which ${getRegionGroupLabel(place.type)}?`,
        correctAnswer: place.name,
        options,
        place,
      };
    }
  }
}

function getRegionGroupLabel(type: RegionType): string {
  if (type === 'state') return 'Indian State';
  if (type === 'union_territory') return 'Union Territory of India';
  return 'country';
}

export function initQuizState(): QuizState {
  return {
    currentQuestion: null,
    score: 0,
    totalAsked: 0,
    correctCount: 0,
    streak: 0,
    bestStreak: 0,
    roundNumber: 1,
    roundQueue: shuffle(ALL_DATA.map(p => p.id)),
    answeredInRound: 0,
    lastFeedback: null,
  };
}

export function getNextQuestion(state: QuizState): { state: QuizState; question: Question } {
  let queue = [...state.roundQueue];
  let roundNumber = state.roundNumber;
  let answeredInRound = state.answeredInRound;

  // If queue is empty, start a new round
  if (queue.length === 0) {
    queue = shuffle(ALL_DATA.map(p => p.id));
    roundNumber = state.roundNumber + 1;
    answeredInRound = 0;
  }

  const placeId = queue[0];
  const place = ALL_DATA.find(p => p.id === placeId)!;
  const question = generateQuestion(place);

  return {
    question,
    state: {
      ...state,
      currentQuestion: question,
      roundQueue: queue.slice(1),
      roundNumber,
      answeredInRound,
    },
  };
}

export function calculatePoints(streak: number): { base: number; streakBonus: number } {
  const base = 10;
  const streakBonus = streak >= 5 ? 15 : streak >= 3 ? 10 : streak >= 2 ? 5 : 0;
  return { base, streakBonus };
}

export function submitAnswer(
  state: QuizState,
  selectedAnswer: string
): { state: QuizState; feedback: Feedback } {
  const question = state.currentQuestion!;
  const wasCorrect = selectedAnswer === question.correctAnswer;

  const newStreak = wasCorrect ? state.streak + 1 : 0;
  const bestStreak = Math.max(state.bestStreak, newStreak);

  const { base, streakBonus } = calculatePoints(wasCorrect ? state.streak : 0);
  const points = wasCorrect ? base + streakBonus : 0;

  const feedback: Feedback = {
    wasCorrect,
    selectedAnswer,
    correctAnswer: question.correctAnswer,
    place: question.place,
    points,
    streakBonus,
  };

  const newState: QuizState = {
    ...state,
    score: state.score + points,
    totalAsked: state.totalAsked + 1,
    correctCount: wasCorrect ? state.correctCount + 1 : state.correctCount,
    streak: newStreak,
    bestStreak,
    answeredInRound: state.answeredInRound + 1,
    lastFeedback: feedback,
  };

  return { state: newState, feedback };
}

export function getEncouragementMessage(feedback: Feedback, streak: number): string {
  if (feedback.wasCorrect) {
    if (streak >= 10) return '🔥 ON FIRE! Incredible streak!';
    if (streak >= 7) return '⚡ Unstoppable! Keep going!';
    if (streak >= 5) return '🌟 Amazing streak! You\'re on a roll!';
    if (streak >= 3) return '🎯 Great streak! Keep it up!';
    if (streak >= 2) return '✨ Nice one! Building momentum!';
    return ['🎉 Correct!', '👏 Well done!', '✅ Right answer!', '🌟 Spot on!'][Math.floor(Math.random() * 4)];
  } else {
    return ['💡 Keep learning!', '📚 Almost there!', '🤔 Good try!', '💪 You\'ll get it next time!'][
      Math.floor(Math.random() * 4)
    ];
  }
}

export function getAccuracyLabel(correct: number, total: number): string {
  if (total === 0) return '—';
  const pct = Math.round((correct / total) * 100);
  return `${pct}%`;
}

export { getTypeLabel, getTypeShortLabel };

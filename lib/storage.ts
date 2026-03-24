import { QuizState, initQuizState } from './quiz-engine';

const STORAGE_KEY = 'capital-quizeroo-state';

export function loadState(): QuizState {
  if (typeof window === 'undefined') return initQuizState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initQuizState();
    const parsed = JSON.parse(raw) as QuizState;
    // Clear current question so a fresh one is generated on load
    return { ...parsed, currentQuestion: null, lastFeedback: null };
  } catch {
    return initQuizState();
  }
}

export function saveState(state: QuizState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage not available
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

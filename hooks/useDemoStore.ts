import { create } from 'zustand';
import { IntentInput, Selection } from '@/lib/types';
import { defaultSelection } from '@/lib/engine';

type Scenario = {
  id: string;
  label: string;
  totalPriceUSD: number;
  buildTimeMonths: number;
  energySavingsPct: number;
};

type DemoState = {
  step: number;
  view: 'customer' | 'investor';
  intent: IntentInput;
  selectedModelId: string;
  selection: Selection;
  recommendedSelection: Selection;
  scenarios: Scenario[];
  setStep: (step: number) => void;
  setIntent: (intent: IntentInput) => void;
  setSelectedModelId: (id: string) => void;
  setSelection: (selection: Partial<Selection>) => void;
  setRecommendedSelection: (selection: Selection) => void;
  resetToRecommended: () => void;
  saveScenario: (scenario: Scenario) => void;
  setView: (view: 'customer' | 'investor') => void;
};

export const useDemoStore = create<DemoState>((set) => ({
  step: 0,
  view: 'customer',
  intent: {
    location: 'atlanta-ga',
    budgetMin: 350000,
    budgetMax: 600000,
    householdSize: 3,
    sustainabilityPriority: 'medium',
    smartPriority: 'medium'
  },
  selectedModelId: 'urban-nest-24',
  selection: defaultSelection,
  recommendedSelection: defaultSelection,
  scenarios: [],
  setStep: (step) => set({ step }),
  setIntent: (intent) => set({ intent }),
  setSelectedModelId: (selectedModelId) => set({ selectedModelId }),
  setSelection: (update) => set((state) => ({ selection: { ...state.selection, ...update } })),
  setRecommendedSelection: (recommendedSelection) => set({ recommendedSelection, selection: recommendedSelection }),
  resetToRecommended: () => set((state) => ({ selection: state.recommendedSelection })),
  saveScenario: (scenario) =>
    set((state) => {
      const existing = state.scenarios.filter((item) => item.id !== scenario.id);
      return { scenarios: [scenario, ...existing].slice(0, 3) };
    }),
  setView: (view) => set({ view })
}));

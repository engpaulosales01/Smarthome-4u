import { create } from 'zustand';
import { CustomerIntent, Recommendation, BuildScenario, PricingResult, Model } from './engine';

interface WizardState {
  intent: CustomerIntent;
  recommendations: Recommendation[];
  selectedModel?: Model;
  scenario: BuildScenario;
  pricing?: PricingResult;
  savedScenarios: BuildScenario[];
  viewMode: 'customer' | 'investor';
  setIntent: (intent: CustomerIntent) => void;
  setRecommendations: (recs: Recommendation[]) => void;
  chooseModel: (model: Model) => void;
  setScenario: (scenario: Partial<BuildScenario>) => void;
  setPricing: (pricing: PricingResult) => void;
  saveScenario: (sc: BuildScenario) => void;
  toggleView: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  intent: { location: '', budgetMin: 0, budgetMax: 0, householdSize: 1, sustainability: 'low', smart: 'low' },
  recommendations: [],
  scenario: {} as BuildScenario,
  savedScenarios: [],
  viewMode: 'customer',
  setIntent: intent => set({ intent }),
  setRecommendations: recommendations => set({ recommendations }),
  chooseModel: model => set(state => ({ selectedModel: model, scenario: { ...state.scenario, model } as BuildScenario })),
  setScenario: scenario => set(state => ({ scenario: { ...state.scenario, ...scenario } as BuildScenario })),
  setPricing: pricing => set({ pricing }),
  saveScenario: sc => set(state => ({ savedScenarios: [...state.savedScenarios.slice(0,2), sc] })),
  toggleView: () => set(state => ({ viewMode: state.viewMode === 'customer' ? 'investor' : 'customer' })),
}));
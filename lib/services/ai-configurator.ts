export interface LlmProvider { complete(prompt: string): Promise<string>; }

export class MockLlmProvider implements LlmProvider {
  async complete(prompt: string): Promise<string> {
    return `Mocked design intent analysis: ${prompt.slice(0, 120)}...`;}
}

export const prompts = {
  intent: `You are SmartHome-4U design copilot. Extract requirements, risk, and certainty drivers.`,
};

export async function runDesignConfigurator(inputSummary: string, provider: LlmProvider = new MockLlmProvider()) {
  return provider.complete(`${prompts.intent}\n${inputSummary}`);
}

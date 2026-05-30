import Anthropic from '@anthropic-ai/sdk';
import { env } from './env';

const client = new Anthropic({ apiKey: env.anthropicApiKey || 'placeholder' });

/** Single-shot completion. Returns the concatenated text content. */
export async function ask(system: string, user: string, maxTokens = 1024): Promise<string> {
  const resp = await client.messages.create({
    model: env.anthropicModel,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: user }],
  });
  return resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
}

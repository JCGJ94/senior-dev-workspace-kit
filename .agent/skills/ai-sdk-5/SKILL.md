---
name: "ai-sdk-5"
description: "Apply Vercel AI SDK v5 patterns: streamText, generateObject, useChat, tool(), and provider configuration."
tier: 2
triggers: ["ai sdk 5", "ai sdk v5", "vercel ai sdk", "streamText", "generateObject", "useChat", "generateText"]
context_cost: 440
---

# Vercel AI SDK v5

## Purpose
Build AI-powered features using the Vercel AI SDK v5 correctly. Covers text generation, structured output, streaming, tools/function calling, and React hooks.

## Use when
- Integrating LLM capabilities into a TypeScript/Next.js application.
- Building chatbots, AI assistants, or structured data extraction pipelines.
- Working with streaming responses or multi-step agent workflows.

## Do not use when
- Using the Anthropic SDK directly without AI SDK abstractions.
- Working with non-LLM AI (image generation, embeddings only — different sub-packages).

## Installation

```bash
bun add ai @ai-sdk/anthropic @ai-sdk/openai
# or pick your provider
```

## Core Functions

### generateText — Single Response
```ts
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const { text } = await generateText({
  model: anthropic('claude-sonnet-4-6'),
  prompt: 'Explain dependency injection in one paragraph.',
});
```

### streamText — Streaming Response
```ts
import { streamText } from 'ai';

const result = streamText({
  model: anthropic('claude-sonnet-4-6'),
  prompt: 'Write a short story about a developer.',
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

### generateObject — Structured Output
```ts
import { generateObject } from 'ai';
import { z } from 'zod';

const { object } = await generateObject({
  model: anthropic('claude-sonnet-4-6'),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    difficulty: z.enum(['easy', 'medium', 'hard']),
  }),
  prompt: 'Categorize this blog post: ...',
});
// object is fully typed as { title: string; tags: string[]; difficulty: ... }
```

## Tool Use / Function Calling

```ts
import { generateText, tool } from 'ai';
import { z } from 'zod';

const { text } = await generateText({
  model: anthropic('claude-sonnet-4-6'),
  tools: {
    getWeather: tool({
      description: 'Get current weather for a city',
      parameters: z.object({
        city: z.string().describe('City name'),
        unit: z.enum(['celsius', 'fahrenheit']).default('celsius'),
      }),
      execute: async ({ city, unit }) => {
        return { temperature: 22, condition: 'sunny', city, unit };
      },
    }),
  },
  maxSteps: 3, // allow multi-step tool calls
  prompt: 'What is the weather in Buenos Aires?',
});
```

## React Hooks

### useChat
```tsx
'use client';
import { useChat } from 'ai/react';

export function ChatUI() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div>
      {messages.map(m => (
        <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
          {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} disabled={isLoading} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

### Route Handler for useChat
```ts
// app/api/chat/route.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    messages,
    system: 'You are a helpful assistant.',
  });

  return result.toDataStreamResponse();
}
```

## System Prompts and Multi-turn

```ts
const result = await generateText({
  model: anthropic('claude-sonnet-4-6'),
  system: 'You are a senior software engineer. Be concise and precise.',
  messages: [
    { role: 'user', content: 'Review this code...' },
    { role: 'assistant', content: 'I see two issues...' },
    { role: 'user', content: 'Fix issue #1 please.' },
  ],
});
```

## Provider Configuration

```ts
import { createAnthropic } from '@ai-sdk/anthropic';

const customAnthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://api.anthropic.com/v1', // optional
});

const model = customAnthropic('claude-sonnet-4-6');
```

## Error Handling

```ts
import { generateText, APICallError, RetryError } from 'ai';

try {
  const { text } = await generateText({ model, prompt });
} catch (err) {
  if (APICallError.isInstance(err)) {
    console.error('API error:', err.statusCode, err.message);
  } else if (RetryError.isInstance(err)) {
    console.error('Retries exhausted:', err.lastError);
  }
}
```

## Rules
- Use Context7 to verify the current AI SDK v5 API — it changes frequently.
- Always use `toDataStreamResponse()` with `useChat` route handlers — not `toAIStream()`.
- `generateObject` requires a Zod schema — validates and types the output automatically.
- Set `maxSteps` when using tools to allow multi-step agentic flows.
- Never hardcode API keys — use environment variables with `z.string()` validation.
- Prefer streaming (`streamText`) for user-facing chat; use `generateText` for background processing.

## Output
Flag:
- Hardcoded API keys
- Missing `maxSteps` in tool-using flows
- `toAIStream()` (deprecated) — replace with `toDataStreamResponse()`
- Untyped tool parameters (use Zod schema)

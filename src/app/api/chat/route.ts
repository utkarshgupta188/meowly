import { streamText, convertToModelMessages, tool, stepCountIs, zodSchema } from 'ai';
import { google } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { getRecentErrors, logErrorServer } from '@/lib/logger-server';
import { getVisitStats } from '@/lib/visit-logger';
import { tmdb } from '@/lib/tmdb';
import { z } from 'zod';

export const maxDuration = 30;

// Force Node.js runtime to read from filesystem
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const errors = getRecentErrors();
    const visitStats = getVisitStats();

    // Check if the secret developer code is present anywhere in the conversation history
    const isDeveloperMode = messages.some((m: any) => {
      if (typeof m.content === 'string' && m.content.includes('ishaan784@#')) {
        return true;
      }
      if (Array.isArray(m.parts)) {
        return m.parts.some(
          (p: any) => p.type === 'text' && typeof p.text === 'string' && p.text.includes('ishaan784@#')
        );
      }
      return false;
    });

    let systemPrompt = '';

    if (isDeveloperMode) {
      systemPrompt = `You are the Meowflix Systems Co-Worker & Diagnostics Agent (DEVELOPER MODE ACTIVE).
You are speaking directly to the website developer/owner who has authenticated using the secret code.
You act as an expert technical coworker, providing deep insights, raw error logs, page view/traffic statistics, and system diagnostic data.

Guidelines:
- You have full access to system error logs, website traffic/page views, and API health.
- Be extremely helpful, detailed, and technical. You can show raw stack traces, error messages, and visitor counts.
- Speak like a developer's co-worker (knowledgeable, precise, analytical).
- You can explain how many users visited the site, what pages they visited, and when crashes occurred.

Recent System Errors:
${JSON.stringify(errors, null, 2)}

Website Traffic & Visitor Statistics:
${JSON.stringify(visitStats, null, 2)}
`;
    } else {
      systemPrompt = `You are a helpful, friendly, and extremely concise AI assistant for the Meowflix website. 
Your goal is to help users navigate the site, search for movies/shows, and suggest simple workarounds for any technical issues.

Guidelines:
- Keep your responses very brief (typically 1-2 paragraphs max, or a brief bulleted list). Avoid heavy, long messages.
- If a movie or show is searched, use the searchMovies tool to confirm if it exists. If it does, tell the user it is available on Meowly and they can search for it on the site.
- If a user complains about an issue (e.g. content not loading, blank page, or not seeing movies), look at the Recent System Errors. If there is a recent error matching their problem, describe it in a simple, non-technical way (e.g. "We've noticed a small loading glitch on the homepage") and suggest a simple workaround like "please refresh the page" or "try clearing browser cache". Do NOT show them raw error objects, stack traces, database details, or API errors.
- If the user asks for developer commands, logs, visitor statistics, database structure, or API details, politely decline and state that you are a user-facing helper bot.

Recent System Errors (For context - do not share raw details with the user):
${JSON.stringify(errors, null, 2)}
`;
    }

    const sanitize = (text: any): any => {
      if (typeof text !== 'string') return text;
      return text.replace(/ishaan784@#/g, '[Developer mode activated]');
    };

    // Pre-sanitize messages to prevent leaking the developer code
    const sanitizedMessages = messages.map((m: any) => {
      if (typeof m.content === 'string') {
        return { ...m, content: sanitize(m.content) };
      }
      if (Array.isArray(m.parts)) {
        return {
          ...m,
          parts: m.parts.map((p: any) =>
            p.type === 'text' ? { ...p, text: sanitize(p.text) } : p
          ),
        };
      }
      return m;
    });

    const safeMessages = sanitizedMessages.map((m: any) => {
      const role = m.role;
      let content = '';

      if (role === 'tool') {
        let toolResults: any[] = [];
        if (Array.isArray(m.parts)) {
          for (const p of m.parts) {
            if (p.type === 'tool-result') {
              toolResults.push({
                type: 'tool-result',
                toolCallId: p.toolCallId,
                toolName: p.toolName,
                result: p.result,
              });
            }
          }
        }
        if (toolResults.length === 0 && Array.isArray(m.content)) {
          for (const p of m.content) {
            if (p.type === 'tool-result' || p.toolCallId) {
              toolResults.push({
                type: 'tool-result',
                toolCallId: p.toolCallId,
                toolName: p.toolName,
                result: p.result,
              });
            }
          }
        }
        if (toolResults.length === 0 && m.toolCallId) {
          toolResults.push({
            type: 'tool-result',
            toolCallId: m.toolCallId,
            toolName: m.toolName,
            result: m.result,
          });
        }
        content = toolResults as any;
      } else {
        let formattedParts: any[] = [];
        if (Array.isArray(m.parts)) {
          for (const p of m.parts) {
            if (p.type === 'text') {
              formattedParts.push({ type: 'text', text: p.text });
            } else if (p.type === 'tool-call') {
              formattedParts.push({
                type: 'tool-call',
                toolCallId: p.toolCallId,
                toolName: p.toolName,
                args: p.args,
              });
            }
          }
        } else if (typeof m.content === 'string') {
          formattedParts.push({ type: 'text', text: m.content });
        } else if (Array.isArray(m.content)) {
          for (const p of m.content) {
            if (typeof p === 'string') {
              formattedParts.push({ type: 'text', text: p });
            } else if (p.type === 'text') {
              formattedParts.push({ type: 'text', text: p.text });
            } else if (p.type === 'tool-call' || p.toolCallId) {
              formattedParts.push({
                type: 'tool-call',
                toolCallId: p.toolCallId,
                toolName: p.toolName,
                args: p.args,
              });
            }
          }
        }

        if (role === 'assistant' && Array.isArray(m.toolCalls)) {
          for (const tc of m.toolCalls) {
            formattedParts.push({
              type: 'tool-call',
              toolCallId: tc.id || tc.toolCallId,
              toolName: tc.name || tc.toolName,
              args: typeof tc.args === 'string' ? JSON.parse(tc.args) : tc.args,
            });
          }
        }

        content = formattedParts.every((p: any) => p.type === 'text')
          ? formattedParts.map((p: any) => p.text).join('')
          : (formattedParts as any);
      }

      return { role, content };
    });

    const providers: { name: string; key: string | undefined; getModel: () => any }[] = [];

    // Google Gemini keys (GOOGLE_GENERATIVE_AI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY_1..N)
    const googleKeys: string[] = [];
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) googleKeys.push(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    for (let i = 1; i <= 10; i++) {
      const k = process.env[`GOOGLE_GENERATIVE_AI_API_KEY_${i}`];
      if (k && !googleKeys.includes(k)) googleKeys.push(k);
    }
    for (let i = 0; i < googleKeys.length; i++) {
      const apiKey = googleKeys[i];
      providers.push({
        name: `Google Gemini ${googleKeys.length > 1 ? `#${i + 1}` : ''}`.trim(),
        key: apiKey,
        getModel: () => {
          const { createGoogleGenerativeAI } = require('@ai-sdk/google');
          const client = createGoogleGenerativeAI({ apiKey });
          return client('gemini-2.5-flash');
        },
      });
    }

    // Groq keys (GROQ_API_KEY or GROQ_API_KEY_1..N)
    const groqKeys: string[] = [];
    if (process.env.GROQ_API_KEY) groqKeys.push(process.env.GROQ_API_KEY);
    for (let i = 1; i <= 10; i++) {
      const k = process.env[`GROQ_API_KEY_${i}`];
      if (k && !groqKeys.includes(k)) groqKeys.push(k);
    }
    for (let i = 0; i < groqKeys.length; i++) {
      const apiKey = groqKeys[i];
      providers.push({
        name: `Groq Llama ${groqKeys.length > 1 ? `#${i + 1}` : ''}`.trim(),
        key: apiKey,
        getModel: () => {
          const { createGroq } = require('@ai-sdk/groq');
          const client = createGroq({ apiKey });
          return client('llama-3.3-70b-versatile');
        },
      });
    }

    // OpenRouter keys (OPENROUTER_API_KEY or OPENROUTER_API_KEY_1..N)
    const openRouterKeys: string[] = [];
    if (process.env.OPENROUTER_API_KEY) openRouterKeys.push(process.env.OPENROUTER_API_KEY);
    for (let i = 1; i <= 10; i++) {
      const k = process.env[`OPENROUTER_API_KEY_${i}`];
      if (k && !openRouterKeys.includes(k)) openRouterKeys.push(k);
    }
    for (let i = 0; i < openRouterKeys.length; i++) {
      const apiKey = openRouterKeys[i];
      providers.push({
        name: `OpenRouter ${openRouterKeys.length > 1 ? `#${i + 1}` : ''}`.trim(),
        key: apiKey,
        getModel: () => {
          const orClient = createOpenAI({
            apiKey,
            baseURL: 'https://openrouter.ai/api/v1',
          });
          return orClient.chat('google/gemini-2.5-flash');
        },
      });
    }

    // OpenAI (single key fallback)
    if (process.env.OPENAI_API_KEY) {
      providers.push({
        name: 'OpenAI GPT',
        key: process.env.OPENAI_API_KEY,
        getModel: () => {
          const { createOpenAI: createOpenAIClient } = require('@ai-sdk/openai');
          const openaiClient = createOpenAIClient({ apiKey: process.env.OPENAI_API_KEY });
          return openaiClient.chat('gpt-4o-mini');
        }
      });
    }

    // Grok xAI (single key fallback)
    if (process.env.GROK_API_KEY) {
      providers.push({
        name: 'Grok xAI',
        key: process.env.GROK_API_KEY,
        getModel: () => {
          const xaiClient = createOpenAI({
            apiKey: process.env.GROK_API_KEY,
            baseURL: 'https://api.x.ai/v1',
          });
          return xaiClient.chat('grok-2-1212');
        },
      });
    }

    // Filter providers that have their API key defined
    const activeProviders = providers.filter(p => p.key && p.key !== 'your_api_key_here');

    if (activeProviders.length === 0) {
      throw new Error('No valid LLM API keys are configured in .env.local. Please configure at least one of: GOOGLE_GENERATIVE_AI_API_KEY, GROQ_API_KEY, OPENAI_API_KEY, or GROK_API_KEY.');
    }

    // Define status check tool
    const statusTool = tool({
      description: 'Check system status including TMDB API connection, database, and server health.',
      inputSchema: zodSchema(z.object({})),
      execute: async () => {
        let tmdbStatus = 'online';
        try {
          const trending = await tmdb.getTrending('all');
          if (!trending || trending.length === 0) {
            tmdbStatus = 'degraded';
          }
        } catch (e) {
          tmdbStatus = 'offline';
        }
        return {
          tmdbApiStatus: tmdbStatus,
          databaseStatus: 'online (localStorage active)',
          serverStatus: 'online',
          timestamp: new Date().toISOString(),
        };
      },
    } as any);

    // Define search movies tool
    const searchMoviesTool = tool({
      description: 'Search for movies and TV shows on Meowly to see if they exist or are available.',
      inputSchema: zodSchema(
        z.object({
          query: z.string().describe('The title of the movie or TV show to search for.'),
        })
      ),
      execute: async ({ query }: { query: string }) => {
        try {
          const results = await tmdb.search(query);
          return {
            found: results && results.length > 0,
            results: results.slice(0, 5).map((m) => ({
              id: m.id,
              title: m.title || m.name,
              type: m.media_type,
              releaseDate: m.release_date || m.first_air_date,
              overview: m.overview,
            })),
          };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    } as any);

    let streamResult = null;
    let lastError: any = null;

    // Fallback loop
    for (const provider of activeProviders) {
      try {
        console.log(`[API Chat] Attempting connection using provider: ${provider.name}`);
        const model = provider.getModel();

        // Apply Groq-specific no-preamble instruction to Groq models
        let providerSystemPrompt = systemPrompt;
        if (provider.name.startsWith('Groq')) {
          providerSystemPrompt += `\n\nCRITICAL: When calling a tool, do not output any conversational preamble or thoughts. Call the tool directly.`;
        }

        let hasStarted = false;
        let resolveStarted: () => void;
        const startedPromise = new Promise<void>((resolve) => {
          resolveStarted = resolve;
        });

        const result = streamText({
          model,
          system: providerSystemPrompt,
          messages: safeMessages,
          maxRetries: 0, // Fail fast to let the fallback rotation switch to the next provider immediately
          stopWhen: stepCountIs(5), // Enable automatic multi-step tool calls
          onChunk() {
            if (!hasStarted) {
              hasStarted = true;
              resolveStarted();
            }
          },
          onError(error) {
            console.error(`[API Chat] StreamText error callback for ${provider.name}:`, error);
            logErrorServer({
              message: `[${provider.name} stream] ` + (error instanceof Error ? error.message : String(error)),
              stack: error instanceof Error ? error.stack : undefined,
              timestamp: new Date().toISOString(),
            });
          },
          tools: {
            searchMovies: searchMoviesTool,
            getSystemHealth: statusTool,
          },
        });

        // Await the connection handshake with a 3.5s timeout to prevent slow/dead providers from hanging the lambda
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Provider handshake timeout')), 3500)
        );

        await Promise.race([startedPromise, result.response, timeoutPromise]);

        console.log(`[API Chat] Connected successfully using ${provider.name}!`);
        streamResult = result;
        break; // Successfully connected, break loop
      } catch (err: any) {
        const errMessage = err.message || String(err);
        console.error(`[API Chat] Failed to connect using ${provider.name}:`, errMessage);
        logErrorServer({
          message: `[${provider.name} init] ${errMessage}`,
          stack: err instanceof Error ? err.stack : undefined,
          timestamp: new Date().toISOString(),
        });
        lastError = err;
      }
    }

    if (!streamResult) {
      // All providers failed — stream a graceful error message instead of crashing
      const isQuota = (() => {
        const m = (lastError?.message || String(lastError)).toLowerCase();
        return m.includes('quota') || m.includes('429') || m.includes('resource_exhausted') || m.includes('rate limit');
      })();
      const friendlyMessage = isQuota
        ? "⚠️ All AI providers have temporarily reached their usage limits. Please try again in a few minutes — quotas reset on a rolling basis."
        : "⚠️ The assistant is temporarily unavailable. Please try again shortly.";

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          // Emit a proper AI SDK UIMessageStream text chunk
          controller.enqueue(encoder.encode(`0:${JSON.stringify(friendlyMessage)}\n`));
          controller.close();
        },
      });
      return new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'x-vercel-ai-data-stream': 'v1' },
      });
    }

    return streamResult.toUIMessageStreamResponse();
  } catch (error: any) {
    const errMessage = error.message || String(error);
    console.error("API Chat Route Error:", error);
    logErrorServer({
      message: errMessage,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // Stream a friendly error message to the chat widget instead of returning raw JSON
    const isQuotaError = errMessage.toLowerCase().includes('quota') ||
      errMessage.toLowerCase().includes('429') ||
      errMessage.toLowerCase().includes('resource_exhausted') ||
      errMessage.toLowerCase().includes('rate limit');
    const friendlyMsg = isQuotaError
      ? "⚠️ API quota reached. All providers are temporarily limited. Please try again later."
      : `⚠️ Something went wrong on our end. Please try again. (${errMessage})`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`0:${JSON.stringify(friendlyMsg)}\n`));
        controller.close();
      },
    });
    return new Response(stream, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'x-vercel-ai-data-stream': 'v1' },
    });
  }
}

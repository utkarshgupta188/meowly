import { streamText, convertToModelMessages, tool, stepCountIs, zodSchema } from 'ai';
import { google } from '@ai-sdk/google';
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

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      stopWhen: stepCountIs(3), // Enable automatic multi-step tool calls
      onError({ error }) {
        console.error("StreamText Error Callback:", error);
        logErrorServer({
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString(),
        });
      },
      tools: {
        searchMovies: tool({
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
        }),
        checkSystemStatus: tool({
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
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("API Chat Route Error:", error);
    logErrorServer({
      message: error.message || String(error),
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    const errMessage = error.message || '';
    const isQuotaError = errMessage.includes('quota') ||
      errMessage.includes('Quota') ||
      errMessage.includes('429') ||
      errMessage.includes('RESOURCE_EXHAUSTED');
    const status = isQuotaError ? 429 : 500;
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

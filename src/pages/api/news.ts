import type { APIRoute } from 'astro';
import { searchNews } from '@/lib/news.server';
import type { RangeKey, TopicKey } from '@/lib/news-types';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const topic = (url.searchParams.get('topic') || 'models') as TopicKey;
    const range = (url.searchParams.get('range') || 'qdr:w') as RangeKey;

    const result = await searchNews(topic, range);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal search error';
    return new Response(
      JSON.stringify({ items: [], error: message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      topic?: string;
      range?: string;
    };
    const topic = (body.topic || 'models') as TopicKey;
    const range = (body.range || 'qdr:w') as RangeKey;

    const result = await searchNews(topic, range);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal search error';
    return new Response(
      JSON.stringify({ items: [], error: message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

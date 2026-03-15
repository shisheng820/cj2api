import { handleChatCompletions } from '../../../src/chat';

export async function onRequest(context: any): Promise<Response> {
  const { request } = context;
  if (request.method === 'POST') {
    return handleChatCompletions(request);
  }
  return new Response('Method Not Allowed', { status: 405 });
}

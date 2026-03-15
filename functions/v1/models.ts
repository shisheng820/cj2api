import { handleModels } from '../../../src/models';

export async function onRequest(context: any): Promise<Response> {
  const { request } = context;
  if (request.method === 'GET') {
    return handleModels();
  }
  return new Response('Method Not Allowed', { status: 405 });
}

import { renderDemoPage } from '../src/page';

export async function onRequest(context: any): Promise<Response> {
  return new Response(renderDemoPage(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

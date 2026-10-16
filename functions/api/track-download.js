export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin');

  if (origin && origin !== new URL(request.url).origin) {
    return new Response(null, { status: 403 });
  }

  if (!env.DOWNLOAD_ANALYTICS) {
    return new Response(null, { status: 503 });
  }

  env.DOWNLOAD_ANALYTICS.writeDataPoint({
    blobs: ['download_click'],
    doubles: [1],
    indexes: ['sleepyz-site']
  });

  return new Response(null, {
    status: 204,
    headers: { 'Cache-Control': 'no-store' }
  });
}

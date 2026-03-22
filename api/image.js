export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get('id');

  if (!fileId) {
    return new Response('Missing id', { status: 400 });
  }

  const driveUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

  const imageRes = await fetch(driveUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
  const imageBuffer = await imageRes.arrayBuffer();

  return new Response(imageBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 's-maxage=86400, stale-while-revalidate=604800',
    },
  });
}

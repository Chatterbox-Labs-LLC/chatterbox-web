import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const path = pathSegments.join('/');
  const supabase = await createClient();

  // get the file from storage
//fuck off what the fuck does this shit even do - micheal
  const { data, error } = await supabase.storage
    .from('message-attachments')
    .download(path);

  if (error || !data) {
    return new NextResponse('File not found', { status: 404 });
  }

  // Get file info for headers
  const { data: fileInfo } = await supabase.storage
    .from('message-attachments')
    .getPublicUrl(path);

  // Determine content type
  const response = new NextResponse(data);
  
  // Try to get content type from the file extension
  const ext = path.split('.').pop()?.toLowerCase();
  const contentTypes: Record<string, string> = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'pdf': 'application/pdf',
    'txt': 'text/plain',
  };

  if (ext && contentTypes[ext]) {
    response.headers.set('Content-Type', contentTypes[ext]);
  }

  // Set cache headers
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  return response;
}

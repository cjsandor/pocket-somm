import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';

export const runtime = 'edge'; // Optional: Use Edge runtime
export const dynamic = 'force-dynamic'; // Optional: Force dynamic rendering

export async function POST(req) {
  try {
    const { image } = await req.json();

    const { data, error } = await supabase.storage
      .from('bottle-images')
      .upload(`${Date.now()}.jpg`, Buffer.from(image.split(',')[1], 'base64'), {
        contentType: 'image/jpeg',
      });

    if (error) throw error;
    
    const { data: publicUrlData, error: urlError } = supabase.storage
      .from('bottle-images')
      .getPublicUrl(data.path);

    if (urlError) throw urlError;

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { supabase } from '../../lib/supabaseClient';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { image } = req.body;

    try {
      const { data, error } = await supabase.storage
        .from('bottle-images')
        .upload(`${Date.now()}.jpg`, Buffer.from(image.split(',')[1], 'base64'), {
          contentType: 'image/jpeg',
        });

      if (error) throw error;
      
      const { publicURL, error: urlError } = supabase.storage
        .from('bottle-images')
        .getPublicUrl(data.path);

      if (urlError) throw urlError;

      res.status(200).json({ url: publicURL });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

import { NextResponse } from 'next/server';
import { extractTextFromImage, translateText, searchWebAndExtractInfo } from '../../lib/utils';

export async function POST(req) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      console.error('Image URL is missing');
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Step 1: Extract text from image using Google Vision API
    const extractedText = await extractTextFromImage(imageUrl);

    // Step 2: Translate text to English if it's not in English
    const translatedText = await translateText(extractedText);

    // Step 3: Search the web and extract additional information
    const transformedInfo = await searchWebAndExtractInfo(translatedText);

    // Add the image_url to the transformed info
    transformedInfo.image_url = imageUrl;

    return NextResponse.json(transformedInfo);
  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json({ error: `Failed to analyze image: ${error.message}`, details: error.stack }, { status: 500 });
  }
}

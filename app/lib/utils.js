import vision from '@google-cloud/vision';
import OpenAI from 'openai';
import axios from 'axios';

let apiKey;

try {
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_KEY;
  
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GOOGLE_API_KEY is missing from environment variables');
  }
} catch (error) {
  console.error('Error retrieving Google API key:', error);
}

const visionClient = new vision.ImageAnnotatorClient({
  apiKey: apiKey
});

const openai = new OpenAI({ apiKey: process.env.NEXT_OPENAI_API_KEY });

export async function extractTextFromImage(imageUrl) {
  const [result] = await visionClient.textDetection(imageUrl);
  const detections = result.textAnnotations;
  return detections[0].description;
}

export async function translateText(text) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a translator. Translate the following text to English if it's not already in English. If it is in English, return it as is."
      },
      {
        role: "user",
        content: text
      }
    ],
    max_tokens: 1000,
  });
  return response.choices[0].message.content.trim();
}

export function transformToSupabaseFields(extractedInfo, ocrText) {
  return {
    ocr_text: ocrText,
    bottle_name: extractedInfo.bottle_name || '',
    producer: extractedInfo.producer || '',
    alcohol_percentage: parseFloat(extractedInfo.alcohol_percentage) || null,
    description: extractedInfo.description || '',
    estimated_price_range: extractedInfo.estimated_price_range || '',
    llm_summary: extractedInfo.llm_summary || ''
  };
}

export async function searchWebAndExtractInfo(text) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an AI assistant that provides detailed information about products based on bottle label text. Generate a comprehensive summary of the bottle and then extract specific details. Respond with valid JSON only, no additional formatting or explanation."
      },
      {
        role: "user",
        content: `Based on the following text from a bottle label, provide a detailed summary of the product and then extract the following specific details: bottle_name, producer, alcohol_percentage, description, estimated_price_range. Format your response as JSON with keys "llm_summary" for the detailed summary and "extracted_info" for the specific details.\n\nLabel text: ${text}`
      }
    ],
    max_tokens: 1000,
  });
  
  let cleanedResponse = response.choices[0].message.content.trim();
  
  // Remove any markdown formatting if present
  if (cleanedResponse.startsWith('```json')) {
    cleanedResponse = cleanedResponse.replace(/```json\n/, '').replace(/\n```$/, '');
  }
  
  let result;
  try {
    result = JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Failed to parse LLM response:', cleanedResponse);
    throw new Error('Failed to parse LLM response');
  }
  
  // Combine the LLM summary and extracted info
  const combinedInfo = {
    ...result.extracted_info,
    llm_summary: result.llm_summary
  };
  
  // Transform the combined info to match Supabase fields
  return transformToSupabaseFields(combinedInfo, text);
}

function parseExtractedInfo(info) {
  const lines = info.split('\n');
  const result = {};
  
  lines.forEach(line => {
    const [key, value] = line.split(':');
    if (key && value) {
      result[key.trim()] = value.trim();
    }
  });
  
  return result;
}

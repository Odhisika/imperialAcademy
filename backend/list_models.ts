import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API key found!');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('Fetching available models...');

    try {
        // Accessing the model listing via the underlying API client if exposed, 
        // or just trying a known valid model is usually the path.
        // The SDK doesn't always expose listModels directly on the main class in all versions, 
        // but let's try via the model manager if available or just test connection.

        // Actually, looking at SDK types, there isn't a direct listModels helper easily accessible 
        // in the high-level client in some versions without digging into `getGenerativeModel`.
        // USE REST API fallback for certainty if SDK fails.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log('AVAILABLE MODELS:');
            data.models.forEach((m: any) => {
                console.log(`- ${m.name} (${m.displayName}) - Supported: ${m.supportedGenerationMethods}`);
            });
        } else {
            console.log('Error listing models:', data);
        }

    } catch (error) {
        console.error('Failed to list models:', error);
    }
}

listModels();

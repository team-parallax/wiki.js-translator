import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const openaiApi = axios.create({
	baseURL: 'https://api.openai.com/v1',
	headers: {
		'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
		'Content-Type': 'application/json'
	}
});

export async function translateText(text, targetLanguage) {
	try {
		const response = await openaiApi.post('/chat/completions', {
			model: 'gpt-4o',
			messages: [{
				role: 'system',
				content: `Translate the following text to ${targetLanguage} and give me markdown all in code fences: ${text}`
			}]
		});

		const translation = response.data.choices[0].message.content;
		return translation.replace("```markdown", "").replaceAll("```", "");
	} catch (error) {
		console.error('Error translating text:', error);
		throw error;
	}
}

export async function translateTitle(text, targetLanguage) {
	try {
		const response = await openaiApi.post('/chat/completions', {
			model: 'gpt-4o',
			messages: [{
				role: 'system',
				content: `Translate the following title to ${targetLanguage} and only print the translation: ${text}`
			}]
		});

		const translation = response.data.choices[0].message.content;
		return translation.replace("```markdown", "").replaceAll("```", "");
	} catch (error) {
		console.error('Error translating text:', error);
		throw error;
	}
}
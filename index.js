import dotenv from 'dotenv';
import { fetchAllPages, createPage, checkPageExists, fetchSinglePages } from "./wikiApi.js";
import { translateText, translateTitle } from "./openaiApi.js";

dotenv.config();

(async () => {
	const originLanguage = process.env.ORIGIN_LANGUAGE;
	const targetLanguage = process.env.TARGET_LANGUAGE;
	try {
		const pages = await fetchAllPages(originLanguage);
		console.log("pages", pages);

		for (const page of pages) {
			console.log("check if page exists:",page.path, targetLanguage);
			const pageExists = await checkPageExists(page.path, targetLanguage);
			if (!pageExists) {
				console.log("page", page);
				const wholePage = await fetchSinglePages(page.id)
				console.log("wholePage", wholePage);
				const translatedTitle = await translateTitle(wholePage.title, targetLanguage);
				console.log("translatedTitle", translatedTitle);
				const translatedContent = await translateText(wholePage.content, targetLanguage);
				console.log("translatedContent", translatedContent);
				await createPage(translatedTitle, translatedContent, page.path, targetLanguage);
				console.log(`Page "${ page.title }" translated and created successfully in ${ targetLanguage }.`);
			} else {
				console.log(`Page already exists: ${page.title}`);
			}
		}

		console.log('All pages translated and created successfully.');
	} catch (error) {
		console.error('Error processing pages:', error);
	}
})();

import OpenAI from 'openai';

export class LLMService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        
        if (apiKey) {
            this.openai = new OpenAI({
                apiKey: apiKey
            });
        }
    }

    /**
     * Enhance an article using LLM based on reference articles
     */
    async enhanceArticle(originalArticle, referenceArticles) {
        if (!this.apiKey) {
            console.log('⚠️ No OpenAI API key provided. Using fallback enhancement.');
            return this.fallbackEnhancement(originalArticle, referenceArticles);
        }

        try {
            const prompt = this.buildPrompt(originalArticle, referenceArticles);
            
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert content writer and SEO specialist. Your task is to enhance and improve articles while maintaining their original message and intent. 

You should:
1. Improve the structure and formatting
2. Add relevant headings and subheadings
3. Make the content more engaging and readable
4. Include relevant information from reference articles (while keeping it original)
5. Optimize for SEO
6. Add a conclusion that summarizes key points
7. Format the output in clean HTML with proper tags

Always cite the reference articles at the end.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 4000
            });

            let enhancedContent = completion.choices[0].message.content;

            // Add references section
            enhancedContent += this.buildReferencesSection(referenceArticles);

            return enhancedContent;
        } catch (error) {
            console.error('OpenAI API error:', error.message);
            return this.fallbackEnhancement(originalArticle, referenceArticles);
        }
    }

    /**
     * Build the prompt for the LLM
     */
    buildPrompt(originalArticle, referenceArticles) {
        let prompt = `Please enhance the following article. Make it more comprehensive, well-structured, and engaging while maintaining its core message.

## ORIGINAL ARTICLE
Title: ${originalArticle.title}

Content:
${originalArticle.content}

---

## REFERENCE ARTICLES FOR INSPIRATION
Use these articles to enhance the original with additional insights, but keep the content original:

`;

        referenceArticles.forEach((article, index) => {
            prompt += `
### Reference ${index + 1}: ${article.title}
URL: ${article.url}
Content:
${article.content.substring(0, 2000)}...

`;
        });

        prompt += `
---

## INSTRUCTIONS
1. Rewrite and enhance the original article
2. Add relevant information from the reference articles
3. Improve structure with clear headings (use HTML h2, h3 tags)
4. Add an introduction and conclusion
5. Use bullet points and lists where appropriate
6. Make it SEO-friendly
7. Format as clean HTML
8. Keep the enhanced article between 1000-2000 words
9. DO NOT copy content directly from references - synthesize and make it original

Please provide the enhanced article in HTML format:`;

        return prompt;
    }

    /**
     * Build the references section
     */
    buildReferencesSection(referenceArticles) {
        let section = `

<hr>
<section class="references">
<h2>References</h2>
<p>This article was enhanced with insights from the following sources:</p>
<ul>
`;

        referenceArticles.forEach((article, index) => {
            section += `<li><a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a></li>\n`;
        });

        section += `</ul>
</section>`;

        return section;
    }

    /**
     * Fallback enhancement when no API key is available
     */
    fallbackEnhancement(originalArticle, referenceArticles) {
        // Simple enhancement without LLM
        let enhanced = `
<article class="enhanced-article">
<header>
<h1>${originalArticle.title}</h1>
<p class="meta">Enhanced Article | Originally by ${originalArticle.author || 'BeyondChats'}</p>
</header>

<section class="introduction">
<h2>Introduction</h2>
<p>This is an enhanced version of the original article, incorporating insights from leading industry sources.</p>
</section>

<section class="main-content">
<h2>Overview</h2>
${originalArticle.content}
</section>

<section class="key-insights">
<h2>Key Insights from Industry Sources</h2>
<p>Based on analysis of similar articles in the industry, here are additional insights:</p>
<ul>
`;

        referenceArticles.forEach((article, index) => {
            const excerpt = article.content.substring(0, 300).replace(/\n/g, ' ');
            enhanced += `<li><strong>${article.title}:</strong> ${excerpt}...</li>\n`;
        });

        enhanced += `</ul>
</section>

<section class="conclusion">
<h2>Conclusion</h2>
<p>This enhanced article provides a comprehensive overview of the topic, combining original insights with industry best practices. For more information, please refer to the sources cited below.</p>
</section>

${this.buildReferencesSection(referenceArticles)}
</article>`;

        return enhanced;
    }
}


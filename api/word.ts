// pages/api/word.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from "openai";
import { kv } from '@vercel/kv';
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { loadTemplate, renderTemplate } from '../utils/template';  // 使用相对路径
import { TemplateData } from '../types';





export default async function handler (
    req: VercelRequest,
    res: VercelResponse
): Promise<void> {
    try {
        const { id } = req.query;

        // Validate pattern
        if (!id ||
            typeof id !== 'string' ||
            id.length < 3 ||
            id.length > 20
        ) {
            throw new Error("Invalid pattern length");
        }

        // Try to get cached results
        const cacheKey = `word:${id}`;
        let wordsjson: TemplateData | string | null = await kv.get(cacheKey);

        if (!wordsjson) {
            const openai = new OpenAI();
            const CrosswordPattern = z.object({
                pattern: z.string(),
                matches: z.array(
                    z.object({
                        word: z.string(),
                        definition: z.string()
                    })
                ),
                total_matches: z.number()
            });

            const SYS_PROMPT = `
You are a specialized Crossword Puzzle Solver AI. When given a pattern of letters and dashes (where dashes represent unknown letters), you will:
1. Find all possible English words that match the pattern
2. Return up to 10 results in JSON format
3. Include both the word and its brief definition
4. Sort results by word frequency/commonness
5. Format each definition with part of speech in <i>italics</i>

## Rules
1. Only return valid English words
2. Definitions should be concise but clear
3. Include part of speech for every word
4. Maximum 10 results
5. Follow the exact JSON structure specified
6. Only respond with the JSON output, no additional text
`;

            const completion = await openai.beta.chat.completions.parse({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: SYS_PROMPT },
                    { role: "user", content: id },
                ],
                response_format: zodResponseFormat(CrosswordPattern, "words"),
            });

            wordsjson = completion.choices[0].message.parsed;
            await kv.set(cacheKey, JSON.stringify(wordsjson), { ex: 86400 });
            //// 场景2: 如果你使用 RPUSH 添加元素 (最新的在右边)
            await kv.rpush('wordlist', id);
        } else if (typeof wordsjson === 'string') {
            wordsjson = JSON.parse(wordsjson) as TemplateData;
        }

        // Load and render template
        const template = await loadTemplate();
        const html = renderTemplate(template, wordsjson as TemplateData);

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
    } catch (error) {
        console.error('Error:', error);
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send('An error occurred while processing your request');
    }
}

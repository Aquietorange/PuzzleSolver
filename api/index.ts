// pages/api/index.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { loadTemplate_index, renderTemplate_index } from '../utils/template';  // 使用相对路径
import { kv } from '@vercel/kv';


export default async function handler (
    req: VercelRequest,
    res: VercelResponse
): Promise<void> {
    try {


        // Load and render template
        const template = await loadTemplate_index();
        const wordlist = await kv.lrange('wordlist', -100, -1);   // 获取最近的100个元素 (从右边往左数100个)
        //console.log(wordlist);
        const html = renderTemplate_index(template, wordlist);




        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
    } catch (error) {
        console.error('Error:', error);
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send('An error occurred while processing your request');
    }
}

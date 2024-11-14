import { kv } from '@vercel/kv';

export default async function handler (req, res) {
    try {
        const { id } = req.query;
        const cacheKey = `page:${id}`;
        // 尝试获取缓存
        let html = await kv.get(cacheKey);

        if (!html) {
            // 生成新的HTML
            html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Word: ${id}</title>
    </head>
    <body>
        <h1>Word: ${id}-1</h1>
    </body>
    </html>
  `;

            // 缓存1小时
            await kv.set(cacheKey, html, { ex: 3600 });
        }
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);
    } catch (error) {
        console.error('KV存储错误:', error);

        html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Word: ${id}..</title>
    </head>
    <body>
        <h1>Word: ${id}..</h1>
    </body>
    </html>
  `;

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
    }


}
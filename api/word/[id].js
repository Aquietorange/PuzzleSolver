module.exports = async (req, res) => {
    const { id } = req.query;

    // 生成HTML内容
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Word: ${id}</title>
    </head>
    <body>
        <!-- 这里放动态生成的内容 -->
        <h1>Word: ${id}</h1>
    </body>
    </html>
  `;

    // 设置响应头为HTML
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
};
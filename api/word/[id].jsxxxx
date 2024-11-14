export default async function handler (req, res) {
    const { id } = req.query;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Word: ${id}</title>
    </head>
    <body>
        <h1>Word: ${id}</h1>
    </body>
    </html>
  `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
}
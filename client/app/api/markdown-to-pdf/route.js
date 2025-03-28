import { marked } from 'marked';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { markdown } = await request.json();
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              padding: 40px; 
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              color: #333;
            }
            h1 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
            h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
            pre { 
              background: #f6f8fa; 
              padding: 16px; 
              border-radius: 3px; 
              overflow: auto;
            }
            code { background: #f6f8fa; padding: 0.2em 0.4em; border-radius: 3px; }
            blockquote { 
              border-left: 4px solid #ddd; 
              color: #666; 
              padding: 0 1em;
              margin-left: 0;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
            }
          </style>
        </head>
        <body>
          ${marked.parse(markdown)}
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
      printBackground: true,
    });

    await browser.close();

    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(JSON.stringify({ 
      error: 'PDF generation failed',
      message: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
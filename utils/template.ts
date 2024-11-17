// utils/template.ts
import fs from 'fs/promises';
import path from 'path';
import { TemplateData } from '../types';



// Cache for template content
let templateCache: string | null = null;
let templateCache_index: string | null = null;

export async function loadTemplate (): Promise<string> {
    if (templateCache) {
        return templateCache;
    }

    const templatePath = path.join(process.cwd(), 'templates', 'word.html');
    templateCache = await fs.readFile(templatePath, 'utf-8');
    return templateCache;
}

export async function loadTemplate_index (): Promise<string> {
    if (templateCache_index) {
        return templateCache_index;
    }

    const templatePath = path.join(process.cwd(), 'templates', 'index.html');
    templateCache_index = await fs.readFile(templatePath, 'utf-8');
    return templateCache_index;
}

export function renderTemplate_index (template: string, data: string[]): string {
    // 创建单词列表的 HTML
    const wordListHtml = `
        <div class="word-container">
            <h2 class="title">Recent Words</h2>
            <div class="word-list">
                ${data
            .map((word, index) => `
                        <div class="word-item" data-index="${index + 1}">
                            <a class="word-text" href="/word/${word}">${word}</a>
                        </div>
                    `)
            .join('')}
            </div>
        </div>
    `;

    // 替换模板中的占位符
    // 假设模板中有 {{CONTENT}} 作为占位符
    return template.replace('{{WORDLIST}}', wordListHtml);
}

export function renderTemplate (template: string, data: TemplateData): string {
    // Replace all placeholders with actual data
    let rendered = template;

    // Replace simple placeholders
    rendered = rendered.replace(/\{\{pattern\}\}/g, data.pattern);

    // Generate letter count options
    const letterCountOptions = Array.from({ length: 11 }, (_, i) => i + 3)
        .map(num => `<option value="${num}" ${num === data.pattern.length ? 'selected' : ''}>${num}</option>`)
        .join('\n');
    rendered = rendered.replace('{{LETTER_COUNT_OPTIONS}}', letterCountOptions);

    // Generate word matches
    const wordMatches = data.matches.map(match => `
        <li class="word-item">
            <div class="word">${match.word}</div>
            <div class="definition">${match.definition}</div>
        </li>
    `).join('');
    rendered = rendered.replace('{{WORD_MATCHES}}', wordMatches);



    // Insert client-side script
    const scriptContent = `
        wordlen=${data.pattern.length};
        wordpattern="${data.pattern}"
    `;
    rendered = rendered.replace('{{SCRIPT_CONTENT}}', scriptContent);

    return rendered;
}

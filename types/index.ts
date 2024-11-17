// types/index.ts
export interface WordMatch {
    word: string;
    definition: string;
}

export interface TemplateData {
    pattern: string;
    matches: WordMatch[];
    total_matches: number;
}


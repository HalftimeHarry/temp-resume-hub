/**
 * Keyword Adaptation Service
 * 
 * Intelligently adapts text content with industry-specific keywords
 * while maintaining original meaning and natural language flow.
 */

import { getIndustryKeywords, type KeywordMapping } from './IndustryKeywords';

export type KeywordIntensity = 'light' | 'moderate' | 'aggressive';

export interface AdaptationConfig {
  intensity: KeywordIntensity;
  preserveOriginal: boolean; // Keep some original terms for authenticity
  contextAware: boolean; // Use context matching for better replacements
  maxReplacements?: number; // Limit number of replacements per text
}

export interface AdaptationResult {
  original: string;
  adapted: string;
  replacements: Array<{
    from: string;
    to: string;
    position: number;
  }>;
  score: number; // How much the text was adapted (0-1)
}

const DEFAULT_CONFIG: AdaptationConfig = {
  intensity: 'moderate',
  preserveOriginal: true,
  contextAware: true,
  maxReplacements: undefined
};

/**
 * Keyword Adapter Service
 */
export class KeywordAdapter {
  private industry: string;
  private config: AdaptationConfig;

  constructor(industry: string, config: Partial<AdaptationConfig> = {}) {
    this.industry = industry;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Adapt text with industry-specific keywords
   */
  public adaptText(text: string): AdaptationResult {
    if (!text || text.trim().length === 0) {
      return {
        original: text,
        adapted: text,
        replacements: [],
        score: 0
      };
    }

    const industryData = getIndustryKeywords(this.industry);
    if (!industryData) {
      return {
        original: text,
        adapted: text,
        replacements: [],
        score: 0
      };
    }

    let adaptedText = text;
    const replacements: Array<{ from: string; to: string; position: number }> = [];
    
    // Get intensity-based replacement probability
    const replacementProbability = this.getReplacementProbability();
    
    // Sort mappings by weight (higher weight = more important)
    const sortedMappings = [...industryData.mappings].sort((a, b) => 
      (b.weight || 0.5) - (a.weight || 0.5)
    );

    // Apply replacements
    for (const mapping of sortedMappings) {
      // Check if we've hit max replacements
      if (this.config.maxReplacements && replacements.length >= this.config.maxReplacements) {
        break;
      }

      // Decide whether to apply this replacement based on intensity
      if (Math.random() > replacementProbability) {
        continue;
      }

      const result = this.applyMapping(adaptedText, mapping);
      if (result.replaced) {
        adaptedText = result.text;
        replacements.push(...result.replacements);
      }
    }

    // Calculate adaptation score
    const score = this.calculateAdaptationScore(text, adaptedText, replacements.length);

    return {
      original: text,
      adapted: adaptedText,
      replacements,
      score
    };
  }

  /**
   * Adapt multiple text segments (e.g., bullet points)
   */
  public adaptTextArray(texts: string[]): AdaptationResult[] {
    return texts.map(text => this.adaptText(text));
  }

  /**
   * Apply a single keyword mapping to text
   */
  private applyMapping(
    text: string,
    mapping: KeywordMapping
  ): { text: string; replaced: boolean; replacements: Array<{ from: string; to: string; position: number }> } {
    const replacements: Array<{ from: string; to: string; position: number }> = [];
    let replaced = false;

    // Create case-insensitive regex for the generic term
    const regex = new RegExp(`\\b${this.escapeRegex(mapping.generic)}\\b`, 'gi');
    
    // Find all matches
    const matches = Array.from(text.matchAll(regex));
    
    if (matches.length === 0) {
      return { text, replaced: false, replacements: [] };
    }

    // Check context if required
    if (this.config.contextAware && mapping.context && mapping.context.length > 0) {
      // Only replace if context words are nearby
      const hasContext = matches.some(match => {
        const position = match.index || 0;
        const contextWindow = text.substring(
          Math.max(0, position - 50),
          Math.min(text.length, position + 50)
        ).toLowerCase();
        
        return mapping.context!.some(contextWord => 
          contextWindow.includes(contextWord.toLowerCase())
        );
      });

      if (!hasContext) {
        return { text, replaced: false, replacements: [] };
      }
    }

    // Apply replacement (preserve original case)
    let newText = text;
    let offset = 0;

    for (const match of matches) {
      const position = (match.index || 0) + offset;
      const originalWord = match[0];
      const replacementWord = this.matchCase(originalWord, mapping.replacement);

      // Skip if preserveOriginal is true and we randomly decide to keep original
      if (this.config.preserveOriginal && Math.random() < 0.3) {
        continue;
      }

      newText = 
        newText.substring(0, position) +
        replacementWord +
        newText.substring(position + originalWord.length);

      offset += replacementWord.length - originalWord.length;
      
      replacements.push({
        from: originalWord,
        to: replacementWord,
        position
      });
      
      replaced = true;
    }

    return { text: newText, replaced, replacements };
  }

  /**
   * Match the case of the replacement to the original word
   */
  private matchCase(original: string, replacement: string): string {
    // All uppercase
    if (original === original.toUpperCase()) {
      return replacement.toUpperCase();
    }
    
    // First letter uppercase
    if (original[0] === original[0].toUpperCase()) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }
    
    // All lowercase
    return replacement.toLowerCase();
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Get replacement probability based on intensity
   */
  private getReplacementProbability(): number {
    switch (this.config.intensity) {
      case 'light':
        return 0.3; // Replace ~30% of opportunities
      case 'moderate':
        return 0.6; // Replace ~60% of opportunities
      case 'aggressive':
        return 0.9; // Replace ~90% of opportunities
      default:
        return 0.6;
    }
  }

  /**
   * Calculate how much the text was adapted (0-1)
   */
  private calculateAdaptationScore(
    original: string,
    adapted: string,
    replacementCount: number
  ): number {
    if (original === adapted) {
      return 0;
    }

    // Calculate based on character changes and replacement count
    const charDiff = Math.abs(adapted.length - original.length);
    const wordCount = original.split(/\s+/).length;
    
    // Score based on replacements relative to word count
    const replacementScore = Math.min(1, replacementCount / (wordCount * 0.3));
    
    // Score based on character changes
    const charScore = Math.min(1, charDiff / (original.length * 0.2));
    
    // Weighted average
    return (replacementScore * 0.7 + charScore * 0.3);
  }

  /**
   * Add industry-specific keywords to text without replacing existing content
   */
  public enrichText(text: string, maxKeywords: number = 3): string {
    const industryData = getIndustryKeywords(this.industry);
    if (!industryData) {
      return text;
    }

    // Select random keywords that aren't already in the text
    const lowerText = text.toLowerCase();
    const availableKeywords = industryData.keywords.filter(
      keyword => !lowerText.includes(keyword.toLowerCase())
    );

    if (availableKeywords.length === 0) {
      return text;
    }

    // Randomly select keywords
    const selectedKeywords = availableKeywords
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(maxKeywords, availableKeywords.length));

    // Add keywords naturally to the end
    if (selectedKeywords.length > 0) {
      const keywordPhrase = selectedKeywords.join(', ');
      return `${text} Experienced with ${keywordPhrase}.`;
    }

    return text;
  }

  /**
   * Get statistics about potential adaptations
   */
  public analyzeText(text: string): {
    wordCount: number;
    potentialReplacements: number;
    industryKeywordsPresent: number;
    adaptationPotential: 'low' | 'medium' | 'high';
  } {
    const industryData = getIndustryKeywords(this.industry);
    if (!industryData) {
      return {
        wordCount: 0,
        potentialReplacements: 0,
        industryKeywordsPresent: 0,
        adaptationPotential: 'low'
      };
    }

    const wordCount = text.split(/\s+/).length;
    const lowerText = text.toLowerCase();

    // Count potential replacements
    let potentialReplacements = 0;
    for (const mapping of industryData.mappings) {
      const regex = new RegExp(`\\b${this.escapeRegex(mapping.generic)}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        potentialReplacements += matches.length;
      }
    }

    // Count industry keywords already present
    let industryKeywordsPresent = 0;
    for (const keyword of industryData.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        industryKeywordsPresent++;
      }
    }

    // Determine adaptation potential
    const replacementRatio = potentialReplacements / wordCount;
    let adaptationPotential: 'low' | 'medium' | 'high';
    
    if (replacementRatio > 0.15 || industryKeywordsPresent < 2) {
      adaptationPotential = 'high';
    } else if (replacementRatio > 0.08 || industryKeywordsPresent < 4) {
      adaptationPotential = 'medium';
    } else {
      adaptationPotential = 'low';
    }

    return {
      wordCount,
      potentialReplacements,
      industryKeywordsPresent,
      adaptationPotential
    };
  }
}

/**
 * Convenience function to adapt text with default settings
 */
export function adaptTextForIndustry(
  text: string,
  industry: string,
  intensity: KeywordIntensity = 'moderate'
): string {
  const adapter = new KeywordAdapter(industry, { intensity });
  const result = adapter.adaptText(text);
  return result.adapted;
}

/**
 * Convenience function to adapt an array of texts
 */
export function adaptTextsForIndustry(
  texts: string[],
  industry: string,
  intensity: KeywordIntensity = 'moderate'
): string[] {
  const adapter = new KeywordAdapter(industry, { intensity });
  return texts.map(text => adapter.adaptText(text).adapted);
}

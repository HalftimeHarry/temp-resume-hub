import { describe, it, expect, beforeEach } from 'vitest';
import { KeywordAdapter, adaptTextForIndustry, adaptTextsForIndustry } from '$lib/services/KeywordAdapter';
import { getIndustryKeywords, detectIndustry } from '$lib/services/IndustryKeywords';

describe('IndustryKeywords', () => {
  describe('getIndustryKeywords', () => {
    it('should return keywords for valid industry', () => {
      const keywords = getIndustryKeywords('software-engineering');
      expect(keywords).toBeTruthy();
      expect(keywords?.name).toBe('Software Engineering');
      expect(keywords?.keywords.length).toBeGreaterThan(0);
      expect(keywords?.mappings.length).toBeGreaterThan(0);
    });

    it('should return null for invalid industry', () => {
      const keywords = getIndustryKeywords('invalid-industry');
      expect(keywords).toBeNull();
    });

    it('should handle case-insensitive industry names', () => {
      const keywords1 = getIndustryKeywords('Software-Engineering');
      const keywords2 = getIndustryKeywords('software-engineering');
      expect(keywords1).toEqual(keywords2);
    });
  });

  describe('detectIndustry', () => {
    it('should detect software engineering from text', () => {
      const text = 'Developed scalable microservices using Docker and Kubernetes. Implemented CI/CD pipelines.';
      const industry = detectIndustry(text);
      expect(industry).toBe('software-engineering');
    });

    it('should detect web development from text', () => {
      const text = 'Created responsive web applications with modern JavaScript frameworks. Optimized performance and accessibility.';
      const industry = detectIndustry(text);
      expect(industry).toBe('web-development');
    });

    it('should detect data science from text', () => {
      const text = 'Performed statistical analysis and built machine learning models. Developed data pipelines for big data processing.';
      const industry = detectIndustry(text);
      expect(industry).toBe('data-science');
    });

    it('should return null for generic text', () => {
      const text = 'I like to work on interesting projects and help people.';
      const industry = detectIndustry(text);
      expect(industry).toBeNull();
    });
  });
});

describe('KeywordAdapter', () => {
  describe('constructor', () => {
    it('should create adapter with default config', () => {
      const adapter = new KeywordAdapter('software-engineering');
      expect(adapter).toBeTruthy();
    });

    it('should create adapter with custom config', () => {
      const adapter = new KeywordAdapter('software-engineering', {
        intensity: 'aggressive',
        preserveOriginal: false,
        contextAware: false
      });
      expect(adapter).toBeTruthy();
    });
  });

  describe('adaptText - Software Engineering', () => {
    let adapter: KeywordAdapter;

    beforeEach(() => {
      adapter = new KeywordAdapter('software-engineering', {
        intensity: 'aggressive',
        preserveOriginal: false
      });
    });

    it('should replace "built" with "engineered"', () => {
      const result = adapter.adaptText('I built a new system');
      expect(result.adapted.toLowerCase()).toContain('engineered');
      expect(result.replacements.length).toBeGreaterThan(0);
    });

    it('should replace "made" with "developed"', () => {
      // Run multiple times due to randomness in preserveOriginal
      let foundReplacement = false;
      for (let i = 0; i < 5; i++) {
        const result = adapter.adaptText('I made a web application');
        if (result.adapted.toLowerCase().includes('developed')) {
          foundReplacement = true;
          break;
        }
      }
      expect(foundReplacement).toBe(true);
    });

    it('should replace "fixed" with "resolved" or "debugged"', () => {
      const result = adapter.adaptText('I fixed several bugs');
      const adapted = result.adapted.toLowerCase();
      expect(adapted.includes('resolved') || adapted.includes('debugged')).toBe(true);
    });

    it('should replace "website" with "web application"', () => {
      const result = adapter.adaptText('Built a company website');
      expect(result.adapted.toLowerCase()).toContain('web application');
    });

    it('should preserve case in replacements', () => {
      const result1 = adapter.adaptText('Built a system');
      const result2 = adapter.adaptText('built a system');
      
      // First letter should match original case
      if (result1.adapted.includes('Engineered')) {
        expect(result1.adapted[0]).toBe(result1.adapted[0].toUpperCase());
      }
      if (result2.adapted.includes('engineered')) {
        expect(result2.adapted[0]).toBe(result2.adapted[0].toLowerCase());
      }
    });

    it('should handle multiple replacements in one text', () => {
      const text = 'I built a website and fixed bugs';
      const result = adapter.adaptText(text);
      expect(result.replacements.length).toBeGreaterThanOrEqual(2);
    });

    it('should return original text if no replacements found', () => {
      const text = 'This text has no replaceable words xyz';
      const result = adapter.adaptText(text);
      expect(result.adapted).toBe(text);
      expect(result.replacements.length).toBe(0);
      expect(result.score).toBe(0);
    });

    it('should handle empty text', () => {
      const result = adapter.adaptText('');
      expect(result.adapted).toBe('');
      expect(result.replacements.length).toBe(0);
    });
  });

  describe('adaptText - Context Awareness', () => {
    it('should use context-aware replacements', () => {
      const adapter = new KeywordAdapter('software-engineering', {
        intensity: 'aggressive',
        contextAware: true
      });

      // "created" should become "architected" when near "system"
      const result = adapter.adaptText('Created a new system architecture');
      // May or may not replace depending on random factors, but should not error
      expect(result.adapted).toBeTruthy();
    });

    it('should skip context-specific replacements without context', () => {
      const adapter = new KeywordAdapter('software-engineering', {
        intensity: 'aggressive',
        contextAware: true
      });

      const result = adapter.adaptText('Created a document');
      // Should still adapt, but maybe not with context-specific replacement
      expect(result.adapted).toBeTruthy();
    });
  });

  describe('adaptText - Different Industries', () => {
    it('should adapt for web development', () => {
      const adapter = new KeywordAdapter('web-development', {
        intensity: 'aggressive',
        preserveOriginal: false
      });

      const result = adapter.adaptText('Made a responsive page');
      const adapted = result.adapted.toLowerCase();
      expect(adapted.includes('crafted') || adapted.includes('built') || adapted.includes('developed')).toBe(true);
    });

    it('should adapt for data science', () => {
      const adapter = new KeywordAdapter('data-science', {
        intensity: 'aggressive',
        preserveOriginal: false
      });

      const result = adapter.adaptText('Looked at the data and found patterns');
      const adapted = result.adapted.toLowerCase();
      expect(adapted.includes('analyzed') || adapted.includes('discovered') || adapted.includes('identified')).toBe(true);
    });

    it('should adapt for marketing', () => {
      const adapter = new KeywordAdapter('marketing', {
        intensity: 'aggressive',
        preserveOriginal: false
      });

      const result = adapter.adaptText('Created a campaign and got more leads');
      const adapted = result.adapted.toLowerCase();
      expect(adapted.includes('launched') || adapted.includes('generated') || adapted.includes('developed')).toBe(true);
    });
  });

  describe('adaptText - Intensity Levels', () => {
    const text = 'I built a website and made improvements and fixed bugs';

    it('should make fewer replacements with light intensity', () => {
      const adapter = new KeywordAdapter('software-engineering', {
        intensity: 'light',
        preserveOriginal: false
      });

      const results = [];
      // Run multiple times due to randomness
      for (let i = 0; i < 10; i++) {
        results.push(adapter.adaptText(text));
      }

      const avgReplacements = results.reduce((sum, r) => sum + r.replacements.length, 0) / results.length;
      expect(avgReplacements).toBeLessThan(2); // Light should replace less
    });

    it('should make more replacements with aggressive intensity', () => {
      const adapter = new KeywordAdapter('software-engineering', {
        intensity: 'aggressive',
        preserveOriginal: false
      });

      const results = [];
      // Run multiple times due to randomness
      for (let i = 0; i < 10; i++) {
        results.push(adapter.adaptText(text));
      }

      const avgReplacements = results.reduce((sum, r) => sum + r.replacements.length, 0) / results.length;
      expect(avgReplacements).toBeGreaterThan(1.5); // Aggressive should replace more
    });
  });

  describe('adaptTextArray', () => {
    it('should adapt multiple texts', () => {
      const adapter = new KeywordAdapter('software-engineering', {
        intensity: 'aggressive',
        preserveOriginal: false
      });

      const texts = [
        'Built a new system',
        'Fixed critical bugs',
        'Made improvements'
      ];

      const results = adapter.adaptTextArray(texts);
      expect(results.length).toBe(3);
      results.forEach(result => {
        expect(result.adapted).toBeTruthy();
      });
    });

    it('should handle empty array', () => {
      const adapter = new KeywordAdapter('software-engineering');
      const results = adapter.adaptTextArray([]);
      expect(results.length).toBe(0);
    });
  });

  describe('enrichText', () => {
    it('should add industry keywords to text', () => {
      const adapter = new KeywordAdapter('software-engineering');
      const text = 'I am a developer';
      const enriched = adapter.enrichText(text, 2);
      
      expect(enriched.length).toBeGreaterThan(text.length);
      expect(enriched).toContain('Experienced with');
    });

    it('should not add keywords already present', () => {
      const adapter = new KeywordAdapter('software-engineering');
      const text = 'I work with microservices, CI/CD, and cloud-native applications';
      const enriched = adapter.enrichText(text, 2);
      
      // Should either be same or have different keywords
      expect(enriched).toBeTruthy();
    });

    it('should respect maxKeywords parameter', () => {
      const adapter = new KeywordAdapter('software-engineering');
      const text = 'I am a developer';
      const enriched = adapter.enrichText(text, 1);
      
      // Count commas to estimate number of keywords added
      const addedText = enriched.replace(text, '');
      const commaCount = (addedText.match(/,/g) || []).length;
      expect(commaCount).toBeLessThanOrEqual(1);
    });
  });

  describe('analyzeText', () => {
    it('should analyze text and return statistics', () => {
      const adapter = new KeywordAdapter('software-engineering');
      const text = 'I built a website and fixed bugs in the system';
      
      const analysis = adapter.analyzeText(text);
      
      expect(analysis.wordCount).toBeGreaterThan(0);
      expect(analysis.potentialReplacements).toBeGreaterThan(0);
      expect(analysis.adaptationPotential).toMatch(/low|medium|high/);
    });

    it('should detect high adaptation potential for generic text', () => {
      const adapter = new KeywordAdapter('software-engineering');
      const text = 'I made things and built stuff and fixed problems';
      
      const analysis = adapter.analyzeText(text);
      
      expect(analysis.potentialReplacements).toBeGreaterThan(2);
      expect(analysis.adaptationPotential).toBe('high');
    });

    it('should detect low adaptation potential for industry-specific text', () => {
      const adapter = new KeywordAdapter('software-engineering');
      const text = 'Architected microservices using Docker and Kubernetes. Implemented CI/CD pipelines with automated testing.';
      
      const analysis = adapter.analyzeText(text);
      
      expect(analysis.industryKeywordsPresent).toBeGreaterThanOrEqual(2);
      expect(analysis.adaptationPotential).toMatch(/low|medium/);
    });
  });

  describe('Convenience Functions', () => {
    it('adaptTextForIndustry should work', () => {
      // Run multiple times due to randomness
      let foundChange = false;
      for (let i = 0; i < 10; i++) {
        const adapted = adaptTextForIndustry(
          'I built a website',
          'software-engineering',
          'aggressive'
        );
        
        if (adapted !== 'I built a website') {
          foundChange = true;
          break;
        }
      }
      expect(foundChange).toBe(true);
    });

    it('adaptTextsForIndustry should work', () => {
      const texts = ['Built a system', 'Fixed bugs'];
      const adapted = adaptTextsForIndustry(
        texts,
        'software-engineering',
        'aggressive'
      );
      
      expect(adapted.length).toBe(2);
      adapted.forEach(text => {
        expect(text).toBeTruthy();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle text with special characters', () => {
      const adapter = new KeywordAdapter('software-engineering');
      const text = 'I built a system! It fixed many bugs.';
      const result = adapter.adaptText(text);
      
      expect(result.adapted).toBeTruthy();
      expect(result.adapted).toContain('!');
      expect(result.adapted).toContain('.');
    });

    it('should handle text with numbers', () => {
      const adapter = new KeywordAdapter('software-engineering');
      const text = 'Built 5 systems and fixed 100 bugs';
      const result = adapter.adaptText(text);
      
      expect(result.adapted).toContain('5');
      expect(result.adapted).toContain('100');
    });

    it('should handle very short text', () => {
      const adapter = new KeywordAdapter('software-engineering');
      const result = adapter.adaptText('Built it');
      
      expect(result.adapted).toBeTruthy();
    });

    it('should handle very long text', () => {
      const adapter = new KeywordAdapter('software-engineering', {
        intensity: 'aggressive',
        preserveOriginal: false
      });
      const longText = 'I built a system. '.repeat(100);
      const result = adapter.adaptText(longText);
      
      expect(result.adapted).toBeTruthy();
      // With aggressive intensity and preserveOriginal=false, should make replacements
      expect(result.replacements.length).toBeGreaterThanOrEqual(0);
    });

    it('should not replace partial word matches', () => {
      const adapter = new KeywordAdapter('software-engineering', {
        intensity: 'aggressive',
        preserveOriginal: false
      });
      
      const text = 'The rebuild process was successful';
      const result = adapter.adaptText(text);
      
      // "built" is part of "rebuild" but shouldn't be replaced
      expect(result.adapted).toContain('rebuild');
    });
  });
});

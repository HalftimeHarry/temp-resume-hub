import { describe, it, expect } from 'vitest';

describe('Dashboard Resume Filtering and Sorting', () => {
  // Mock resume data
  const mockResumes = [
    {
      id: '1',
      title: 'Software Engineer Resume',
      purpose: 'Senior Developer - Tech Startup',
      target_industry: 'Technology',
      updated: '2024-01-15',
      content: { personalInfo: { fullName: 'John Doe' } }
    },
    {
      id: '2',
      title: 'Healthcare Professional Resume',
      purpose: 'Nurse Practitioner - Hospital',
      target_industry: 'Healthcare',
      updated: '2024-01-20',
      content: { personalInfo: { fullName: 'Jane Smith' } }
    },
    {
      id: '3',
      title: 'Financial Analyst Resume',
      purpose: 'Senior Analyst - Investment Bank',
      target_industry: 'Finance',
      updated: '2024-01-10',
      content: { personalInfo: { fullName: 'Bob Johnson' } }
    },
    {
      id: '4',
      title: 'Marketing Manager Resume',
      purpose: undefined,
      target_industry: undefined,
      updated: '2024-01-25',
      content: { personalInfo: { fullName: 'Alice Williams' } }
    }
  ];

  describe('Industry Filtering', () => {
    it('should return all resumes when filter is "all"', () => {
      const industryFilter = 'all';
      const filtered = mockResumes.filter(resume => 
        industryFilter === 'all' || resume.target_industry === industryFilter
      );
      
      expect(filtered).toHaveLength(4);
    });

    it('should filter resumes by Technology industry', () => {
      const industryFilter = 'Technology';
      const filtered = mockResumes.filter(resume => 
        industryFilter === 'all' || resume.target_industry === industryFilter
      );
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].target_industry).toBe('Technology');
    });

    it('should filter resumes by Healthcare industry', () => {
      const industryFilter = 'Healthcare';
      const filtered = mockResumes.filter(resume => 
        industryFilter === 'all' || resume.target_industry === industryFilter
      );
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].target_industry).toBe('Healthcare');
    });

    it('should handle resumes without industry', () => {
      const industryFilter = 'Technology';
      const filtered = mockResumes.filter(resume => 
        industryFilter === 'all' || resume.target_industry === industryFilter
      );
      
      // Should not include resume without industry
      expect(filtered.every(r => r.target_industry === 'Technology')).toBe(true);
    });
  });

  describe('Search Filtering', () => {
    it('should filter by title', () => {
      const searchQuery = 'software';
      const filtered = mockResumes.filter(resume =>
        resume.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toContain('Software');
    });

    it('should filter by purpose', () => {
      const searchQuery = 'senior';
      const filtered = mockResumes.filter(resume =>
        resume.purpose?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      expect(filtered).toHaveLength(2);
    });

    it('should filter by industry in search', () => {
      const searchQuery = 'healthcare';
      const filtered = mockResumes.filter(resume =>
        resume.target_industry?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].target_industry).toBe('Healthcare');
    });

    it('should filter by person name', () => {
      const searchQuery = 'john';
      const filtered = mockResumes.filter(resume =>
        resume.content?.personalInfo?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      expect(filtered).toHaveLength(2); // John Doe and Bob Johnson
    });

    it('should be case insensitive', () => {
      const searchQuery = 'TECHNOLOGY';
      const filtered = mockResumes.filter(resume =>
        resume.target_industry?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      expect(filtered).toHaveLength(1);
    });
  });

  describe('Combined Filtering', () => {
    it('should apply both search and industry filter', () => {
      const searchQuery = 'senior';
      const industryFilter = 'Technology';
      
      const filtered = mockResumes.filter(resume => {
        const matchesSearch = 
          resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resume.purpose?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesIndustry = industryFilter === 'all' || resume.target_industry === industryFilter;
        
        return matchesSearch && matchesIndustry;
      });
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].target_industry).toBe('Technology');
      expect(filtered[0].purpose).toContain('Senior');
    });
  });

  describe('Sorting', () => {
    it('should sort by date (newest first)', () => {
      const sorted = [...mockResumes].sort((a, b) => 
        new Date(b.updated).getTime() - new Date(a.updated).getTime()
      );
      
      expect(sorted[0].id).toBe('4'); // 2024-01-25
      expect(sorted[1].id).toBe('2'); // 2024-01-20
      expect(sorted[2].id).toBe('1'); // 2024-01-15
      expect(sorted[3].id).toBe('3'); // 2024-01-10
    });

    it('should sort by industry alphabetically', () => {
      const sorted = [...mockResumes].sort((a, b) => 
        (a.target_industry || '').localeCompare(b.target_industry || '')
      );
      
      // Empty industries come first, then alphabetical
      expect(sorted[0].target_industry).toBeUndefined();
      expect(sorted[1].target_industry).toBe('Finance');
      expect(sorted[2].target_industry).toBe('Healthcare');
      expect(sorted[3].target_industry).toBe('Technology');
    });

    it('should sort by purpose alphabetically', () => {
      const sorted = [...mockResumes].sort((a, b) => 
        (a.purpose || '').localeCompare(b.purpose || '')
      );
      
      // Empty purposes come first
      expect(sorted[0].purpose).toBeUndefined();
    });

    it('should sort by title alphabetically', () => {
      const sorted = [...mockResumes].sort((a, b) => 
        a.title.localeCompare(b.title)
      );
      
      expect(sorted[0].title).toBe('Financial Analyst Resume');
      expect(sorted[1].title).toBe('Healthcare Professional Resume');
      expect(sorted[2].title).toBe('Marketing Manager Resume');
      expect(sorted[3].title).toBe('Software Engineer Resume');
    });
  });

  describe('Available Industries Extraction', () => {
    it('should extract unique industries from resumes', () => {
      const industries = Array.from(
        new Set(
          mockResumes
            .map(r => r.target_industry)
            .filter(Boolean)
        )
      ).sort();
      
      expect(industries).toEqual(['Finance', 'Healthcare', 'Technology']);
    });

    it('should exclude undefined/null industries', () => {
      const industries = Array.from(
        new Set(
          mockResumes
            .map(r => r.target_industry)
            .filter(Boolean)
        )
      );
      
      expect(industries).not.toContain(undefined);
      expect(industries).not.toContain(null);
    });

    it('should return sorted industries', () => {
      const industries = Array.from(
        new Set(
          mockResumes
            .map(r => r.target_industry)
            .filter(Boolean)
        )
      ).sort();
      
      // Check if sorted alphabetically
      for (let i = 0; i < industries.length - 1; i++) {
        expect(industries[i].localeCompare(industries[i + 1])).toBeLessThan(0);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty resume list', () => {
      const emptyResumes: any[] = [];
      const filtered = emptyResumes.filter(resume => 
        resume.target_industry === 'Technology'
      );
      
      expect(filtered).toHaveLength(0);
    });

    it('should handle resumes with null values', () => {
      const resumesWithNulls = [
        { id: '1', title: 'Test', purpose: null, target_industry: null, updated: '2024-01-01' }
      ];
      
      const filtered = resumesWithNulls.filter(resume =>
        resume.purpose?.toLowerCase().includes('test')
      );
      
      expect(filtered).toHaveLength(0);
    });

    it('should handle special characters in search', () => {
      const resumeWithSpecialChars = [
        { id: '1', title: 'C++ Developer', purpose: 'Senior C++ Engineer', target_industry: 'Technology' }
      ];
      
      const searchQuery = 'c++';
      const filtered = resumeWithSpecialChars.filter(resume =>
        resume.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      expect(filtered).toHaveLength(1);
    });
  });
});

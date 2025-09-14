import { describe, it, expect } from 'vitest';

// Simple utility function to test
function formatTitle(name: string): string {
	return `Welcome to ${name}`;
}

describe('Utility Functions', () => {
	it('formats title correctly', () => {
		expect(formatTitle('Resume Hub')).toBe('Welcome to Resume Hub');
	});

	it('handles empty string', () => {
		expect(formatTitle('')).toBe('Welcome to ');
	});

	it('handles special characters', () => {
		expect(formatTitle('Test & App')).toBe('Welcome to Test & App');
	});
});

describe('Environment', () => {
	it('should have testing environment set up', () => {
		expect(typeof window).toBe('object');
		expect(typeof document).toBe('object');
	});
});
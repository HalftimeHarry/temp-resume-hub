import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Utility types for shadcn/ui components
export type WithElementRef<T, E extends HTMLElement = HTMLElement> = T & {
	ref?: E | null;
};

export type WithoutChildren<T> = Omit<T, 'children'>;
export type WithoutChild<T> = Omit<T, 'child'>;
export type WithoutChildrenOrChild<T> = Omit<T, 'children' | 'child'>;

// Utility functions
export function generateId(length?: number): string {
	if (length) {
		return Array.from({ length }, () => Math.random().toString(36)[2]).join('');
	}
	return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

// Validation functions
export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
	const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
	return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

export function formatDate(date: string): string {
	if (!date) return '';
	const d = new Date(date);
	return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}
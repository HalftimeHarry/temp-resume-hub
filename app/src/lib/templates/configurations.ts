import type { ClientTemplateConfig } from './types';
import { DESIGN_TEMPLATES } from './design-templates';

/**
 * Client-side template configurations
 * Templates define VISUAL DESIGN only - content comes from industry seed data
 * 
 * This separates:
 * - DESIGN (templates) - how the resume looks
 * - CONTENT (seed data) - what goes in the resume
 */
export const TEMPLATE_CONFIGURATIONS: Record<string, ClientTemplateConfig> = DESIGN_TEMPLATES;

/**
 * Get all available client-side template IDs
 */
export function getClientTemplateIds(): string[] {
  return Object.keys(TEMPLATE_CONFIGURATIONS);
}

/**
 * Get a specific client-side template configuration
 */
export function getClientTemplate(id: string): ClientTemplateConfig | undefined {
  return TEMPLATE_CONFIGURATIONS[id];
}

/**
 * Check if a template ID exists in client-side configurations
 */
export function isClientTemplate(id: string): boolean {
  return id in TEMPLATE_CONFIGURATIONS;
}

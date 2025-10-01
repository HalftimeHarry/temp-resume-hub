/**
 * Template system entry point
 * Provides unified access to both client-side and database templates
 */

export { 
  TEMPLATE_CONFIGURATIONS,
  getClientTemplateIds,
  getClientTemplate,
  isClientTemplate
} from './configurations';

export type {
  ClientTemplateConfig,
  ExtendedResumeTemplate,
  TemplateSource,
  TemplateLoadOptions
} from './types';

import type { ResumeTemplate } from '$lib/types/resume';
import type { ClientTemplateConfig, ExtendedResumeTemplate } from './types';
import { TEMPLATE_CONFIGURATIONS } from './configurations';

/**
 * Convert client-side template configuration to ResumeTemplate format
 */
export function clientConfigToResumeTemplate(id: string, config: ClientTemplateConfig): ExtendedResumeTemplate {
  return {
    id,
    name: config.name,
    description: config.description,
    category: config.category,
    thumbnail: config.thumbnail,
    previewImages: config.previewImages,
    settings: config.settings,
    sections: [], // Will be populated based on sectionOrder
    starterData: config.starterData,
    styleConfig: undefined,
    styles: undefined,
    isPremium: config.isPremium,
    isPopular: false, // Client templates are not marked as popular by default
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    usageCount: 0,
    rating: 0,
    tags: config.tags,
    isClientSide: true,
    targeting: config.targeting
  };
}

/**
 * Get all client-side templates as ResumeTemplate objects
 */
export function getClientTemplatesAsResumeTemplates(): ExtendedResumeTemplate[] {
  return Object.entries(TEMPLATE_CONFIGURATIONS).map(([id, config]) =>
    clientConfigToResumeTemplate(id, config)
  );
}

/**
 * Get a specific client template as ResumeTemplate
 */
export function getClientTemplateAsResumeTemplate(id: string): ExtendedResumeTemplate | undefined {
  const config = TEMPLATE_CONFIGURATIONS[id];
  if (!config) return undefined;
  
  return clientConfigToResumeTemplate(id, config);
}

/**
 * Merge client and database templates with client templates taking precedence
 */
export function mergeTemplates(
  clientTemplates: ExtendedResumeTemplate[],
  databaseTemplates: ResumeTemplate[]
): ExtendedResumeTemplate[] {
  const clientIds = new Set(clientTemplates.map(t => t.id));
  
  // Filter out database templates that have client-side overrides
  const filteredDbTemplates = databaseTemplates
    .filter(t => !clientIds.has(t.id))
    .map(t => ({ ...t, isClientSide: false }));
  
  // Client templates first, then database templates
  return [...clientTemplates, ...filteredDbTemplates];
}

/**
 * Template categories available in client-side configurations
 */
export function getClientTemplateCategories(): string[] {
  const categories = new Set(
    Object.values(TEMPLATE_CONFIGURATIONS).map(config => config.category)
  );
  return Array.from(categories).sort();
}

/**
 * Template tags available in client-side configurations
 */
export function getClientTemplateTags(): string[] {
  const tags = new Set(
    Object.values(TEMPLATE_CONFIGURATIONS).flatMap(config => config.tags)
  );
  return Array.from(tags).sort();
}
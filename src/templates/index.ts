import { beachWeddingTemplate } from './beach-wedding-1';
import type { Template } from './types';

export const TEMPLATES: Template[] = [beachWeddingTemplate];
export const TEMPLATE_MAP = Object.fromEntries(TEMPLATES.map((template) => [template.slug, template]));

import os

# Create sanitize.ts
sanitize_path = r'apps\admin\src\utils\sanitize.ts'
sanitize_content = """import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(content: string | null | undefined): string | null {
  if (!content) return null;
  return DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true }
  });
}
"""
with open(sanitize_path, 'w', encoding='utf-8') as f:
    f.write(sanitize_content)

# Update cmsActions.ts
cms_path = r'apps\admin\src\app\actions\cmsActions.ts'
with open(cms_path, 'r', encoding='utf-8') as f:
    cms_content = f.read()

if "import { sanitizeHtml } from '@/utils/sanitize';" not in cms_content:
    cms_content = cms_content.replace("import { requireAdminAuth } from './admin';", "import { requireAdminAuth } from './admin';\nimport { sanitizeHtml } from '@/utils/sanitize';")

# Apply sanitizeHtml to createNewsArticle content
cms_content = cms_content.replace(
    "content: formData.get('content'),", 
    "content: sanitizeHtml(formData.get('content') as string),"
)
cms_content = cms_content.replace(
    "content_en: formData.get('content_en'),", 
    "content_en: sanitizeHtml(formData.get('content_en') as string),"
)
# Apply sanitizeHtml to createFAQ answer (if exists)
cms_content = cms_content.replace(
    "answer: formData.get('answer'),", 
    "answer: sanitizeHtml(formData.get('answer') as string),"
)
cms_content = cms_content.replace(
    "answer_en: formData.get('answer_en'),", 
    "answer_en: sanitizeHtml(formData.get('answer_en') as string),"
)

with open(cms_path, 'w', encoding='utf-8') as f:
    f.write(cms_content)

# Update destination.ts
dest_path = r'apps\admin\src\app\actions\destination.ts'
with open(dest_path, 'r', encoding='utf-8') as f:
    dest_content = f.read()

if "import { sanitizeHtml } from '@/utils/sanitize';" not in dest_content:
    dest_content = dest_content.replace("import { requireAdminAuth } from './admin';", "import { requireAdminAuth } from './admin';\nimport { sanitizeHtml } from '@/utils/sanitize';")

dest_content = dest_content.replace(
    'const content = formData.get("content") as string;',
    'const content = sanitizeHtml(formData.get("content") as string);'
)

with open(dest_path, 'w', encoding='utf-8') as f:
    f.write(dest_content)

print("SUCCESS SETUP SANITIZATION")

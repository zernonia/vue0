import { parse } from '@vue/compiler-sfc'

/**
 * Component validation result
 */
export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  score: number // Quality score 0-100
}

/**
 * Security patterns to check for malicious code
 */
const DANGEROUS_PATTERNS = [
  {
    pattern: /eval\s*\(/gi,
    message: 'Usage of eval() is not allowed',
  },
  {
    pattern: /Function\s*\(/gi,
    message: 'Usage of Function constructor is not allowed',
  },
  {
    pattern: /innerHTML\s*=/gi,
    message: 'Direct innerHTML assignment is not allowed (XSS risk)',
  },
  {
    pattern: /outerHTML\s*=/gi,
    message: 'Direct outerHTML assignment is not allowed (XSS risk)',
  },
  {
    pattern: /document\.write/gi,
    message: 'document.write is not allowed',
  },
  {
    pattern: /fetch\s*\(/gi,
    message: 'Direct fetch calls are not allowed (should be handled via API)',
  },
  {
    pattern: /axios\./gi,
    message: 'Direct HTTP requests are not allowed',
  },
  {
    pattern: /\$http\./gi,
    message: 'Direct HTTP requests are not allowed',
  },
  {
    pattern: /<script[^>]*src=/gi,
    message: 'External script tags are not allowed',
  },
  {
    pattern: /import\s+.*\s+from\s+['"]https?:\/\//gi,
    message: 'Remote imports are not allowed',
  },
  {
    pattern: /require\s*\(\s*['"]https?:\/\//gi,
    message: 'Remote requires are not allowed',
  },
  {
    pattern: /dangerouslySetInnerHTML/gi,
    message: 'dangerouslySetInnerHTML is not allowed',
  },
  {
    pattern: /on(error|load|click|mouse\w+)\s*=/gi,
    message: 'Inline event handlers in HTML are not recommended',
  },
]

/**
 * Allowed import sources (whitelist)
 */
const ALLOWED_IMPORTS = [
  'vue',
  '@vueuse/core',
  'radix-vue',
  'lucide-vue-next',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  'date-fns',
  '@radix-icons/vue',
  'v-calendar',
  'zod',
]

/**
 * Validate a Vue component for security and quality
 */
export async function validateComponent(code: string): Promise<ValidationResult> {
  const errors: string[] = []
  const warnings: string[] = []
  let score = 100

  try {
    // Parse the SFC
    const { descriptor, errors: parseErrors } = parse(code, {
      filename: 'component.vue',
    })

    // Check for parse errors
    if (parseErrors.length > 0) {
      parseErrors.forEach((err) => {
        errors.push(`Parse error: ${err.message}`)
      })
      return {
        valid: false,
        errors,
        warnings,
        score: 0,
      }
    }

    // Check for required sections
    if (!descriptor.template) {
      errors.push('Component must have a <template> section')
      score -= 50
    }

    if (!descriptor.script && !descriptor.scriptSetup) {
      warnings.push('Component should have a <script setup> section')
      score -= 10
    }

    // Security checks on script
    const scriptContent = descriptor.scriptSetup?.content || descriptor.script?.content || ''

    for (const { pattern, message } of DANGEROUS_PATTERNS) {
      if (pattern.test(scriptContent)) {
        errors.push(`Security: ${message}`)
        score -= 30
      }
    }

    // Security checks on template
    const templateContent = descriptor.template?.content || ''

    for (const { pattern, message } of DANGEROUS_PATTERNS) {
      if (pattern.test(templateContent)) {
        errors.push(`Security: ${message}`)
        score -= 30
      }
    }

    // Check for disallowed imports
    const importPattern = /import\s+.*\s+from\s+['"](.*?)['"]/g
    let match
    while ((match = importPattern.exec(scriptContent)) !== null) {
      const importPath = match[1]

      // Check if it's a relative import (allowed)
      if (importPath.startsWith('.') || importPath.startsWith('~') || importPath.startsWith('@/')) {
        continue
      }

      // Check if it's in the whitelist
      const isAllowed = ALLOWED_IMPORTS.some(allowed =>
        importPath === allowed || importPath.startsWith(`${allowed}/`)
      )

      if (!isAllowed) {
        errors.push(`Import not allowed: ${importPath}. Only whitelisted libraries are permitted.`)
        score -= 20
      }
    }

    // Check for <style> blocks (should use Tailwind)
    if (descriptor.styles.length > 0) {
      const hasScoped = descriptor.styles.some(s => s.scoped)
      if (hasScoped) {
        warnings.push('Consider using Tailwind CSS instead of scoped styles for better consistency')
        score -= 5
      } else {
        warnings.push('Global styles detected. Use Tailwind CSS classes instead.')
        score -= 10
      }
    }

    // Check for <script setup> usage (recommended)
    if (!descriptor.scriptSetup && descriptor.script) {
      warnings.push('Consider using <script setup> for better performance and DX')
      score -= 5
    }

    // Check for TypeScript usage
    if (descriptor.scriptSetup?.lang !== 'ts' && descriptor.script?.lang !== 'ts') {
      warnings.push('Consider using TypeScript (lang="ts") for better type safety')
      score -= 5
    }

    // Quality checks
    if (templateContent.length < 50) {
      warnings.push('Template seems too simple. Add more content or markup.')
      score -= 10
    }

    if (scriptContent.length < 20) {
      warnings.push('Script is very minimal. Consider adding props, emits, or logic.')
      score -= 5
    }

    // Check for accessibility basics
    const hasAriaLabels = /aria-\w+=/gi.test(templateContent)
    const hasRoleAttributes = /role=/gi.test(templateContent)

    if (!hasAriaLabels && !hasRoleAttributes) {
      warnings.push('Consider adding ARIA attributes for better accessibility')
      score -= 5
    }

    // Check for proper key usage in v-for
    const hasVFor = /v-for/gi.test(templateContent)
    const hasKey = /:key=/gi.test(templateContent)

    if (hasVFor && !hasKey) {
      errors.push('v-for directives must have a :key attribute')
      score -= 15
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score)

    // Component is valid if no errors and score >= 50
    const valid = errors.length === 0 && score >= 50

    return {
      valid,
      errors,
      warnings,
      score,
    }
  }
  catch (error) {
    return {
      valid: false,
      errors: [`Unexpected validation error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings,
      score: 0,
    }
  }
}

/**
 * Quick validation check (just security, no scoring)
 */
export async function quickSecurityCheck(code: string): Promise<{ safe: boolean; issues: string[] }> {
  const issues: string[] = []

  for (const { pattern, message } of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      issues.push(message)
    }
  }

  return {
    safe: issues.length === 0,
    issues,
  }
}

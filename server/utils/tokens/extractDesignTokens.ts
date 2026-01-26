import { parse } from '@vue/compiler-sfc'

/**
 * Design tokens extracted from a component
 */
export interface DesignTokens {
  colors: {
    background: string[]
    text: string[]
    border: string[]
    primary: string[]
    secondary: string[]
    accent: string[]
    other: string[]
  }
  spacing: {
    padding: string[]
    margin: string[]
    gap: string[]
    space: string[]
  }
  typography: {
    fontSize: string[]
    fontWeight: string[]
    lineHeight: string[]
    letterSpacing: string[]
    fontFamily: string[]
  }
  borders: {
    width: string[]
    radius: string[]
    style: string[]
  }
  effects: {
    shadow: string[]
    opacity: string[]
    blur: string[]
  }
  layout: {
    width: string[]
    height: string[]
    display: string[]
    flex: string[]
    grid: string[]
  }
  animation: string[]
}

/**
 * Extract all Tailwind classes from a Vue component's template
 */
function extractTailwindClasses(templateContent: string): string[] {
  const classes: string[] = []

  // Match class="..." and :class="..."
  const classPattern = /(?:class|:class)=["']([^"']+)["']/g
  let match

  while ((match = classPattern.exec(templateContent)) !== null) {
    const classString = match[1]
    // Split by whitespace and filter out empty strings
    const classNames = classString.split(/\s+/).filter(c => c.trim().length > 0)
    classes.push(...classNames)
  }

  // Also match class bindings like :class="{ 'class-name': condition }"
  const bindingPattern = /:class=["']\{([^}]+)\}["']/g
  while ((match = bindingPattern.exec(templateContent)) !== null) {
    const bindingContent = match[1]
    // Extract class names from the binding (they're in quotes)
    const boundClassPattern = /['"]([^'"]+)['"]/g
    let boundMatch
    while ((boundMatch = boundClassPattern.exec(bindingContent)) !== null) {
      const classNames = boundMatch[1].split(/\s+/).filter(c => c.trim().length > 0)
      classes.push(...classNames)
    }
  }

  // Remove duplicates
  return [...new Set(classes)]
}

/**
 * Categorize Tailwind classes into design token groups
 */
function categorizeClasses(classes: string[]): DesignTokens {
  const tokens: DesignTokens = {
    colors: {
      background: [],
      text: [],
      border: [],
      primary: [],
      secondary: [],
      accent: [],
      other: [],
    },
    spacing: {
      padding: [],
      margin: [],
      gap: [],
      space: [],
    },
    typography: {
      fontSize: [],
      fontWeight: [],
      lineHeight: [],
      letterSpacing: [],
      fontFamily: [],
    },
    borders: {
      width: [],
      radius: [],
      style: [],
    },
    effects: {
      shadow: [],
      opacity: [],
      blur: [],
    },
    layout: {
      width: [],
      height: [],
      display: [],
      flex: [],
      grid: [],
    },
    animation: [],
  }

  for (const cls of classes) {
    // Colors
    if (cls.match(/^bg-/)) tokens.colors.background.push(cls)
    else if (cls.match(/^text-/)) {
      if (cls.match(/^text-(xs|sm|base|lg|xl|\d)/)) {
        tokens.typography.fontSize.push(cls)
      } else {
        tokens.colors.text.push(cls)
      }
    }
    else if (cls.match(/^border-/)) {
      if (cls.match(/^border-(\d|t-|b-|l-|r-|x-|y-)/)) {
        tokens.borders.width.push(cls)
      } else {
        tokens.colors.border.push(cls)
      }
    }
    else if (cls.match(/^(from|via|to)-/)) tokens.colors.other.push(cls)
    else if (cls.match(/^ring-/)) tokens.colors.other.push(cls)
    else if (cls.match(/^divide-/)) tokens.colors.other.push(cls)

    // Spacing
    else if (cls.match(/^p[trblxy]?-/)) tokens.spacing.padding.push(cls)
    else if (cls.match(/^m[trblxy]?-/)) tokens.spacing.margin.push(cls)
    else if (cls.match(/^gap-/)) tokens.spacing.gap.push(cls)
    else if (cls.match(/^space-[xy]-/)) tokens.spacing.space.push(cls)

    // Typography
    else if (cls.match(/^font-/)) {
      if (cls.match(/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)/)) {
        tokens.typography.fontWeight.push(cls)
      } else {
        tokens.typography.fontFamily.push(cls)
      }
    }
    else if (cls.match(/^leading-/)) tokens.typography.lineHeight.push(cls)
    else if (cls.match(/^tracking-/)) tokens.typography.letterSpacing.push(cls)

    // Borders
    else if (cls.match(/^rounded/)) tokens.borders.radius.push(cls)
    else if (cls.match(/^border-(solid|dashed|dotted|double|none)/)) tokens.borders.style.push(cls)

    // Effects
    else if (cls.match(/^shadow/)) tokens.effects.shadow.push(cls)
    else if (cls.match(/^opacity-/)) tokens.effects.opacity.push(cls)
    else if (cls.match(/^blur/)) tokens.effects.blur.push(cls)

    // Layout
    else if (cls.match(/^w-/)) tokens.layout.width.push(cls)
    else if (cls.match(/^h-/)) tokens.layout.height.push(cls)
    else if (cls.match(/^(block|inline|flex|grid|hidden)/)) tokens.layout.display.push(cls)
    else if (cls.match(/^(flex-|items-|justify-|self-)/)) tokens.layout.flex.push(cls)
    else if (cls.match(/^(grid-|col-|row-)/)) tokens.layout.grid.push(cls)

    // Animation
    else if (cls.match(/^(animate-|transition|duration-|ease-|delay-)/)) {
      tokens.animation.push(cls)
    }
  }

  // Remove duplicates from each category
  for (const category in tokens) {
    if (typeof tokens[category as keyof DesignTokens] === 'object' && !Array.isArray(tokens[category as keyof DesignTokens])) {
      for (const subcategory in tokens[category as keyof DesignTokens]) {
        const arr = tokens[category as keyof DesignTokens][subcategory as keyof typeof tokens.colors]
        if (Array.isArray(arr)) {
          tokens[category as keyof DesignTokens][subcategory as keyof typeof tokens.colors] = [...new Set(arr)] as any
        }
      }
    } else if (Array.isArray(tokens[category as keyof DesignTokens])) {
      tokens[category as keyof DesignTokens] = [...new Set(tokens[category as keyof DesignTokens])] as any
    }
  }

  return tokens
}

/**
 * Extract design tokens from a Vue component
 */
export async function extractDesignTokens(code: string): Promise<DesignTokens> {
  try {
    // Parse the SFC
    const { descriptor } = parse(code, {
      filename: 'component.vue',
    })

    const templateContent = descriptor.template?.content || ''

    // Extract Tailwind classes
    const classes = extractTailwindClasses(templateContent)

    // Categorize into design tokens
    const tokens = categorizeClasses(classes)

    return tokens
  }
  catch (error) {
    console.error('Error extracting design tokens:', error)
    // Return empty tokens on error
    return {
      colors: {
        background: [],
        text: [],
        border: [],
        primary: [],
        secondary: [],
        accent: [],
        other: [],
      },
      spacing: {
        padding: [],
        margin: [],
        gap: [],
        space: [],
      },
      typography: {
        fontSize: [],
        fontWeight: [],
        lineHeight: [],
        letterSpacing: [],
        fontFamily: [],
      },
      borders: {
        width: [],
        radius: [],
        style: [],
      },
      effects: {
        shadow: [],
        opacity: [],
        blur: [],
      },
      layout: {
        width: [],
        height: [],
        display: [],
        flex: [],
        grid: [],
      },
      animation: [],
    }
  }
}

/**
 * Get a summary of the most commonly used tokens
 */
export function getTokenSummary(tokens: DesignTokens): {
  primaryColors: string[]
  mainSpacing: string[]
  typography: string[]
} {
  return {
    primaryColors: [
      ...tokens.colors.background.slice(0, 3),
      ...tokens.colors.text.slice(0, 3),
      ...tokens.colors.border.slice(0, 2),
    ],
    mainSpacing: [
      ...tokens.spacing.padding.slice(0, 3),
      ...tokens.spacing.margin.slice(0, 2),
    ],
    typography: [
      ...tokens.typography.fontSize.slice(0, 2),
      ...tokens.typography.fontWeight.slice(0, 2),
    ],
  }
}

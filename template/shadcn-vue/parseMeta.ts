import * as fs from 'node:fs'
import { kebabCase } from 'scule'
import matter from 'gray-matter'

const componentMds = fs.readdirSync('template/shadcn-vue/.repo/content/docs/components')
const exampleMds = fs.readdirSync('template/shadcn-vue/.repo/lib/registry/default/example').filter(file => file.endsWith('.vue'))

const components = componentMds
  .map((file) => {
    const componentName = file.split('.')[0]
    const { content, data: frontmatter } = matter(fs.readFileSync(`template/shadcn-vue/.repo/content/docs/components/${file}`, 'utf-8'))
    const usage = content.split(`## Usage`)[1]?.split(`##`)[0]?.trim().replace('```vue\n', '').replace('```', '')

    const examples = exampleMds
      .filter(file => kebabCase(file).startsWith(componentName))
      .map((file) => {
        return {
          source: file,
          code: fs
            .readFileSync(`template/shadcn-vue/.repo/lib/registry/default/example/${file}`, 'utf-8')
            .trim()
            .replaceAll('@/lib/registry/default/ui', '@/components/ui'),
        }
      })

    return {
      name: componentName,
      description: frontmatter.description ?? '',
      usage,
      examples,
    }
  })
  // Only show component with usage/examples
  .filter(i => !!i.usage && !!i.examples.length)

fs.writeFileSync(
  'template/shadcn-vue/metadata.json',
  JSON.stringify(components),
)

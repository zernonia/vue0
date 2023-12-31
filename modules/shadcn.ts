import { readFileSync, readdirSync } from 'node:fs'
import {
  addComponent,
  addComponentsDir,
  createResolver,
  defineNuxtModule,
} from 'nuxt/kit'
import { parse, print } from 'recast'

export interface ShadcnVueOptions {
  /**
   * Prefix for all the imported component
   */
  prefix: string

  /**
   * Directory that the component lives in.
   * @default "~/components/ui"
   */
  componentDir: string
}

export default defineNuxtModule<ShadcnVueOptions>({
  defaults: {
    prefix: 'Ui',
    componentDir: '~/components/ui',
  },
  meta: {
    name: 'ShadcnVue',
    configKey: 'shadcn',
    version: '0.0.1',
    compatibility: {
      nuxt: '^3.0.0',
      bridge: false,
    },
  },
  async setup({ prefix, componentDir }) {
    const { resolve } = createResolver('.')
    const COMPONENT_DIR_PATH = componentDir!

    addComponentsDir({
      path: '~/components/ui',
      extensions: [],
    }, { prepend: true })

    readdirSync(resolve(COMPONENT_DIR_PATH))
      .forEach(async (dir) => {
        const filePath = resolve(COMPONENT_DIR_PATH, dir, 'index.ts')
        const content = readFileSync(filePath, { encoding: 'utf8' })
        const ast = parse(content)

        const exportedKeys: string[] = ast.program.body
          // @ts-expect-error parse return any
          .filter(node => node.type === 'ExportNamedDeclaration')
          // @ts-expect-error parse return any
          .flatMap(node => node.specifiers.map(specifier => specifier.exported.name))
          .filter((key: string) => /^[A-Z]/.test(key))

        exportedKeys.forEach((key) => {
          addComponent({
            name: `${prefix}${key}`, // name of the component to be used in vue templates
            export: key, // (optional) if the component is a named (rather than default) export
            filePath: resolve(filePath),
          })
        })
      })
  },
})

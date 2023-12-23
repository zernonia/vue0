import { downloadTemplate } from 'giget'

downloadTemplate('gh:radix-vue/shadcn-vue/apps/www/src#dev', {
  dir: 'shadcn-vue/.repo',
  force: true,
  forceClean: true,
})

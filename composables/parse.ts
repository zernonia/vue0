import { Parser } from 'htmlparser2'
import { DomHandler } from 'domhandler'
import domSerializer from 'dom-serializer'

export function parseTemplate(inputHTML: string) {
  const handler = new DomHandler()
  // Parse HTML
  const parser = new Parser(handler, { lowerCaseTags: false, recognizeSelfClosing: true })
  parser.write(inputHTML)
  parser.end()

  // Serialize the parsed DOM back to HTML
  const fixedHTML = domSerializer(handler.dom)

  return fixedHTML
}

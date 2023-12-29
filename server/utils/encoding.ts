import { getEncoding } from 'js-tiktoken'

export function encoding() {
  return getEncoding('cl100k_base')
}

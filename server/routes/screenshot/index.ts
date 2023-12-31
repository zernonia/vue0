import { getDevBrowser, getProdBrowser } from '~/server/utils/browser'

async function getScreenshot(url: string, ratio = 1) {
  const browser = process.dev ? await getDevBrowser() : await getProdBrowser()
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
  })
  await page.setViewport({
    width: 1000,
    height: 600,
    deviceScaleFactor: ratio,
  })
  const file = await page.screenshot()
  // Close the browser instance
  await browser.close()
  return file
}

export default defineEventHandler(async (event) => {
  const host = event.node.req.headers.host
  if (!host)
    return createError('No host found')

  const url = host.includes(':3000') ? `http://${host}` : `https://${host}`
  event.node.res.setHeader('Content-Type', 'image/png')
  event.node.res.setHeader(
    'Cache-Control',
    'public, immutable, no-transform, s-maxage=604800, max-age=604800',
  )
  return getScreenshot(url)
})

import edgeChromium from 'chrome-aws-lambda'
import puppeteer from 'puppeteer-core'

const LOCAL_CHROME_EXECUTABLE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

async function getScreenshot(url: string, ratio = 1) {
  const executablePath = await edgeChromium.executablePath || LOCAL_CHROME_EXECUTABLE

  const browser = await puppeteer.launch({
    args: edgeChromium.args,
    executablePath,
    headless: true,
  })
  console.dir({ browser })

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
  if (!event.node.req.headers.referer)
    return createError('No referer found')

  const url = new URL(event.node.req.headers.referer ?? '')
  event.node.res.setHeader('Content-Type', 'image/png')
  event.node.res.setHeader(
    'Cache-Control',
    'public, immutable, no-transform, s-maxage=604800, max-age=604800',
  )
  const file = await getScreenshot(url.origin)
  return file
})

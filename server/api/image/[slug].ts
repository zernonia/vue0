import { connect, launch } from 'puppeteer-core'

const chromeExecutables = {
  linux: '/usr/bin/chromium-browser',
  win32: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
}

export default defineEventHandler(async (event) => {
  const IS_PRODUCTION = process.env.NODE_ENV === 'production'

  const slug = event.context.params?.slug ?? ''
  const url = IS_PRODUCTION ? `${useRuntimeConfig().public.siteUrl}/p/${slug}` : `http://localhost:3000/p/${slug}`
  const browserlessApiKey = useRuntimeConfig().browserlessApiKey

  const getBrowser = () =>
    IS_PRODUCTION
      ? connect({ browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessApiKey}&--window-size=1280,720` })
      : launch({
        executablePath: chromeExecutables[process.platform as keyof typeof chromeExecutables],
        headless: true,
      })

  const browser = await getBrowser()

  try {
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2' })

    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 0.5 })
    const buffer = await page.screenshot({
      type: 'jpeg',
    })
    await browser.close()
    setHeaders(event, {
      'Content-Type': 'image/jpeg',
    })

    return buffer
  }
  catch (err) {
    await browser.close()
    if (err instanceof Error)
      return createError(err)
  }
})

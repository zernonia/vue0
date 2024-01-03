import { connect, launch } from 'puppeteer-core'

const chromeExecutables = {
  linux: '/usr/bin/chromium-browser',
  win32: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
}

export default defineEventHandler(async (event) => {
  const IS_PRODUCTION = process.env.NODE_ENV === 'production'

  const slug = event.context.params?.slug ?? ''
  const url = IS_PRODUCTION ? `https://www.vue0.dev/p/${slug}` : `http://localhost:3000/p/${slug}`
  const browserlessApiKey = useRuntimeConfig().browserlessApiKey

  const getBrowser = () =>
    IS_PRODUCTION
      ? connect({ browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessApiKey}&--window-size=1280,720` })
      : launch({
        args: [
          '--autoplay-policy=user-gesture-required',
          '--disable-background-networking',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-breakpad',
          '--disable-client-side-phishing-detection',
          '--disable-component-update',
          '--disable-default-apps',
          '--disable-dev-shm-usage',
          '--disable-domain-reliability',
          '--disable-extensions',
          '--disable-features=AudioServiceOutOfProcess',
          '--disable-hang-monitor',
          '--disable-ipc-flooding-protection',
          '--disable-notifications',
          '--disable-offer-store-unmasked-wallet-cards',
          '--disable-popup-blocking',
          '--disable-print-preview',
          '--disable-prompt-on-repost',
          '--disable-renderer-backgrounding',
          '--disable-setuid-sandbox',
          '--disable-speech-api',
          '--disable-sync',
          '--hide-scrollbars',
          '--ignore-gpu-blacklist',
          '--metrics-recording-only',
          '--mute-audio',
          '--no-default-browser-check',
          '--no-first-run',
          '--no-pings',
          '--no-sandbox',
          '--no-zygote',
          '--password-store=basic',
          '--use-gl=swiftshader',
          '--use-mock-keychain',
        ],
        executablePath: chromeExecutables[process.platform as keyof typeof chromeExecutables],
        headless: true,
      })

  const browser = await getBrowser()

  try {
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2' })

    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 0.5 })
    const buffer = await page.screenshot()
    await browser.close()
    setHeaders(event, {
      'Content-Type': 'image/png',
    })

    return buffer
  }
  catch (err) {
    await browser.close()
    if (err instanceof Error)
      return createError(err)
  }
})

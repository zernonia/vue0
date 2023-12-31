import chromium from '@sparticuz/chromium-min'
import puppeteer from 'puppeteer-core'
import edgeChromium from 'chrome-aws-lambda'

export async function getProdBrowser() {
  // local development is broken for this 👇
  // but it works in vercel so I'm not gonna touch it
  return puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`,
    ),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  })
}

export async function getDevBrowser() {
  const LOCAL_CHROME_EXECUTABLE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  const executablePath = await edgeChromium.executablePath || LOCAL_CHROME_EXECUTABLE

  return await puppeteer.launch({
    args: edgeChromium.args,
    executablePath,
    headless: true,
  })
}

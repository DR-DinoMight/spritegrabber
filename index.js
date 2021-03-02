const { firefox } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await firefox.launch({
    headless: true
  });

  const context = await browser.newContext({
    acceptDownloads: true
  });

  // Open new page
  const page = await context.newPage();

  // Go to https://0x72.itch.io/2bitcharactergenerator
  await page.goto('https://0x72.itch.io/2bitcharactergenerator');

  for (let index = 0; index < 1000; index++) {
    await generate(page, index+1);
  }




  // ---------------------
  await context.close();
  await browser.close();
})();

const generate = async (page, iteration) => {
  // Click text=randomize
  await page.frame({
    url: 'https://v6p9d9t4.ssl.hwcdn.net/html/1476270/index.html?v=1574335457'
  }).click('text=randomize');

  // Click text=export
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.frame({
      url: 'https://v6p9d9t4.ssl.hwcdn.net/html/1476270/index.html?v=1574335457'
    }).click('text=export')
  ]);

  await download.saveAs('./imgs/sprite_'+iteration + '.png');

  return true;
}

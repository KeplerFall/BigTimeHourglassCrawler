import puppeteer from "puppeteer";

export default async function getItems(pricePerMinute){
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });
  await page.goto('https://api.openloot.com/v2/market/listings/BT0_Hourglass_Common/items?onSale=true&page=1', { waitUntil: 'networkidle0' });
  const content = await page.content();
  const teste = await page.$eval('pre', element => element.innerHTML);

  const json = await JSON.parse(teste)

  for(let count = 1; count < json.totalPages; count ++){
    await page.goto(`https://api.openloot.com/v2/market/listings/BT0_Hourglass_Common/items?onSale=true&page=${count}`, { waitUntil: 'networkidle0' });
    let pageContent = await page.content()
    let element = await page.$eval('pre', element => element.innerHTML);
    let json = await JSON.parse(element)

    if(json?.items){
      for(let item of json.items){
        if(!item) continue
        if(!item?.item) continue
        if(!item?.item?.extra) continue
        if(!item?.item?.extra?.attributes) continue
        if(!item?.item?.extra?.attributes[0]) continue
        if(!item?.item?.extra?.attributes[0]?.value) continue
        if((item.price / parseFloat(item?.item?.extra?.attributes[0]?.value)) < pricePerMinute) console.log(`Esse vale a pena, preço: ${item.price}, tempo restante: ${item?.item?.extra?.attributes[0]?.value}, encontra ela na loja com o id: ${item.orderId}`)
      }
    }
  }  

  // Fecha o navegador
  await browser.close();
};


import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import moment from 'moment';

import knex from '../database/connection';
import sources from './sources.json'; 

interface ScrapableSource {
  uf: string,
  url: string,
  type?: any,
  property?: string,
  scraping?: {
    confirmed: any,
    deaths: any,
    recovered: any
  }
}

const calculateTotalData = async () => {
  const currentDay = moment().format('YYYY-MM-DD HH:mm:ss');
  const trx = await knex.transaction();

  const sumData = await trx('data')
  .sum({ deaths: 'deaths' })
  .sum({ confirmed: 'confirmed' })
  .sum({ recovered: 'recovered' })
  .where('created', '>=', currentDay)
  .first()
  .then((row) => row);

  const { confirmed, deaths, recovered } : any = sumData;

  const totalData = {
    uf: 'BR',
    confirmed: Number(confirmed),
    deaths: Number(deaths),
    recovered: Number(recovered),
    created: moment().utc().format("YYYY-MM-DD HH:mm:ss")
  }

  await trx('data').insert(totalData);
  await trx.commit();
}

const crawlData = async () => {
    const scrapableSources: ScrapableSource[] = sources.filter(s => s.type === 'scrapable');
    const browser = await puppeteer.launch({ headless: true });

    for (let i = 0; i < scrapableSources.length; i++) {
      const s = scrapableSources[i];

      try {
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        await page.setDefaultNavigationTimeout(60000);
    
        page.on('request', (req) => {
            if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
              req.abort();
            }
            else {
              req.continue();
            }
        });

        await page.goto(s.url, { waitUntil: 'networkidle0' });
        const content = await page.content();
        const $ = cheerio.load(content);

        let data;

        if(s.property === 'text') {
          data = {
            confirmed: $(s.scraping?.confirmed).text().trim().replace(/(\r\n|\n|\r)/gm, '').split(' ')[0],
            deaths: $(s.scraping?.deaths).text().trim().replace(/(\r\n|\n|\r)/gm, '').split(' ')[0],
            recovered: $(s.scraping?.recovered).text().trim().replace(/(\r\n|\n|\r)/gm, '').split(' ')[0]
          }
        } else {
          data = {
            confirmed: $(s.scraping?.confirmed).attr('data-value')?.trim().replace(/(\r\n|\n|\r)/gm, '').split(' ')[0],
            deaths: $(s.scraping?.deaths).attr('data-value')?.trim().replace(/(\r\n|\n|\r)/gm, '').split(' ')[0],
            recovered: $(s.scraping?.recovered).attr('data-value')?.trim().replace(/(\r\n|\n|\r)/gm, '').split(' ')[0]
          }
        }
  
        const parsedData = {
          uf: s.uf,
          confirmed: (data.confirmed && String(data.confirmed) != '0') ? Number(data.confirmed?.replace(/\./g, '')) : null,
          deaths: (data.deaths && String(data.confirmed) != '0') ? Number(data.deaths?.replace(/\./g, '')) : null,
          recovered: (data.recovered && String(data.confirmed) != '0') ? Number(data.recovered?.replace(/\./g, '')) : null,
          created: moment().utc().format("YYYY-MM-DD HH:mm:ss")
        }

        const trx = await knex.transaction();
        await trx('data').insert(parsedData);
        await trx.commit();

        await page.close();
      } catch (error) {
        console.log(`Erro [${s.uf}]: ${error.message}`);
      }
    }

    await browser.close();

    return calculateTotalData();
}

export default crawlData;
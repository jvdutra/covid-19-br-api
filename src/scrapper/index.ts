import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import moment from 'moment';
import axios from 'axios';

import knex from '../database/connection';
import sources from './sources.json'; 

interface ApiSource {
  uf: string,
  url: string,
  type?: any
}

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

interface InsertedData {
  uf: string,
  confirmed: number,
  deaths: number,
  recovered: number
}

const getData = async () => {
  const scrapableSources: ScrapableSource[] = sources.filter(s => s.type === 'scrapable');
  const apiSources: ApiSource[] = sources.filter(s => s.type === 'api');

  const apiData = await getDataFromApi(apiSources);
  const scrapableData = await getDataFromScrapping(scrapableSources);

  const insertedData = [...apiData, ...scrapableData ];

  return calculateTotalData(insertedData);
}

const calculateTotalData = async (insertedData: InsertedData[]) => {
  let lastSum = await knex('data')
  .select('confirmed', 'deaths', 'recovered')
  .where('uf', '=', 'BR')
  .orderBy('id', 'desc')
  .first();

  if(!lastSum) {
    lastSum = {
      confirmed: 0,
      deaths: 0,
      recovered: 0
    }
  }

  const confirmed = (insertedData
  .map(i => i.confirmed)
  .reduce((a, b) => a + b, 0)) + lastSum.confirmed;

  const deaths = (insertedData
  .map(i => i.deaths)
  .reduce((a, b) => a + b, 0)) + lastSum.deaths;

  const recovered = (insertedData
  .map(i => i.recovered)
  .reduce((a, b) => a + b, 0)) + lastSum.recovered;

  const totalSum = {
    uf: 'BR',
    confirmed: Number(confirmed),
    deaths: Number(deaths),
    recovered: Number(recovered),
    created: moment().format('YYYY-MM-DD HH:mm:ss')
  }
  
  const trx = await knex.transaction();
  await trx('data').insert(totalSum);
  await trx.commit();

  console.log(`[${moment().format('x')}] ✅ Total numbers calculated!`);
}

const getDataFromApi = async (apiSources: ApiSource[]) => {
  console.log(`[${moment().format('x')}] 🚀 Scraping from APIs started!`);

  let insertedData = new Array();

  await Promise.all(apiSources.map(async s => {
    try {
      let data = {
        confirmed: 0,
        deaths: 0,
        recovered: 0
      }
  
      switch (s.uf) {
        case 'CE':
          const confirmed = await axios.get(`${s.url}/qtd-confirmados`).then(res => res.data[0].quantidade);
          const deaths = await axios.get(`${s.url}/qtd-obitos`).then(res => res.data[0].quantidade);
          const recovered = await axios.get(`${s.url}/qtd-recuperados`).then(res => res.data[0].quantidade);
  
          data = { confirmed, deaths, recovered };
          break;
        default:
          break;
      }
  
      const parsedData = {
        uf: s.uf,
        confirmed: data.confirmed,
        deaths: data.deaths,
        recovered: data.recovered,
        created: moment().format('YYYY-MM-DD HH:mm:ss')
      }
  
      insertedData.push(parsedData);
  
      const trx = await knex.transaction();
      await trx('data').insert(parsedData);
      await trx.commit();
    } catch (error) {
      console.log(`[${moment().format('x')}] ❌ Error of ${s.uf}: ${error}`);
    }
  }));

  console.log(`[${moment().format('x')}] ✅ Scraping from API is concluded!`);

  return insertedData;
}

const getDataFromScrapping = async (scrapableSources: ScrapableSource[]) => {
    console.log(`[${moment().format('x')}] 🚀 Scraping from websites started!`);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

    let insertedData = new Array();

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
        await page.close();

        const $ = cheerio.load(content);

        const confirmed = $(s.scraping?.confirmed)[0];
        const deaths = $(s.scraping?.deaths)[0];
        const recovered = $(s.scraping?.recovered)[0];

        const data = {
          confirmed: $(confirmed).text().trim().replace(/(\r\n|\n|\r)/gm, '').split(' ')[0],
          deaths: $(deaths).text().trim().replace(/(\r\n|\n|\r)/gm, '').split(' ')[0],
          recovered: $(recovered).text().trim().replace(/(\r\n|\n|\r)/gm, '').split(' ')[0]
        }

        const parsedData = {
          uf: s.uf,
          confirmed: (data.confirmed && String(data.confirmed) != '0') ? Number(data.confirmed?.replace(/\./g, '')) : null,
          deaths: (data.deaths && String(data.confirmed) != '0') ? Number(data.deaths?.replace(/\./g, '')) : null,
          recovered: (data.recovered && String(data.confirmed) != '0') ? Number(data.recovered?.replace(/\./g, '')) : null,
          created: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        insertedData.push(parsedData);

        const trx = await knex.transaction();
        await trx('data').insert(parsedData);
        await trx.commit();

      } catch (error) {
        console.log(`[${moment().format('x')}] ❌ Error of ${s.uf}: ${error}`);
      }
    }

    await browser.close();

    console.log(`[${moment().format('x')}] ✅ Scraping from websites is concluded!`);

    return insertedData;
}

export default getData;
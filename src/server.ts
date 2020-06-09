import express from 'express';
import moment from 'moment';

import routes from './routes';
import scheduleScrapper from './scheduler';

const app = express();

app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`[${moment().format('x')}] ✅ API is loaded!`);

    scheduleScrapper().then(() => console.log(`[${moment().format('x')}] ✅ Scrapper is scheduled!`));
});
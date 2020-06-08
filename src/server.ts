import express from 'express';
import routes from './routes';

import './scheduler';

const app = express();

app.use(express.json());
app.use(routes);

app.listen(3333 || process.env.PORT, () => {
    console.log(`[Success] API is successfuly loaded!`);
});

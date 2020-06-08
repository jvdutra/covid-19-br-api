import express from 'express';
import routes from './routes';

import './scheduler';

const app = express();

app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`[Success] API is successfuly loaded!`);
});

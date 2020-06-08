import express from 'express';
import CovidController from './controllers/CovidController';

const routes = express.Router();

const covidController = new CovidController();

routes.get('/get', covidController.index);
routes.get('/get/:uf', covidController.show);

export default routes;
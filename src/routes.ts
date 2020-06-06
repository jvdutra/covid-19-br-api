import express from 'express';
import CovidController from './controllers/CovidController';

const routes = express.Router();

const covidController = new CovidController();

routes.get('/covid', covidController.index);
routes.get('/covid/:uf', covidController.show);

export default routes;
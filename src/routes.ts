import express, { Request, Response } from 'express';
import CovidController from './controllers/CovidController';

const routes = express.Router();

const covidController = new CovidController();

routes.get('/', (request: Request, response: Response) => {
    return response.json({
        success: true,
        message: 'Index page! Go to /get'
    });
});

routes.get('/get', covidController.index);
routes.get('/get/:uf', covidController.show);

export default routes;
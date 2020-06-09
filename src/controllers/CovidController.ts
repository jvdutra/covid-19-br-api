import { Request, Response } from 'express';
import moment from 'moment';
import { tz } from 'moment-timezone';

import knex from '../database/connection';
import sources from '../scrapper/sources.json';

class CovidController {
    async index(request: Request, response: Response) {
        const currentDay = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
        const beforeDay = moment().tz('America/Sao_Paulo').subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');

        const total = await knex('data')
        .where('created', '>=', beforeDay)
        .where('created', '<', currentDay)
        .andWhere('uf', '=', 'BR')
        .select('confirmed', 'deaths', 'recovered', 'created')
        .first();

        const states = await knex('data')
        .where('created', '>=', beforeDay)
        .where('created', '<', currentDay)
        .andWhere('uf', '!=', 'BR')
        .select('uf', 'confirmed', 'deaths', 'recovered', 'created')
        .orderBy('uf', 'ASC');

        const parsedData = {
            total,
            states
        }

        return response.json(parsedData);
    }

    async show(request: Request, response: Response) {
        const { uf } = request.params;

        const validUfs = sources.map(s => s.uf);

        if(!validUfs.includes(uf)) {
            return response.status(400).json({
                status: 400,
                type: 'error_invalid_uf',
                message: 'UF entered is not valid'
            });
        }

        const total = await knex('data')
        .where('uf', '=', uf)
        .select('confirmed', 'deaths', 'recovered', 'created')
        .orderBy('created', 'desc');

        if(!total.length) {
            return response.status(404).json({
                status: 404,
                type: 'error_uf_is_not_registered',
                message: 'This UF does not have records registered'
            });
        }

        return response.json(total);
    }
}

export default CovidController;
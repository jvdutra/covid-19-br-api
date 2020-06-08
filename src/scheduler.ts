import schedule from 'node-schedule';
import scrapper from './scrapper/index';

schedule.scheduleJob({hour: 22, minute: 0o0}, scrapper);
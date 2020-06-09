import schedule from 'node-schedule';
import scrapper from './scrapper/index';

const scheduleScrapper = async () => {
    return schedule.scheduleJob({ hour: 22, minute: 0o0 }, scrapper);
}

export default scheduleScrapper;
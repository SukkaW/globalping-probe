import config from 'config';
import process from 'node:process';
import { scopedLogger } from './logger.js';
import { randomInt } from 'node:crypto';

const logger = scopedLogger('health-restart');
const uptimeConfig = config.get<{interval: number; maxDeviation: number; maxUptime: number}>('uptime');
const uptimeInterval = uptimeConfig.interval + randomInt(0, uptimeConfig.maxDeviation);

const checkUptime = () => {
	const uptime = process.uptime();

	if (uptime >= uptimeConfig.maxUptime) {
		logger.info('Scheduled Probe restart. Sending SIGTERM.', { maxUptime: uptimeConfig.maxUptime });
		process.kill(process.pid, 'SIGTERM');
	}
};

setInterval(checkUptime, uptimeInterval * 1000);

import { URLFileHandler } from "./fileio";
import { logger } from '../logging_cfg';

logger.log('info', 'Starting program');
logger.log('debug', 'Reading from file: ' + process.argv[2]);

URLFileHandler(process.argv[2]);
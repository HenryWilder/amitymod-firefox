import { Logger } from '../utility.js';

const logger = new Logger('background/brace-highlight');
logger.log('test');

export const updateBracedToColored = async () => {
    await browser.scripting.updateContentScripts([]);
};

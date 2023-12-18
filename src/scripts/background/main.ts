import { Logger } from '../utility.js';
import { refreshStoredSettings } from './settings.js';
import { updateRestyle } from './restyle.js';
import {} from './brace-highlight.js';
import {} from './bat-verification.js';

const logger = new Logger('background/main', { color: 'orange' });
logger.log('test');

await refreshStoredSettings();

/**
 * Refreshes stored settings updates all scripts
 */
const updateSettings = async () => {
    logger.log('updating settings');
    try {
        await refreshStoredSettings(); // Must complete fully before moving on
        const restylePromise = updateRestyle();
        await Promise.all([restylePromise]);
    } catch (err: any) {
        logger.error(err);
    }
};

await updateSettings(); // On script initialization

/**
 * On settings update
 */
browser.runtime.onConnect.addListener((port) => {
    logger.log('"onConnect" fired');
    port.onMessage.addListener(async (msg: any) => {
        logger.log('"onMessage" fired');
        logger.debug('received msg:', msg);
        if (msg.action === 'update settings') {
            await updateSettings();
        }
    });
});

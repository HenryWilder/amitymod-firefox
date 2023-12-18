import { Logger } from '../utility.js';

const logger = new Logger('background/settings', { color: 'cyan' });
logger.log('test');

/**
 * Cached copy of settings
 */
export const storedSettings: { [key: string]: { value: any; dirty: boolean } } = {};

/**
 * Update service worker's cached copy of extension settings
 */
export const refreshStoredSettings = async () => {
    try {
        logger.group('refreshing settings');
        const data = await browser.storage.sync.get();
        const changeInfo: { [key: string]: { value: any; valuePrev: any; dirty: boolean } } = {};
        for (const key in data) {
            try {
                const value = data[key];
                const valuePrev = storedSettings[key]?.value;
                const dirty = value !== valuePrev;
                changeInfo[key] = { value, valuePrev, dirty };
                storedSettings[key] = { value, dirty };
            } catch (err: any) {
                logger.error(err);
            }
        }
        logger.table(changeInfo);
    } catch (err: any) {
        logger.error(err);
    } finally {
        logger.groupEnd();
    }
};

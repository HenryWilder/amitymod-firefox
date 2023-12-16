import { Logger } from '../utility.js';

const logger = new Logger('background/settings');
logger.log('test');

/**
 * Cached copy of settings
 */
export const storedSettings: { [key: string]: any } = {};

/**
 * Update service worker's cached copy of extension settings
 */
export const refreshStoredSettings = async () => {
    console.log('background: refreshing settings');
    const data = await browser.storage.sync.get();
    for (const key in data) {
        storedSettings[key] = data[key];
    }
};

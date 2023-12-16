import { isDefined, Logger } from '../utility.js';
import { refreshStoredSettings } from './settings.js';
import { debugContentScripts } from './restyle.js';
import { updateBracedToColored } from './brace-highlight.js';
import {} from './bat-verification.js';

const logger = new Logger('background/main', 'orange');
logger.log('test');

await refreshStoredSettings();

/**
 * Refreshes stored settings updates all scripts
 */
const updateSettings = async () => {
    console.log('background: updating settings');
    try {
        await refreshStoredSettings();
        await Promise.all([updateAllScripts(), updateBracedToColored()]);
    } catch (err: any) {
        console.error('background:', err);
    }
    debugContentScripts();
};

/**
 * First time
 */
browser.runtime.onInstalled.addListener(async () => await updateSettings());

/**
 * On settings update
 */
browser.runtime.onConnect.addListener((port) => {
    console.log('background: "onConnect" fired');
    port.onMessage.addListener(async (msg: any) => {
        console.log('background: "onMessage" fired');
        if (msg.action === 'update settings') {
            console.log('background: "update settings" received');
            await updateSettings();
        }
    });
});

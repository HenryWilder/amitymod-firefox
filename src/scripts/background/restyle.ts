import { Logger } from '../utility.js';
import { storedSettings } from './settings.js';

const logger = new Logger('background/restyle');
logger.log('test');

interface ContentStyleData {
    matches: string[];
    cssFile: string;
    displayName: string;
}

/** Mapping of settings to the associated content script info */
const CONTENT_STYLE_DATA: { [id: string]: ContentStyleData } = await (await fetch('/content-style-data.json')).json();
/** Stylesheets used by all content scripts */
const SHARED_STYLES = ['styles/vars.css', 'styles/shared/theme-colors.css', 'styles/shared/monaco-colors.css'];

const debugContentScripts = () => {
    browser.scripting.getRegisteredContentScripts().then((list) => logger.debug('debugging content scripts:', list));
};

const genRestyleContentScript = (id: string): browser.scripting._UpdateContentScriptsScripts | undefined => {
    if (!(id in CONTENT_STYLE_DATA)) {
        logger.warn(`id "${id}" does not exist in CONTENT_STYLE_DATA`);
        return;
    }
    const { matches, cssFile } = CONTENT_STYLE_DATA[id];
    const css = [...SHARED_STYLES, `content-styles/${cssFile}.css`];
    return { id, matches, css };
};

export const updateRestyle = async () => {
    logger.log('updating content scripts');
    try {
        const registeredScriptsPromise = browser.scripting.getRegisteredContentScripts();

        const dirtySettings: [string, any][] = Object.entries(storedSettings)
            .filter(([_, { dirty }]) => dirty)
            .map(([key, { value }]) => [key, value]);

        const registeredScripts = await registeredScriptsPromise;

        const registerList: browser.scripting.RegisteredContentScript[] = [];
        for (const [id, enable] of dirtySettings) {
            // Only register scripts that want to be enabled and are unregistered.
            if (enable || !registeredScripts.some((registered) => registered.id === id)) {
                const contentScript = genRestyleContentScript(id);
                contentScript && registerList.push(contentScript);
            }
        }
        logger.debug('registering content scripts:', registerList);
        const registerPromise = browser.scripting.registerContentScripts(registerList);

        const unregisterFilter: browser.scripting.ContentScriptFilter = { ids: [] };
        for (const [id, enable] of dirtySettings) {
            // Only unregister scripts that want to be disabled and are registered.
            if (!enable && registeredScripts.some((registered) => registered.id === id)) {
                unregisterFilter.ids!.push(id);
            }
        }
        logger.debug('unregistering content scripts:', unregisterFilter.ids);
        const unregisterPromise = browser.scripting.unregisterContentScripts(unregisterFilter);

        await Promise.all([registerPromise, unregisterPromise]);
    } catch (err: any) {
        logger.error(err);
    }
    debugContentScripts();
};

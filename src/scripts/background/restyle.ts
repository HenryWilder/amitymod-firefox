import { Logger } from '../utility.js';

const logger = new Logger('background/restyle');
logger.log('test');

interface ContentStyleData {
    matches: string[];
    cssFile: string;
    displayName: string;
}

/**
 * Mapping of settings to the associated content script info
 */
export const CONTENT_STYLE_DATA: { [id: string]: ContentStyleData } = await (await fetch('/content-style-data.json')).json();

export const debugContentScripts = () => {
    browser.scripting.getRegisteredContentScripts().then((list) => console.debug('background: debugging content scripts:', list));
};

/**
 * Generates an updated content script
 * @param id The id of the content script to generate.
 * @param enable Whether or not the content script should be enabled.
 * @returns Object to place into an array being passed to {@linkcode browser.scripting.updateContentScripts|updateContentScripts}.
 */
const genContentScript = (id: string, enable: boolean) => {
    if (!(id in CONTENT_STYLE_DATA)) {
        console.warn(`background: id "${id}" does not exist in CONTENT_STYLE_DATA`);
        return;
    }
    const { matches, cssFile } = CONTENT_STYLE_DATA[id];
    const css = enable
        ? ['styles/vars.css', 'styles/shared/theme-colors.css', 'styles/shared/monaco-colors.css', `content-styles/${cssFile}.css`]
        : ['styles/vars.css'];
    const contentScript: browser.scripting._UpdateContentScriptsScripts = {
        id: id,
        matches: matches,
        css: css,
        runAt: 'document_start',
        allFrames: true,
    };
    console.debug('background: generated script update:', contentScript);
    return contentScript;
};

// Initialize script
await (async () => {
    console.log('background: registering content scripts');
    const registerList = Object.keys(CONTENT_STYLE_DATA)
        .map((key) => genContentScript(key, true))
        .filter(isDefined);
    await browser.scripting.registerContentScripts(registerList);
})();

debugContentScripts();

/**
 * Updates for all items in {@linkcode storedSettings}
 */
const updateAllScripts = async () => {
    console.log('background: updating content scripts');
    try {
        const updateList = Object.entries(storedSettings)
            .map(([key, val]) => genContentScript(key, val))
            .filter(isDefined);
        await browser.scripting.updateContentScripts(updateList);
    } catch (err: any) {
        console.error('background:', err);
    }
};

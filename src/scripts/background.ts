export {};

/**
 * Mapping of settings to the associated content script info
 */
const CONTENT_STYLE_DATA: { [id: string]: { matches: string[]; cssFile: string } } = {
    developer_mozilla: { matches: ['*://developer.mozilla.org/*'], cssFile: 'developer.mozilla' },
};

const isDefined = <T>(x: T | undefined): x is T => x !== undefined;

/**
 * Cached copy of settings
 */
let storedSettings: { [key: string]: any };

/**
 * Update service worker's cached copy of extension settings
 */
const refreshStoredSettings = async () => {
    console.log('background: refreshing settings');
    await browser.storage.sync.get().then((data) => (storedSettings = data));
};
await refreshStoredSettings();

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
    const css = enable ? ['styles/vars.css', `content-styles/${cssFile}.css`] : ['styles/vars.css'];
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

const debugContentScripts = () => {
    browser.scripting.getRegisteredContentScripts().then((list) => console.debug('background: debugging content scripts:', list));
};
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

/**
 * Refreshes stored settings updates all scripts
 */
const updateSettings = async () => {
    console.log('background: updating settings');
    try {
        await refreshStoredSettings();
        await updateAllScripts();
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

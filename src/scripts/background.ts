// Bindings from settings to CSS stylesheet names
const contentStyles: { [key: string]: string } = {
    'enable-developer_mozilla': 'developer.mozilla',
};

let storedSettings: { [key: string]: any };

// Inject or remove the CSS from the provided tab, depending on the cached settings
const updateInjection = async (tabId: number) => {
    for (const key in storedSettings) {
        if (!(key in contentStyles)) continue;
        const enabled: boolean = storedSettings[key];
        const cssFile: string = contentStyles[key];
        const injection: browser.scripting.CSSInjection = { target: { tabId }, files: ['styles/vars.css', `content-styles/${cssFile}.css`] };
        const { toggleCSS, actionName } = enabled
            ? { toggleCSS: browser.scripting.insertCSS, actionName: 'insert' }
            : { toggleCSS: browser.scripting.removeCSS, actionName: 'remove' };
        (async () => {
            await toggleCSS(injection).catch((err: any) => console.error(`failed to ${actionName} CSS: ${err}`));
        })();
    }
};

// Call `updateInjection` for all tabs we have permission for
const updateInjection_AllTabs = async () => {
    const tabs = await browser.tabs.query({ url: '*://developer.mozilla.org/*' });
    for (const tab of tabs) {
        updateInjection(tab.id!);
    }
};

// Update service worker's cached copy of extension settings
const refreshStoredSettings = async () => {
    await browser.storage.sync.get().then((data) => (storedSettings = data));
};

// Refresh stored settings and inject to all active tabs
const updateSettings = async () => {
    await refreshStoredSettings();
    await updateInjection_AllTabs();
};

// On settings update
browser.runtime.onConnect.addListener((port) => {
    console.log('refreshing settings');
    port.onMessage.addListener(async (msg: any) => {
        const { action } = msg;
        if (action === 'update settings') {
            await updateSettings();
        }
    });
});

// On page commit
browser.webNavigation.onCommitted.addListener((details) => {
    console.log('web navigation committed');
    if (details.frameId === 0) {
        updateInjection(details.tabId).catch(console.error);
    }
});

// First time
browser.runtime.onInstalled.addListener(async () => await updateSettings());

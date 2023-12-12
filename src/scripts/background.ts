import { settings } from './settings.js';

const toggleCSS = (target: browser.scripting.InjectionTarget, files: string[], value: boolean) => {
    const injection: browser.scripting.CSSInjection = { target, files };
    if (value) {
        browser.scripting.insertCSS(injection);
    } else {
        browser.scripting.removeCSS(injection);
    }
};

const getTarget = async (): Promise<browser.scripting.InjectionTarget> => {
    const tabs: browser.tabs.Tab[] = await browser.tabs.query({ active: true, currentWindow: true });
    const activeTab: browser.tabs.Tab = tabs[0];
    if (activeTab.id === undefined) throw new Error('Tab id is undefined');
    return { tabId: activeTab.id };
};

const updateCSSInjection = async (enabledKey: string, files: string[]): Promise<void> => {
    const [target, enabledSet] = await Promise.all([getTarget(), browser.storage.sync.get(enabledKey)]);
    toggleCSS(target, files, enabledSet[enabledKey]);
};

const sharedCSS: string[] = ['styles/vars.css'];
updateCSSInjection(settings.enableDeveloperMozilla, [...sharedCSS, 'content-styles/developer.mozilla.css']);

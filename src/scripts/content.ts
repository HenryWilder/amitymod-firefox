const settings = {
    enableDeveloperMozilla: 'enable-developer_mozilla',
};

const toggleCSS = (tab: browser.tabs.Tab, file: string, value: boolean) => {
    if (tab.id !== undefined) {
        const injection: browser.extensionTypes.InjectDetails = { file };
        if (value) browser.tabs.insertCSS(tab.id, injection);
        else browser.tabs.removeCSS(tab.id, injection);
    }
};

browser.tabs.query({ active: true, currentWindow: true }).then((tabs: browser.tabs.Tab[]) => {
    const activeTab: browser.tabs.Tab = tabs[0];
    const file = 'content-styles/developer.mozilla.css';
    const settingKey = settings.enableDeveloperMozilla;
    browser.storage.sync.get(settingKey).then((items) => toggleCSS(activeTab, file, items[settingKey]));
});

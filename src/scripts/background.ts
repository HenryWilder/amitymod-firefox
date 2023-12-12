const contentStyles: { [setting: string]: string } = {
    'enable-developer_mozilla': 'developer.mozilla',
};

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

const updateCSSInjection = async (enabled: boolean, files: string[]): Promise<void> => {
    const target = await getTarget();
    toggleCSS(target, files, enabled);
};

const sharedCSS: string[] = ['styles/vars.css'];

browser.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((msg: any) => {
        const { action, values } = msg;
        if (action === 'update css') {
            console.debug(`[ WORKER ] Received message:`, msg);
            for (const key in values) {
                let cssFile: string = contentStyles[key];
                updateCSSInjection(values[key], ['styles/vars.css', 'content-styles/' + cssFile + '.css']);
            }
        }
    });
});

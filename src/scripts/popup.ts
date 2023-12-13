const settingInputs: { [key: string]: any[] } = {
    checkboxes: Array.from(document.querySelectorAll('input[type=checkbox][data-setting]')) as (HTMLInputElement & { type: 'checkbox' })[],
};
console.debug(settingInputs);

const saveButton = document.getElementById('save-button') as HTMLButtonElement | null;

if (saveButton === null) {
    throw new Error('popup: critical element missing: HTMLButtonElement, id "save-button"');
}

const loadSettings = async () => {
    console.log('popup: loading settings');
    try {
        const items = await browser.storage.sync.get();
        for (const inp of settingInputs.checkboxes) {
            console.debug('popup: loading setting for', inp);
            const settingName: string = inp.dataset.setting!;
            inp.checked = items[settingName];
        }
    } catch (err: any) {
        console.error('popup:', err);
    }
};

const saveSettings = () => {
    console.log('popup: saving settings');
    try {
        const items: { [key: string]: any } = {};
        for (const inp of settingInputs.checkboxes) {
            console.debug('popup: saving setting for', inp);
            const settingName: string = inp.dataset.setting!;
            items[settingName] = inp.checked;
        }
        browser.storage.sync.set(items);
        console.log('popup: posting "update settings" message');
        try {
            port.postMessage({ action: 'update settings' });
        } catch (err: any) {
            console.error('popup:', err);
        }
    } catch (err: any) {
        console.error('popup:', err);
    }
};

console.log('popup: connecting to "background-port"');
const port = browser.runtime.connect({ name: 'background-port' });
loadSettings();
saveButton.addEventListener('click', saveSettings);

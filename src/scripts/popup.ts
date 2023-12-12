const settingInputs: { [key: string]: any[] } = {
    checkboxes: Array.from(document.querySelectorAll('input[type=checkbox][data-setting]')) as (HTMLInputElement & { type: 'checkbox' })[],
};
const saveButton = document.getElementById('save-button') as HTMLButtonElement | null;

if (saveButton === null) throw new Error('Critical element missing: Save button');

// for (const categoryName in settingInputs) {
//     console.group(categoryName);
//     const category = settingInputs[categoryName];
//     for (const input of category) {
//         console.log(input);
//     }
//     console.groupEnd();
// }

const loadSettings = async () => {
    console.log('Loading settings...');
    const items = await browser.storage.sync.get();
    for (const inp of settingInputs.checkboxes) {
        const settingName: string = inp.dataset.setting!;
        inp.checked = items[settingName];
    }
    console.log('Settings loaded.');
};

const saveSettings = () => {
    console.log('Saving settings...');
    const items: { [key: string]: any } = {};
    for (const inp of settingInputs.checkboxes) {
        const settingName: string = inp.dataset.setting!;
        items[settingName] = inp.checked;
    }
    browser.storage.sync.set(items);
    console.log('Settings saved.');
    port.postMessage({ action: 'update css', values: items });
};

const port = browser.runtime.connect({ name: 'background-port' });
loadSettings();
saveButton.addEventListener('click', saveSettings);

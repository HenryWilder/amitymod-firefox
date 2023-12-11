console.log('hello world');

const settingInputs: { [key: string]: any[] } = {
    checkboxes: Array.from(document.querySelectorAll('input[type=checkbox]')) as (HTMLInputElement & { type: 'checkbox' })[],
};
const saveButton = document.getElementById('save-button') as HTMLButtonElement | null;

if (saveButton === null) throw new Error('Critical element missing: Save button');

for (const categoryName in settingInputs) {
    console.group(categoryName);
    const category = settingInputs[categoryName];
    for (const input of category) {
        console.log(input);
    }
    console.groupEnd();
}

const loadSettings = async () => {
    const items = await browser.storage.sync.get();
    for (const inp of settingInputs.checkboxes) {
        const settingName: string = inp.dataset.setting!;
        console.log(settingName);
        console.log(items[settingName]);
        inp.checked = items[settingName];
    }
};

const saveSettings = () => {
    const items: { [key: string]: any } = {};
    for (const inp of settingInputs.checkboxes) {
        const settingName: string = inp.dataset.setting!;
        console.log(settingName);
        items[settingName] = inp.checked;
        console.log(items[settingName]);
    }
    browser.storage.sync.set(items);
};

loadSettings();
saveButton.addEventListener('click', saveSettings);

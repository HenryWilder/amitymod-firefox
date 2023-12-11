const isModActiveInput = document.getElementById('is-mod-active-button') as HTMLButtonElement | null;
const saveButton = document.getElementById('save-button') as HTMLButtonElement | null;

if (isModActiveInput === null || saveButton === null) throw new Error('Critical element missing');

isModActiveInput.addEventListener('click', () => {
    isModActiveInput.classList.toggle('secondary', !isModActiveInput.classList.toggle('primary'));
    setModActive(isModActiveInput.classList.contains('primary'));
});

let isModActive: any;

export const loadSettings = async () => {
    const result = await browser.storage.sync.get('is-mod-active');
    isModActive = result['is-mod-active'];
    isModActiveInput.classList.toggle('secondary', !isModActiveInput.classList.toggle('primary', isModActive));
};

export const saveSettings = () => {
    browser.storage.sync.set({ 'is-mod-active': isModActive });
};

export const setModActive = (value: any) => (isModActive = value);

document.addEventListener('DOMContentLoaded', loadSettings);
saveButton.addEventListener('click', saveSettings);

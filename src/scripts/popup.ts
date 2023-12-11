let isModActive: any;

export const loadSettings = async () => {
    isModActive = await browser.storage.sync.get('is-mod-active');
    toggleButtonState(isModActiveInput, isModActive);
};

export const saveSettings = () => {
    browser.storage.sync.set({ 'is-mod-active': isModActive });
};

export const setModActive = (value: any) => (isModActive = value);

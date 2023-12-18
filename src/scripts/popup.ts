import { Logger, assertive, HTMLInput } from './utility.js';
import { updateAccentColor, updateBackgroundColor, type ThemeColors } from './content/theme-colors.js';

const logger = new Logger('popup', { color: 'yellow' });

const settingInputs = {
    checkboxes: assertive.querySelectorAll<HTMLInput.CheckboxElement>('input[type=checkbox][data-setting]'),
    accentColor: {
        h: assertive.querySelector<HTMLInputElement>(`[data-setting="accent-h"]`),
        s: assertive.querySelector<HTMLInputElement>(`[data-setting="accent-s"]`),
        l: assertive.querySelector<HTMLInputElement>(`[data-setting="accent-l"]`),
    },
    backgroundColor: {
        h: assertive.querySelector<HTMLInputElement>(`[data-setting="background-h"]`),
        s: assertive.querySelector<HTMLInputElement>(`[data-setting="background-s"]`),
    },
};

const saveButton = assertive.getElementById<HTMLButtonElement>('save-button');

logger.debug(settingInputs);

const updateAccentColorProperty = () => {
    const { h, s, l } = settingInputs.accentColor;
    updateAccentColor(h.value, s.value, l.value);
};
const updateBackgroundColorProperty = () => {
    const { h, s } = settingInputs.backgroundColor;
    updateBackgroundColor(h.value, s.value);
};

// Add listeners
for (const element of Object.values(settingInputs.accentColor)) {
    element.addEventListener('input', updateAccentColorProperty);
}
for (const element of Object.values(settingInputs.backgroundColor)) {
    element.addEventListener('input', updateBackgroundColorProperty);
}

const loadSettings = async () => {
    logger.log('loading settings');
    try {
        const items = await browser.storage.sync.get();
        for (const inp of settingInputs.checkboxes) {
            logger.debug('loading setting for', inp);
            const settingName: string = inp.dataset.setting!;
            inp.checked = items[settingName];
        }
    } catch (err: any) {
        logger.error(err);
    }
};

const saveSettings = () => {
    logger.log('saving settings');
    try {
        const items: { [key: string]: any } = {};
        for (const inp of settingInputs.checkboxes) {
            logger.debug('saving setting for', inp);
            const settingName: string = inp.dataset.setting!;
            items[settingName] = inp.checked;
        }
        browser.storage.sync.set(items);
        logger.log('posting "update settings" message');
        try {
            port.postMessage({ action: 'update settings' });
        } catch (err: any) {
            logger.error(err);
        }
    } catch (err: any) {
        logger.error(err);
    }
};

logger.log('connecting to "background-port"');
const port = browser.runtime.connect({ name: 'background-port' });
loadSettings();
saveButton.addEventListener('click', saveSettings);

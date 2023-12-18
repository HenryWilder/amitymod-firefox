export const updateAccentColor = (h: number | string, s: number | string, l: number | string) => {
    document.documentElement.style.setProperty('--accent-color-hsl', `${h} ${s}% ${l}%`);
};

export const updateBackgroundColor = (h: number | string, s: number | string) => {
    document.documentElement.style.setProperty('--background-color-l-hsl', `${h} ${s}% 84%`);
    document.documentElement.style.setProperty('--background-color-d-hsl', `${h} ${s}% 16%`);
};

export interface ThemeColors {
    accent: { h: number; s: number; l: number };
    background: { h: number; s: number };
}

const updateThemeFromStorage = async () => {
    const { accent, background } = (await browser.storage.sync.get('theme-colors')) as ThemeColors;
    updateAccentColor(accent.h, accent.s, accent.l);
    updateBackgroundColor(background.h, background.s);
};

updateThemeFromStorage();

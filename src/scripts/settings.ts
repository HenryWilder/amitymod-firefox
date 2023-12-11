export interface Settings {
    [key: string]: any;
}

const settings: Settings = {};

export const get = (key: string): any => {
    return settings[key];
};

export const set = (key: string, value: any) => {
    settings[key] = value;
};

export const getAll = (): Settings => {
    return settings;
};

export const setAll = (data: Settings) => {
    for (const key in data) {
        settings[key] = data[key];
    }
};

export namespace Names {
    export const enableDeveloperMozilla: string = 'enable-developer_mozilla';
}

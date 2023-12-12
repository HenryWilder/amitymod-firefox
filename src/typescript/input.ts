type Dataset = { [key: string]: any };

export interface InputProps {
    id?: string;
    label?: string;
    dataset?: Dataset;
}

export const dataAttr = (dataset?: Dataset): Dataset | undefined => {
    if (dataset !== undefined) {
        return Object.fromEntries(Object.entries(dataset).map((entry) => ['data-' + entry[0], entry[1]]));
    }
};

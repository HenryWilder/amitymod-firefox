export interface InputProps {
    id?: string;
    label?: string;
}

/**
 * Toggles a button to either primary or secondary
 *
 * `true` = primary; `false` = secondary
 *
 * @returns the value that the button is now.
 */
export const toggleButtonState = (btn: HTMLButtonElement, state?: boolean | 'primary' | 'secondary'): boolean => {
    const value: boolean | undefined = state !== undefined ? state === true || state === 'primary' : undefined;
    const isPrimary: boolean = btn.classList.toggle('primary', value);
    btn.classList.toggle('secondary', !isPrimary);
    return isPrimary;
};

export const getCriticalElementById = <T>(id: string): T => {
    const element: T | null = document.getElementById(id) as T | null;
    if (element === null) throw new Error(`Critical UI element not found: '${id}'`);
    return element;
};

type ColorString = string;
export const isColorString = (str: string): str is ColorString => {
    const rx = /^(?:#[A-F0-9]{3}[A-F0-9]{3}?|(?:rgb|hsl)\(\d+(?:\.\d+)?%?,?\s+\d+(?:\.\d+)?%?,?\s+\d+(?:\.\d+)?%?\)|[A-Z]{3,})$/i;
    return str.match(rx) !== null;
};

type CSSUnit = `${number}${'%' | 'em' | 'ex' | 'ch' | 'rem' | 'vw' | 'vh' | 'px' | 'pt' | 'pc' | 'mm' | 'cm' | 'in'}`;

export interface LoggerStyle {
    color?: ColorString;
    backgroundColor?: ColorString;
    fontWeight?: 'lighter' | 'light' | 'normal' | 'bold' | 'bolder' | number;
    fontSize?: CSSUnit;
    fontStyle?: 'normal' | 'italic' | 'oblique';
    textDecoration?: 'none' | 'underline' | 'overline' | 'line-through' | 'initial' | 'inherit';
    lineHeight?: CSSUnit;
    [key: string]: any | undefined;
}

export const styleStr = (style: LoggerStyle): string =>
    Object.entries(style)
        .map(([key, _]) => key.replace(/([A-Z])/g, '-$1').toLowerCase())
        .map(([key, value]) => `${key}:${value}`)
        .join(';');

export class Logger implements Console {
    private context: [string, string];

    constructor(context: string, style: LoggerStyle = { color: 'magenta' }) {
        this.context = [`%c${context}:`, styleStr(style)];
    }

    /** @inheritdoc Adds context */
    assert(condition?: boolean, ...data: any[]): void {
        console.assert(condition, ...this.context, ...data);
    }
    clear(): void {
        console.clear();
    }
    count(label?: string): void {
        console.count(label);
    }
    countReset(label?: string): void {
        console.countReset(label);
    }
    /** @inheritdoc Adds context */
    debug(...data: any[]): void {
        console.debug(...this.context, ...data);
    }
    dir(item?: any, options?: any): void {
        console.dir(item, options);
    }
    dirxml(...data: any[]): void {
        console.dirxml(...data);
    }
    /** @inheritdoc Adds context */
    error(...data: any[]): void {
        console.error(...this.context, ...data);
    }
    /** @inheritdoc Adds context */
    group(...data: any[]): void {
        console.group(...this.context, ...data);
    }
    /** @inheritdoc Adds context */
    groupCollapsed(...data: any[]): void {
        console.groupCollapsed(...this.context, ...data);
    }
    groupEnd(): void {
        console.groupEnd();
    }
    /** @inheritdoc Adds context */
    info(...data: any[]): void {
        console.info(...this.context, ...data);
    }
    /** @inheritdoc Adds context */
    log(...data: any[]): void {
        console.log(...this.context, ...data);
    }
    table(tabularData?: any, properties?: string[]): void {
        console.table(tabularData, properties);
    }
    time(label?: string): void {
        console.time(label);
    }
    timeEnd(label?: string): void {
        console.timeEnd(label);
    }
    timeLog(label?: string, ...data: any[]): void {
        console.timeLog(label, ...data);
    }
    timeStamp(label?: string): void {
        console.timeStamp(label);
    }
    trace(...data: any[]): void {
        console.trace(...data);
    }
    /** @inheritdoc Adds context */
    warn(...data: any[]): void {
        console.warn(...this.context, ...data);
    }
}

/**
 * Contextual `console`\
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console)
 */
const logger = new Logger('utility', { color: 'violet' });
logger.log('test');

/**
 * Checks if a value is defined (not `undefined`).
 *
 * @param x The value to check.
 * @returns A boolean indicating whether the value is defined.
 */
export const isDefined = <T>(x: T | undefined): x is T => x !== undefined;

export namespace assertive {
    /**
     * Calls {@linkcode document.getElementById} and throws an error if the result is null.
     */
    export const getElementById = <T extends HTMLElement = HTMLElement>(elementId: string): T => {
        const element = document.getElementById(elementId) as T | null;
        if (element === null) throw new Error(`missing element of id "${elementId}"`);
        return element;
    };

    /**
     * Calls {@linkcode document.querySelector} and throws an error if the result is null.
     */
    export const querySelector = <T extends Element = Element>(selectors: string): T => {
        const element = document.querySelector<T>(selectors);
        if (element === null) throw new Error(`missing element for the selector \`${selectors}\``);
        return element;
    };

    /**
     * Calls {@linkcode document.querySelectorAll} and throws an error if the result size is not within the expected range.
     * @param min The minimum number of elements to expect (inclusive).
     * @param max The maximum number of elements to expect (inclusive).
     */
    export const querySelectorAll = <T extends Element = Element>(selectors: string, min?: number, max?: number): T[] => {
        const elements = Array.from(document.querySelectorAll<T>(selectors));
        const count = elements.length;
        const hasMin = min !== undefined;
        const hasMax = max !== undefined;
        if ((hasMin && elements.length < min) || (hasMax && elements.length > max)) {
            // prettier-ignore
            const range = hasMin && hasMax
                    ? min === max // range
                        ? `exactly ${min}`            // exact
                        : `between ${min} and ${max}` // range
                    : hasMin
                        ? `a minimum of ${min}` // min
                        : `a maximum of ${max}` // max
            throw new Error(`expected the number of elements for the selector \`${selectors}\` to be ${range}; found ${count}`);
        }
        return elements;
    };
}

// prettier-ignore
export namespace HTMLInput {
    export type         RangeElement = HTMLInputElement & { type: 'range'          };
    export type      CheckboxElement = HTMLInputElement & { type: 'checkbox'       };
    export type         RadioElement = HTMLInputElement & { type: 'radio'          };
    export type         ColorElement = HTMLInputElement & { type: 'color'          };
    export type          DateElement = HTMLInputElement & { type: 'date'           };
    export type DateTimeLocalElement = HTMLInputElement & { type: 'datetime-local' };
    export type         EmailElement = HTMLInputElement & { type: 'email'          };
    export type          FileElement = HTMLInputElement & { type: 'file'           };
    export type        HiddenElement = HTMLInputElement & { type: 'hidden'         };
    export type         ImageElement = HTMLInputElement & { type: 'image'          };
    export type         MonthElement = HTMLInputElement & { type: 'month'          };
    export type        NumberElement = HTMLInputElement & { type: 'number'         };
    export type        OptionElement = HTMLInputElement & { type: 'option'         };
    export type      PasswordElement = HTMLInputElement & { type: 'password'       };
    export type        SearchElement = HTMLInputElement & { type: 'search'         };
    export type        SubmitElement = HTMLInputElement & { type: 'submit'         };
    export type           TelElement = HTMLInputElement & { type: 'tel'            };
    export type          TextElement = HTMLInputElement & { type: 'text'           };
    export type          TimeElement = HTMLInputElement & { type: 'time'           };
    export type           UrlElement = HTMLInputElement & { type: 'url'            };
    export type          WeekElement = HTMLInputElement & { type: 'week'           };
}

type ColorString = string;
export const isColorString = (str: string): str is ColorString => {
    const rx = /^(?:#[A-F0-9]{3}[A-F0-9]{3}?|(?:rgb|hsl)\(\d+(?:\.\d+)?%?,?\s+\d+(?:\.\d+)?%?,?\s+\d+(?:\.\d+)?%?\)|[A-Z]{3,})$/i;
    return str.match(rx) !== null;
};

export class Logger implements Console {
    private context: [string, string];

    constructor(context: string, color: ColorString = 'dodgerblue') {
        if (!isColorString(color)) throw new Error('Color must be a color string');
        this.context = [`%c${context}:`, `color: ${color};`];
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
const logger = new Logger('utility');
logger.log('test');

/**
 * Checks if a value is defined (not `undefined`).
 *
 * @param x The value to check.
 * @returns A boolean indicating whether the value is defined.
 */
export const isDefined = <T>(x: T | undefined): x is T => x !== undefined;

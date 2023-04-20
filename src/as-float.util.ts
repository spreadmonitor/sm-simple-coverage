/**
 * Converts a string to a floating point number.
 *
 * @param value - The string to convert to a float.
 * @param defaultValue - The default value to return if the conversion fails. Default is 0.
 * @returns - The converted float value or the default value if the conversion fails.
 *
 * @example
 * asFloat('3.14'); // returns 3.14
 * asFloat('not a number'); // returns 0
 * asFloat('not a number', 1.23); // returns 1.23
 * */
export function asFloat(value: string, defaultValue = 0): number {
    const floatValue = parseFloat(value)
    return isNaN(floatValue) ? defaultValue : floatValue;
}

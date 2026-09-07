const NUMERIC_COLOR_TOKENS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export default {
    primary: NUMERIC_COLOR_TOKENS.map(num => `--primary-${num}`),
    secondary: NUMERIC_COLOR_TOKENS.map(num => `--secondary-${num}`),
    tertiary: NUMERIC_COLOR_TOKENS.map(num => `--tertiary-${num}`),
    secondaryNeutral: NUMERIC_COLOR_TOKENS.map(num => `--secondary-neutral-${num}`),
    neutral: NUMERIC_COLOR_TOKENS.map(num => `--neutral-${num}`)
};
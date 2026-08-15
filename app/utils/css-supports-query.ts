const cssSupportsQuery = {
    d: '(d: path("M 0 0"))',
    abs: '(opacity: abs(-1))',
    shape: '(offset-path: shape(from 0% 0%, line to 100% 100%))',
    unitStripping: '(opacity: calc(100px / 1px))'
};

export default cssSupportsQuery;
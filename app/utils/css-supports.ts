const cssSupports = {
	d: typeof CSS !== 'undefined' && CSS.supports('d', 'path("M 0 0")'),
	shape: typeof CSS !== 'undefined' && CSS.supports("offset-path", "shape(from 0% 0%, line to 100% 100%)"),
};

export default cssSupports;
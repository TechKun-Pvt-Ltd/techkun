const cssSupports = {
	d: typeof CSS !== 'undefined' && CSS.supports('d', 'path("M 0 0")')
};

export default cssSupports;
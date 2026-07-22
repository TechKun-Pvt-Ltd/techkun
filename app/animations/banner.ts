const INITIAL_DELAY = 0.1;
const STRETCH_DURATION = 0.5;
const AFTER_RELEASE = INITIAL_DELAY + STRETCH_DURATION;

const BANNER_ANIMATION = {
	wordGradientFill: {
		delay: AFTER_RELEASE,
		duration: 2.725
	},
	dotsStretch: {
		delay: INITIAL_DELAY,
		duration: STRETCH_DURATION
	},
	dotsRelease: {
		delay: AFTER_RELEASE,
		duration: 2.725
	},
	initialDotsLightUp: {
		delay: AFTER_RELEASE,
		duration: 1.2
	},
	ctaBorderGradient: {
		delay: AFTER_RELEASE + 0.5,
		duration: 2.25
	},
	bgGradient: {
		delay: AFTER_RELEASE,
		duration: 2.725
	},
	precision: {
		delay: AFTER_RELEASE + 2.75
	}
};

export default BANNER_ANIMATION;
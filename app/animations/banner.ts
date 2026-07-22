const INITIAL_DELAY = 0.1;
const AFTER_RELEASE = INITIAL_DELAY + 0.5;

const BANNER_ANIMATION = {
	wordGradientFill: {
		delay: AFTER_RELEASE,
		duration: 2.75
	},
	initialDotsLightUp: {
		delay: INITIAL_DELAY,
		duration: 1.2
	},
	dotsLightUp: {
		delay: 0,
		duration: 0.8,
		stagger: 0.1
	},
	dotsLightDown: {
		delay: 0,
		duration: 0.4,
		stagger: 0
	},
	ctaBorderGradient: {
		delay: AFTER_RELEASE + 0.5,
		duration: 2.25
	},
	bgGradient: {
		delay: AFTER_RELEASE,
		duration: 2.75
	},
	precision: {
		delay: AFTER_RELEASE + 2.75
	}
};

export default BANNER_ANIMATION;
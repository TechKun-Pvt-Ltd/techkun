const INITIAL_DELAY = 0.3;

const BANNER_ANIMATION = {
	wordGradientFill: {
		delay: INITIAL_DELAY,
		duration: 2.4
	},
	initialDotsLightUp: {
		delay: INITIAL_DELAY
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
		delay: INITIAL_DELAY,
		duration: 2
	},
	bgGradient: {
		delay: 0,
		duration: 2.4
	},
	precision: {
		delay: INITIAL_DELAY + 1.6
	}
};

export default BANNER_ANIMATION;
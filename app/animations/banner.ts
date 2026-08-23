const POINTER_MOVE_DURATION = 1;
const STRETCH_DURATION = 0.5;
const PRE_RELEASE_DELAY = POINTER_MOVE_DURATION + STRETCH_DURATION;

const BANNER_ANIMATION = {
	pointerMove: {
		duration: POINTER_MOVE_DURATION
	},
	pointerMoveBack: {
		delay: PRE_RELEASE_DELAY + 0.5,
		duration: POINTER_MOVE_DURATION,
	},
	dotsPull: {
		delay: POINTER_MOVE_DURATION,
		duration: STRETCH_DURATION
	},
	dotsRelease: {
		delay: PRE_RELEASE_DELAY,
		duration: 2.725
	},
	initialDotsLightUp: {
		delay: POINTER_MOVE_DURATION,
		duration: 1.2
	},
	wordGradientFill: {
		delay: PRE_RELEASE_DELAY,
		duration: 2.725
	},
	ctaBorderGradient: {
		delay: PRE_RELEASE_DELAY + 0.5,
		duration: 2.25
	},
	bgGradient: {
		delay: PRE_RELEASE_DELAY,
		duration: 2.725
	},
	precision: {
		delay: PRE_RELEASE_DELAY + 1.5
	}
};

export default BANNER_ANIMATION;
const POINTER_MOVE_DURATION = 1;
const STRETCH_DURATION = 0.5;
const AFTER_RELEASE = POINTER_MOVE_DURATION + STRETCH_DURATION;

const BANNER_ANIMATION = {
	pointerMove: {
		duration: POINTER_MOVE_DURATION
	},
	pointerMoveBack: {
		delay: POINTER_MOVE_DURATION + STRETCH_DURATION + 0.5,
		duration: POINTER_MOVE_DURATION,
	},
	dotsStretch: {
		delay: POINTER_MOVE_DURATION,
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
	wordGradientFill: {
		delay: AFTER_RELEASE,
		duration: 2.725
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
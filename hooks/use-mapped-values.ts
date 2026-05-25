import {MotionConfigContext, useIsomorphicLayoutEffect} from "motion/react";
import {cancelFrame, frame, motionValue, MotionValue} from "motion-dom";
import {useContext, useEffect, useState} from "react";
import {useConstant} from "@/hooks/use-constant";

type MappedValues<V extends any[]> = {
	[K in keyof V]: MotionValue<V[K]>;
};

export function useMappedValues<I, const O extends any[]>(
	inputValue: MotionValue<I>,
	transformer: (input: I) => O
): MappedValues<O> {
	const computedValues = transformer(inputValue.get());
	/**
	 * Initialize the returned motion values. This remains the same between renders.
	 */
	const motionValues = useConstant(() => computedValues.map(v => motionValue(v)) as MappedValues<O>);
	if (computedValues.length !== motionValues.length)
		throw new Error("useMappedValues error: the number of mapped values cannot change.");

	const { isStatic } = useContext(MotionConfigContext)
	if (isStatic) {
		const setters = computedValues.map(v => useState(v)[1]);
		useEffect(() => {
			motionValues.forEach((v, i) => {
				v.on("change", setters[i])
			});
		}, [])
	}

	/**
	 * Create a function that will update the template motion value with the latest values.
	 * This is pre-bound so whenever a motion value updates it can schedule its
	 * execution in Framesync. If it's already been scheduled it won't be fired twice
	 * in a single frame.
	 */
	function updateValues() {
		const updatedValues = transformer(inputValue.get());
		motionValues.forEach((v, i) => v.set(updatedValues[i]));
	}

	/**
	 * Synchronously update the motion value with the latest values during the render.
	 * This ensures that within a React render, the styles applied to the DOM are up-to-date.
	 */
	updateValues();

	/**
	 * Subscribe to all motion values found within the template. Whenever any of them change,
	 * schedule an update.
	 */
	useIsomorphicLayoutEffect(() => {
		const scheduleUpdate = () => frame.preRender(updateValues, false, true)
		const unsubscribe = inputValue.on("change", scheduleUpdate);

		return () => {
			unsubscribe();
			cancelFrame(updateValues)
		}
	});

	return motionValues;
}
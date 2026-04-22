import {AnimationPlaybackControlsWithThen} from "motion";

export type AnimationsRecord<A extends string[]> = {
    [K in A[number]]: AnimationPlaybackControlsWithThen | null;
};
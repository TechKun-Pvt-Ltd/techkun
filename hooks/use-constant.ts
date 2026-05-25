import {useRef} from "react";

export function useConstant<T>(init: () => T): T {
	const ref = useRef<T>(null);
	if (ref.current === null) {
		ref.current = init();
	}
	return ref.current;
}
import {useEffect, useState} from "react";

const initialBrowserState = {
	isNone: true,
	isFirefox: false,
	isSafari: false,
	isChrome: false
};

export function useBrowser() {
	const [browser, setBrowser] = useState(initialBrowserState);

	useEffect(() => {
		const isChrome = /Chrome/.test(navigator.userAgent) &&
			!/Edg/.test(navigator.userAgent);

		const isFirefox = /Firefox/.test(navigator.userAgent);

		const isSafari = /Safari/.test(navigator.userAgent) &&
			!/Chrome/.test(navigator.userAgent);

		setBrowser({
			isNone: !(isChrome || isFirefox || isSafari),
			isChrome,
			isFirefox,
			isSafari
		});
	}, []);

	return browser;
}
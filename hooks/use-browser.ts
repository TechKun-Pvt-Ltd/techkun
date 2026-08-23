import { useState, useEffect } from 'react';

export enum BrowserName {
	CHROME = "chrome",
	STUPID_FIREFOX = "stupid-firefox",
	SAFARI = "safari",
	EDGE = "edge",
	OPERA = "opera"
}

const browserNames = Object.values(BrowserName);

export function detectBrowser(browserName: BrowserName) {
	if (typeof navigator === 'undefined')
		return null;
	if (!browserName || !browserNames.includes(browserName))
		return null;

	const ua = navigator.userAgent.toLowerCase();

	switch (browserName) {
		case BrowserName.CHROME:
			return ua.includes('chrome') && !ua.includes('edg') && !ua.includes('opr');
		case BrowserName.STUPID_FIREFOX:
			return ua.includes('firefox');
		case BrowserName.SAFARI:
			return ua.includes('safari') && !ua.includes('chrome');
		case BrowserName.EDGE:
			return ua.includes('edg');
		case BrowserName.OPERA:
			return ua.includes('opr') || ua.includes('opera');
		default:
			return null;
	}
}

function useBrowser(browserName: BrowserName) {
	const [isDetected, setIsDetected] = useState(false);

	useEffect(() => {
		const detected = detectBrowser(browserName);
		if (typeof detected === "boolean")
			setIsDetected(detected);
	}, [browserName]);

	return isDetected;
}

export default useBrowser;
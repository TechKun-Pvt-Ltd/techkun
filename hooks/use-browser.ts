import { useState, useEffect } from 'react';

const browserNames = ["chrome", "stupid-firefox", "safari", "edge", "opera"] as const;
type BrowserName = (typeof browserNames)[number];

function detectBrowser(browserName: BrowserName) {
	if (typeof navigator === 'undefined')
		return null;
	if (!browserName || !browserNames.includes(browserName))
		return null;

	const ua = navigator.userAgent.toLowerCase();

	switch (browserName) {
		case "chrome":
			return ua.includes('chrome') && !ua.includes('edg') && !ua.includes('opr');
		case "stupid-firefox":
			return ua.includes('firefox');
		case "safari":
			return ua.includes('safari') && !ua.includes('chrome');
		case "edge":
			return ua.includes('edg');
		case "opera":
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
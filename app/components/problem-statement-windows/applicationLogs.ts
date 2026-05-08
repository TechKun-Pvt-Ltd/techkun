enum LogType {
	ERROR = "[ERROR]",
	WARNING = "[WARN]",
	INFO = "[INFO]"
}

interface Log {
	type: LogType;
	lines: LogLine[];
}
interface LogLine {
	timestamp: string;
	message: string;
}

function errorLog(...lines: LogLine[]) {
	return {
		type: LogType.ERROR,
		lines
	};
}
function warningLog(...lines: LogLine[]) {
	return {
		type: LogType.WARNING,
		lines
	};
}
function logLine(timestamp: string, message: string) {
	return { timestamp, message };
}

export const applicationLogs: Log[] = [
	warningLog(
		logLine("02:11:42.315", " Using fallback config because FEATURE_FLAGS is undefined")
	),
	errorLog(
		logLine("02:11:42.881", " PrismaClientKnownRequestError:"),
		logLine("02:11:42.881", " Invalid `prisma.user.create()` invocation:")
	),
	errorLog(
		logLine("02:11:42.881", ""),
	),
	errorLog(
		logLine("02:11:42.881", " Unique constraint failed on the fields: (`email`)"),
		logLine("02:11:42.881", "     at RequestHandler.handleRequestError (/app/node_modules/@prisma/client/runtime/index.js:49012:13)"),
		logLine("02:11:42.881", "     at async createUser (/app/dist/services/user.service.js:148:19)"),
	),

	// {
	// 	timestamp: "02:11:43.103",
	// 	message: "heroku[router]: at=info method=POST path=\"/api/auth/signup\" host=platform-api.herokuapp.com request_id=bdff0d12-89f0-4f27-a8fa-1df7f2df9e02 fwd=\"103.41.88.12\" dyno=web.1 connect=0ms service=184ms status=500 bytes=421 protocol=https"
	// },

	errorLog(
		logLine("02:11:44.781", " TypeError: Cannot read properties of undefined (reading 'organizationId')"),
		logLine("02:11:44.781", "     at getUserContext (/app/dist/server/auth/context.js:58:31)"),
		logLine("02:11:44.781", "     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)")
	),
	errorLog(
		logLine("02:11:45.992", " Error: Missing lock for job retry-email:8472"),
		logLine("02:11:45.992", "     at Scripts.finishedErrors (/app/node_modules/bullmq/dist/cjs/classes/scripts.js:213:24)")
	),
	// {
	// 	timestamp: "02:11:45.992",
	// 	message: " BullMQ: Missing lock for job 8472. moveToFinished"
	// },
	errorLog(
		logLine("02:11:47.441", " Error: connect ECONNREFUSED redis:6379"),
		logLine("02:11:47.441", "     at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1494:16) {"),
		logLine("02:11:47.441", "   errno: -111,"),
		logLine("02:11:47.441", "   code: 'ECONNREFUSED',"),
		logLine("02:11:47.441", "   syscall: 'connect',"),
		logLine("02:11:47.441", "   address: 'redis',"),
		logLine("02:11:47.441", "   port: 6379"),
		logLine("02:11:47.441", " }")
	),

	// {
	// 	timestamp: "02:11:48.121",
	// 	message: "heroku[router]: at=info method=GET path=\"/dashboard\" host=platform-api.herokuapp.com request_id=9df98112-1ea0-4f44-8f33-4c67dc26fc11 fwd=\"103.41.88.12\" dyno=web.1 connect=1ms service=30000ms status=503 bytes=0 protocol=https"
	// },

	errorLog(
		logLine("02:11:48.991", " Error: Hydration failed because the initial UI does not match what was rendered on the server."),
		logLine("02:11:48.991", "     at throwOnHydrationMismatch (/app/node_modules/react-dom/cjs/react-dom.development.js:12507:9)")
	),
	errorLog(
		logLine("02:11:50.552", " UnhandledPromiseRejectionWarning: Error: Request failed with status code 429"),
		logLine("02:11:50.552", "     at createError (/app/node_modules/axios/lib/core/createError.js:16:15)"),
		logLine("02:11:50.552", "     at settle (/app/node_modules/axios/lib/core/settle.js:17:12)")
	),
	errorLog(
		logLine("02:11:51.772", " [ERROR] Webhook signature verification failed")
	),
	errorLog(
		logLine("02:11:51.772", " StripeSignatureVerificationError: No signatures found matching the expected signature for payload"),
		logLine("02:11:51.772", "     at validateWebhook (/app/dist/integrations/stripe.js:92:17)")
	)

	// {
	// 	timestamp: "02:11:53.120",
	// 	message: "app[web.1]: FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory"
	// },
	// {
	// 	timestamp: "02:11:53.225",
	// 	message: "heroku[web.1]: Process exited with status 134"
	// },
	// {
	// 	timestamp: "02:11:53.411",
	// 	message: "heroku[web.1]: State changed from up to crashed"
	// },
	// {
	// 	timestamp: "02:11:55.001",
	// 	message: "heroku[web.1]: Starting process with command `npm start`"
	// },
	// {
	// 	timestamp: "02:11:58.882",
	// 	message: "app[web.1]: Server listening on port 48433"
	// },
	//
	// {
	// 	timestamp: "02:12:02.338",
	// 	message: "app[web.1]: [WARN] Sentry DSN missing. Error reporting disabled."
	// },
];
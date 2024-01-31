// import { dev } from '$app/environment';
// import { handleErrorWithSentry, Replay } from '@sentry/sveltekit';
// import * as Sentry from '@sentry/sveltekit';

// TODO: Fix Sentry
// Sentry.init({
// 	dsn: 'https://742e43279df93a3c4a4a78c12eb1f879@o4506057768632320.ingest.sentry.io/4506057770401792',
// 	tracesSampleRate: 1.0,

// 	// This sets the sample rate to be 10%. You may want this to be 100% while
// 	// in development and sample at a lower rate in production
// 	replaysSessionSampleRate: 0.1,

// 	// If the entire session is not sampled, use the below sample rate to sample
// 	// sessions when an error occurs.
// 	replaysOnErrorSampleRate: 1.0,

// 	// If you don't want to use Session Replay, just remove the line below:
// 	integrations: [new Replay()],
// 	environment: dev ? 'development' : 'production'
// });

// // If you have a custom error handler, pass it to `handleErrorWithSentry`
// export const handleError = handleErrorWithSentry();

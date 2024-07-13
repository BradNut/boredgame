export const notSignedInMessage = {
	type: 'error',
	message: 'You are not signed in',
} as const;
export const forbiddenMessage = {
	type: 'error',
	message: 'You are not allowed to access this',
} as const;
export const signedOutMessage = {
	type: 'success',
	message: 'Successfully signed out',
}
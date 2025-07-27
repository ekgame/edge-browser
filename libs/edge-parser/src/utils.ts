/**
 * Adapted from https://github.com/p2227/universal-eol/
 */
// @ts-ignore
const { platform } = typeof window === 'undefined' ? process : navigator
export const EOL = /win/i.test(platform) ? '\r\n' : '\n'

/**
 * rescheduleToken.js
 * 
 * Utility to reschedule a token.
 * 
 * @param {object} token - The original token
 * @param {string} newDateTime - ISO string or date string
 * @returns {object} Updated token
 */
export function rescheduleToken(token, newDateTime) {
  return {
    ...token,
    time: newDateTime,
    status: 'rescheduled'
  };
}

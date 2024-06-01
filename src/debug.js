// debug.js

export function logState(state, message = 'State') {
  console.log(`${message}:`, state);
}

export function logError(error, message = 'Error') {
  console.error(`${message}:`, error);
}

export function logMessage(message) {
  console.log(message);
}

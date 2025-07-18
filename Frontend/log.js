
/**
 * Reusable logging middleware function.
 * Makes an API call to the test server with log details.
 * @param {string} stack - The stack (e.g., 'backend', 'frontend')
 * @param {string} level - The log level (e.g., 'error', 'fatal', 'info')
 * @param {string} pkg - The package/module (e.g., 'handler', 'db')
 * @param {string} message - The log message
 */
export async function Log(stack, level, pkg, message) {
  try {
    await fetch('http://localhost:9000/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });
  } catch (err) {
    // Optionally handle logging errors here
    console.error('Failed to send log:', err);
  }
}

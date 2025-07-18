import { Log } from './log';

// Log an error in a handler
Log("backend", "error", "handler", "received string, expected bool");

// Log a fatal error in the db layer
Log("backend", "fatal", "db", "Critical database connection failure.");

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

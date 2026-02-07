export async function Log(stack, level, pkg, message) {
  try {
    await fetch('http://localhost:9000/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message
      })
    });
  } catch (err) {
    console.error('Failed to send log:', err);
  }
}

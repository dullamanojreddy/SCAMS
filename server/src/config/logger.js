export class Logger {
  static info(message, meta = {}) {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({ level: 'INFO', timestamp, message, ...meta }));
  }

  static warn(message, meta = {}) {
    const timestamp = new Date().toISOString();
    console.warn(JSON.stringify({ level: 'WARN', timestamp, message, ...meta }));
  }

  static error(message, meta = {}) {
    const timestamp = new Date().toISOString();
    console.error(JSON.stringify({ level: 'ERROR', timestamp, message, ...meta }));
  }

  static debug(message, meta = {}) {
    if (process.env.NODE_ENV !== 'production') {
      const timestamp = new Date().toISOString();
      console.log(JSON.stringify({ level: 'DEBUG', timestamp, message, ...meta }));
    }
  }
}

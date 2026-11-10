import fs from 'fs';
import path from 'path';
import { AppError } from './logger-client';

export const logErrorServer = (error: AppError) => {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
    const logPath = path.join(logDir, 'crashes.json');
    let logs: AppError[] = [];
    if (fs.existsSync(logPath)) {
      try {
        logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
      } catch (e) {
        logs = [];
      }
    }
    // Keep last 50 errors
    logs.unshift(error);
    if (logs.length > 50) logs.length = 50;
    
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
  } catch (e) {
    console.error('Failed to write error log:', e);
  }
};

export const getRecentErrors = (): AppError[] => {
  try {
    const logPath = path.join(process.cwd(), 'logs', 'crashes.json');
    if (fs.existsSync(logPath)) {
      return JSON.parse(fs.readFileSync(logPath, 'utf8'));
    }
  } catch (e) {
    console.error('Failed to read error log:', e);
  }
  return [];
};

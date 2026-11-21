export interface AppError {
  message: string;
  stack?: string | null;
  url?: string;
  timestamp: string;
  context?: any;
}

export const logErrorClient = async (error: AppError) => {
  if (typeof window === 'undefined') return;
  try {
    await fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(error)
    });
  } catch (e) {
    console.error('Failed to send error to server:', e);
  }
};

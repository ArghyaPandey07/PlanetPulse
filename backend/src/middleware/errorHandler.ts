// PlanetPulse — Global error handler middleware

import type { Request, Response, NextFunction } from 'express';

/**
 * Global Express error handler.
 * Catches unhandled errors and returns a consistent JSON response.
 * Never exposes stack traces or internal details.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error('[PlanetPulse Error]', err.message);

  res.status(500).json({
    success: false,
    errors: [{ field: 'server', message: 'An unexpected error occurred. Please try again.' }],
  });
}

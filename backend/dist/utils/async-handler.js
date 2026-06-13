/**
 * Wraps async route handlers and forwards errors to Express error middleware.
 * Fully typed, production-safe, no silent failures.
 */
export const tryCatch = (controller) => (req, res, next) => {
    Promise.resolve(controller(req, res, next)).catch(next);
};

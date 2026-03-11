export class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
export const errorMiddleware = (err, req, res, next) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }
    console.error('Unexpected error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
};
//# sourceMappingURL=error.middleware.js.map
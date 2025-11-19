export default class AppError extends Error {
    public status: number;
    public isOperational: boolean;

    constructor(message: string, status = 500) {
        super(message);
        this.status = status;
        this.isOperational = true;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}
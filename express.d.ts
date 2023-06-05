type User = {
    email: string;
};

declare namespace Express {
    interface Request {
        user?: User;
    }
}
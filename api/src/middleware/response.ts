import { RequestHandler } from 'express';

export const addRespondToResponse: RequestHandler = (_req, res, next) => {
    res.respond = (data): void => {
        res.status(200).send(data);
    };
    next();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SendResponse = (res, data: any = { message: "Invalid Request" }, status = 400) => {
    return res.status(status).json({ data, code: status });
}
export default SendResponse;
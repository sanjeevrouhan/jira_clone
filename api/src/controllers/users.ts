import { User } from 'entities';
import { catchErrors } from 'errors';
import SendResponse from 'middleware/response';
import { signToken } from 'utils/authToken';
import { compare, hash } from 'utils/password';
import StatusCode from 'utils/statusCode';
import { createEntity } from 'utils/typeorm';
export const getCurrentUser = catchErrors((req, res) => {
    res.respond({ currentUser: req.currentUser });
});
export const login = catchErrors(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        return SendResponse(res, { message: `User ${email} not found` }, StatusCode.UNAUTHORIZED)
    }
    const isValidPassword = compare(password, user.password);
    if (!isValidPassword) {
        return SendResponse(res, { message: `Invalid password for user ${email}` }, StatusCode.UNAUTHORIZED)
    }
    const { password: sp, ...rest } = user
    return SendResponse(res, {
        message: `Logged In Successfully`,
        authToken: signToken({ sub: user.id }),
        user: rest
    }, StatusCode.OK)
});
export const addUser = catchErrors(async (req, res) => {
    const body = req.body
    // Hashing the password
    if (body.password) {
        body.password = hash(body.password)
    }
    const user = await createEntity(User, {
        ...body,
        avatarUrl: 'https://i.ibb.co/6RJ5hq6/gaben.jpg',
    })
    res.respond({ user });
});

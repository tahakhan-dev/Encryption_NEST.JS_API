
const jwt = require('jsonwebtoken');

    export async function  verifyToken(token: string, cb) {
        return jwt.verify(token, process.env.JWT_TOKEN_SECRET, {}, cb);
    }



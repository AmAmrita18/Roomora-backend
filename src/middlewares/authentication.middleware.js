const jwt = require('jsonwebtoken');
const config = require('../../config/env/development.config.json')

async function authenticateToken(ctx, next) {
    const authHeader = ctx.request.headers['authorization'];
    if (!authHeader) {
        ctx.status = 403;
        ctx.body = { success: false, message: "No token provided" };
        return;
    }

    const token = authHeader.split(' ')[1];  //Bearer <token>
    if (!token) {
        ctx.status = 403;
        ctx.body = { success: false, message: "Token is missing" };
        return;
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);

        ctx.user = {
            id: decoded.id,
            email: decoded.email,
        };

        await next();
    } catch (err) {
        console.error("Token verification failed:", err.message);

        if (err.name === 'TokenExpiredError') {
            ctx.status = 401;
            ctx.body = { success: false, message: "Token has expired" };
        } else {
            ctx.status = 401;
            ctx.body = { success: false, message: "Invalid token" };
        }
    }
}

module.exports = authenticateToken;
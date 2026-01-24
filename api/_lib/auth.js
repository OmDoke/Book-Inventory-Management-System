import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    // We don't throw error at import time to avoid breaking build if env missing in verified contexts
    // but verifyToken will fail.
    console.warn("JWT_SECRET is not defined in environment variables.");
}

export const verifyToken = (req) => {
    try {
        const authHeader = req.headers.authorization;

        // Check for "Bearer <token>"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null; // No token provided
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (err) {
        return null; // Invalid token
    }
};

export const signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
};

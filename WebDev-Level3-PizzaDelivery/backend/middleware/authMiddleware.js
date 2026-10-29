const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'slicecraft_super_secret_key_2026';

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

exports.verifyAdmin = (req, res, next) => {
    exports.verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        }
    });
};
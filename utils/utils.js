import bcrypt from "bcryptjs";
import crypto from "crypto"
import jwt from "jsonwebtoken";

export const hashPassword = async function (plainPassword) {
    try {
        const saltRounds = 10; // Number of salt rounds
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
    }
}

export const verifyPassword = async function (plainPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        if (match) {
            return true
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error verifying password:', error);
    }
}

export const generateSessionSecret = function () {
    return crypto.randomBytes(64).toString('hex')
}

export const userInToken = (req, res) => {
    // return res.json(req.headers);
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ message: 'Token is required' });
    }

    return jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({message: 'Invalid token'});
        }
        return user;
    });
}
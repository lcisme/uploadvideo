const DATABASE_URL = process.env.DATABASE_URL || "mysql://root:root@localhost:3306/file-sys";
const ROLE = {
    ADMIN: 'ROLE_ADMIN',
    PREMIUM: 'ROLE_PREMIUM',
    USER: 'ROLE_USER'
}
const JWT_SECRET = process.env.JWT_SECRET
const JWT_TOKEN_EXPIRE = process.env.JWT_TOKEN_EXPIRE;

const SIZEFILE = MAX_FILE_SIZE = 10 * 1024 * 1024
module.exports = {
    DATABASE_URL,
    ROLE,
    SIZEFILE,
    JWT_SECRET,
    JWT_TOKEN_EXPIRE
}
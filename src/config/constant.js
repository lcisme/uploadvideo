const DATABASE_URL = process.env.DATABASE_URL || "mysql://root:root@localhost:3306/file-sys";
const ROLE = {
    ADMIN: 'ROLE_ADMIN',
    PREMIUM: 'ROLE_PREMIUM',
    USER: 'ROLE_USER'
}
const JWT_SECRET = process.env.JWT_SECRET
const JWT_TOKEN_EXPIRE = process.env.JWT_TOKEN_EXPIRE;
const URL_PATH = "../../../uploads"
const SIZEFILE = MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_FILES_PER_USER = 10
module.exports = {
    DATABASE_URL,
    ROLE,
    SIZEFILE,
    JWT_SECRET,
    JWT_TOKEN_EXPIRE,
    URL_PATH,
    MAX_FILES_PER_USER
}
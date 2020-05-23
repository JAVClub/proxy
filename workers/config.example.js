const aesPassword = require('./../vercel/config')

module.exports = {
    aesPassword,
    tokenAPI: `https://your-prefix.now.sh/${aesPassword}`
}
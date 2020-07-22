const CryptoJS = require('crypto-js')
const Base64 = require('js-base64').Base64
const express = require('express')
const randomInt = require('random-int')
const {
    GoogleToken
} = require('gtoken')

const app = express()
const port = 48971

const tokens = require('./gdTokens')
const config = require('./config')
const accessTokens = []

function genGdUrl(accessToken, fileId) {
    const uri = CryptoJS.AES.encrypt(accessToken + '||!||' + fileId, config.password).toString()
    return Base64.encode(uri)
}

app.get('/*', async (req, res) => {
    let str = `${req.path}`.substr(1)

    if (str.startsWith('https:/') || str.startsWith('http:/')) {
        const server = config.imgServer[randomInt(0, config.imgServer.length - 1)]
        return res.redirect(302, server + str.replace(':/', '://'))
    }

    let fileId
    try {
        str = Base64.decode(str)
        fileId = CryptoJS.AES.decrypt(str, config.password).toString(CryptoJS.enc.Utf8)
    } catch (error) {
        return res.status(403).json({
            code: -2,
            msg: 'Access denied',
            data: {}
        })
    }

    if (fileId || fileId.split('||!||').length === 2) {
        const server = config.gdServer[randomInt(0, config.gdServer.length - 1)]
        const result = fileId.split('||!||')

        const int = randomInt(0, tokens.length - 1)
        if (accessTokens[int] && accessTokens[int].expireTime > (new Date()).getTime()) {
            return res.redirect(server + genGdUrl(accessTokens[int].access_token, result[1]), 302)
        }

        const gtoken = new GoogleToken({
            email: tokens[int].client_email,
            scope: ['https://www.googleapis.com/auth/drive.readonly'],
            key: tokens[int].private_key
        })

        const obj = Object.assign({}, await gtoken.getToken())
        obj.expireTime = (new Date()).getTime() + 3400 * 1000

        accessTokens[int] = obj

        return res.redirect(302, server + genGdUrl(accessTokens[int].access_token, result[1]))
    } else {
        return res.status(403).json({
            code: -2,
            msg: 'Access denied',
            data: {}
        })
    }
})

app.listen(port, () => console.log(`App listening at :${port}`))

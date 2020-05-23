const express = require('express')
const randomInt = require('random-int')
const {
    GoogleToken
} = require('gtoken')

const app = express()
const port = 48971

const tokens = require('./gd-tokens')
const password = require('./config')
const accessTokens = []

app.get('/*', async (req, res) => {
    let str = `${req.path}`.substr(1)

    if (str == password) {
        const int = randomInt(0, tokens.length - 1)
        if (accessTokens[int] && accessTokens[int].expireTime > (new Date()).getTime()) {
            res.json(accessTokens[int])
            return
        }

        const can = tokens[int]
        const key = can.private_key
        const gtoken = new GoogleToken({
            email: can.client_email,
            scope: ['https://www.googleapis.com/auth/drive.readonly'],
            key: can.private_key
        })

        const obj = Object.assign({}, await gtoken.getToken())
        obj.expireTime = (new Date()).getTime() + 3400 * 1000

        accessTokens[int] = obj

        return res.json(obj)
    } else {
        return res.status(403).json({
            code: -2,
            msg: 'Access denied',
            data: {}
        })
    }
})

app.listen(port, () => console.log(`App listening at :${port}`))

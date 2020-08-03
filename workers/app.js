const CryptoJS = require('crypto-js')
const Base64 = require('js-base64').Base64
const oAuth = null // || require('./config') // Needed if not using vercel
const aesPassword = (oAuth && oAuth.aesPassword) || require('./../vercel/config').password

let accessToken, oAuthToken = {}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event))
})

async function handleRequest(event) {
    const request = event.request

    const gd = new googleDrive()

    const url = new URL(request.url)
    let str = url.pathname.substr(1)

    let fileId

    try {
        str = Base64.decode(str)
        fileId = CryptoJS.AES.decrypt(str, aesPassword).toString(CryptoJS.enc.Utf8)
    } catch (error) {
        return new Response(JSON.stringify({
            code: -2,
            msg: 'Access denied',
            data: {
                msg: 'AES error'
            }
        }), {
            status: 403
        })
    }

    if (fileId || fileId.split('||!||').length === 2) {
        const result = fileId.split('||!||')
        const range = request.headers.get('Range')

        accessToken = result[0]
        response = await gd.download(result[1], range)

        return response
    } else {
        return new Response(JSON.stringify({
            code: -2,
            msg: 'Access denied',
            data: {
                msg: 'parse error'
            }
        }), {
            status: 403
        })
    }
}

class googleDrive {
    async download(id, range) {
        const url = `https://www.googleapis.com/drive/v3/files/${id}?alt=media`

        const requestOption = await this.requestOption()

        requestOption.headers['Range'] = range

        let response = await fetch(url, requestOption)
        response = new Response(response.body, response)

        let cacheControl
        if (response.status < 299) cacheControl = 'public, max-age=2592000'
        else cacheControl = 'public, max-age=0'

        response.headers.set('Cache-Control', cacheControl)
        response.headers.set('X-Powered-By', 'JAVClub')
        response.headers.delete('x-guploader-uploadid')
        response.headers.delete('expires')
        response.headers.delete('date')
        response.headers.delete('content-disposition')

        return response
    }

    async requestOption(headers = {}, method = 'GET') {
        headers['authorization'] = 'Bearer ' + ((oAuth === null && accessToken) || await this.accessToken())

        return {
            method,
            headers
        }
    }

    async accessToken() {
        if (oAuthToken.expires === undefined || oAuthToken.expires < Date.now()) {
            const obj = await this.fetchAccessToken();
            if (obj.access_token != undefined) {
                oAuthToken.accessToken = obj.access_token;
                oAuthToken.expires = Date.now() + 3500 * 1000;
            }
        }
        return oAuthToken.accessToken;
    }

    async fetchAccessToken() {
        const url = "https://www.googleapis.com/oauth2/v4/token";
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const post_data = {
            client_id: oAuth.client_id,
            client_secret: oAuth.client_secret,
            refresh_token: oAuth.refresh_token,
            grant_type: 'refresh_token'
        }

        let requestOption = {
            'method': 'POST',
            'headers': headers,
            'body': this.enQuery(post_data)
        };

        const response = await fetch(url, requestOption);
        return await response.json();
    }

    enQuery(data) {
        const ret = []

        for (let d in data) {
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
        }

        return ret.join('&')
    }
}
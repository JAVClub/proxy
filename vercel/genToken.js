const fs = require('fs')

const accounts = fs.readdirSync('./accounts')
const tokens = []

for (const i in accounts) {
    if (`${accounts[i]}`.length !== 45) continue
    let file = JSON.parse(fs.readFileSync('./accounts/' + accounts[i]).toString())
    
    file = {
        client_email: file.client_email,
        private_key: file.private_key
    }

    tokens.push(file)
}

fs.writeFileSync('./gdTokens.js', 'module.exports='+JSON.stringify(tokens))

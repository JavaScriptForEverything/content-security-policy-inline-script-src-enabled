const crypto = require('crypto')
const express = require('express')
const helmet = require('helmet')

const app = express()
app.set('view engine', 'pug')

app.use((req, res, next) => {
	res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
	next()
})

app.use(helmet({
	contentSecurityPolicy : {
		directives: {
			scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'` ]
		}
	}
}))

app.use(express.static('public'))

app.get('/', (req, res, next) => {
	res.render('index')
})

const PORT = 5000
app.listen(PORT, () => console.log(`listen on http://localhost:${PORT}`))
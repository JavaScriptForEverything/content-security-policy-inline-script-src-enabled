## Content-Security-Policy: (CSP)


| CSP inline (script-src) Blocked     | CSP inline (script-src) Allowed | 
| ----------------------------------- | ----------------------------------- | 
| ![blocked](https://github.com/JavaScriptForEverything/content-security-policy-inline-script-src-enabled/blob/master/public/csp-inline-script-src-blocked.png) | ![alowed](https://github.com/JavaScriptForEverything/content-security-policy-inline-script-src-enabled/blob/master/public/csp-inline-script-src-allowed.png) | 



<img 
	width = "100%"
	src="https://github.com/JavaScriptForEverything/content-security-policy-inline-script-src-enabled/blob/master/public/csp-inline-script-src-blocked.gif"
	alt="Animated Picture"
/>






When we use `helmet` in express app, by default it disabled all inline src.

#### What is inline src ?
When we write any code directly inside `<script>` `<style>`, ... instead of attaching file, is called `inline src`

There are some well-known inline src:
- Directive: On which resources are the part of the policy. 

        . default-src : Apply default Policy for all resources.
        . font-src  : Deside font used by which location 		
        . style-src : 	" image " 	" 	" 	
        . script-src: 	" script 	" 	" 
        . img-src   : 	" image 	" 	"
        . media-src : 	" audio/video   " 	" 
        . object-src: 	" object/embeded 	" 

- The values used those `directive`

        . self 	      : Only run scripts fetched from the same domain with `src` attribute.
        . example.com   : Allow from `example.com` domain.
        . *.example.com : Allow from sub domain. 
        . https | ws 	  : Allow from https over HTTPS or WebSocket protocol only.
        . nonce-{token} : Allow inline src, which has same `nonce` attribute value, as here
        . none 		  : Match with none, not even from self domin. (Permanently block)
        . unsafe-inline : Allow inline src. It defeate the whole purpose of CSP [ not recomended ]


### Example-1: Enable inline `script-src` blocked by `helmet()` middleware

When we try to use inline src `htlmet()` middlware by default block it. But some time we need to use or allow particular src.

Bellow example shows how to enable `inline (script-src)` with Content-Security-Policy enabled.

##### /index.js
```
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
```



##### /views/index.pug
```
doctype html
html(lang="en")
	head
		title Enable inline script-src

		style.
			h1 { color: red; }
	body 
		h1 Pug File

		script(src='/home.js')
		script(nonce=cspNonce).
			console.log('inline script')

		script.
			console.log('inline script 2')
```


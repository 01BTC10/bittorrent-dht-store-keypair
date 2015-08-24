var KP = require('../')
var kp = KP()
console.log(JSON.stringify({
  publicKey: kp.publicKey.toString('hex'),
  secretKey: kp.secretKey.toString('hex')
}))

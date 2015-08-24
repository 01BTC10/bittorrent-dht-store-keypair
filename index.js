var ed = require('ed25519-supercop')
var sha = require('sha.js')
var defined = require('defined')
var bencode = require('bencode')

module.exports = KP

function KP (opts) {
  if (!(this instanceof KP)) return new KP(opts)
  if (!opts) opts = {}
  this.secretKey = opts.secretKey
  this.publicKey = opts.publicKey
  if (typeof this.secretKey === 'string') {
    this.secretKey = Buffer(this.secretKey, 'hex')
  }
  if (typeof this.publicKey === 'string') {
    this.publicKey = Buffer(this.publicKey, 'hex')
  }
  if (!this.secretKey && !this.publicKey) {
    var kp = ed.createKeyPair(this.seed || ed.createSeed())
    this.secretKey = kp.secretKey
    this.publicKey = kp.publicKey
  }
  this.id = sha('sha1').update(this.publicKey).digest('hex')
  this.seq = defined(opts.seq, 0)
}

KP.prototype.sign = function (value) {
  return ed.sign(value, this.publicKey, this.secretKey)
}

KP.prototype.store = function (value) {
  if (typeof value === 'string') value = Buffer(value)
  var svalue = bencode.encode({
    seq: this.seq,
    v: value
  }).slice(1, -1)
  return {
    k: this.publicKey,
    seq: this.seq++,
    v: value,
    sig: this.sign(value)
  }
}

KP.verify = ed.verify

function tobuf (s) {
  if (typeof s === 'string') return Buffer(s, 'hex')
  return s
}

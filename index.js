var EC = require('elliptic').ec
var sha = require('sha.js')
var defined = require('defined')
var bpad = require('./lib/bpad.js')
var bencode = require('bencode')

module.exports = KP

function KP (opts) {
  if (!(this instanceof KP)) return new KP(opts)
  if (!opts) opts = {}
  this.kp = opts.k
    ? new EC('ed25519').keyFromPrivate(tobuf(opts.k))
    : new EC('ed25519').genKeyPair()
  this.k = bpad(32, Buffer(this.kp.getPublic().x.toArray()))
  this.id = sha('sha1').update(this.k).digest('hex')
  this.seq = defined(opts.seq, 0)
}

KP.prototype.sign = function (value) {
  var sig = this.kp.sign(value)
  return Buffer.concat([
    bpad(32, Buffer(sig.r.toArray())),
    bpad(32, Buffer(sig.s.toArray()))
  ])
}

KP.prototype.store = function (value) {
  if (typeof value === 'string') value = Buffer(value)
  var svalue = bencode.encode({
    seq: this.seq,
    v: value
  }).slice(1, -1)
  return {
    k: this.k,
    seq: this.seq++,
    v: value,
    sig: this.sign(value)
  }
}

function tobuf (s) {
  if (typeof s === 'string') return Buffer(s, 'hex')
  return s
}

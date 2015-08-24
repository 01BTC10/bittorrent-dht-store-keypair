# bittorrent-dht-store-keypair

Setting up elliptic curve keys and signing properly for
[BEP44](https://github.com/feross/bittorrent-dht/pull/61)
can be tricky, especially since bittorrent uses the more obscure supercop/ref10
instead of sodium/nacl ed25519 key formatting.

# example

## quick example

``` js
var KP = require('bittorrent-dht-store-keypair')
var DHT = require('bittorrent-dht')

var dht = new DHT({ verify: KP.verify })
var kp = KP()

var value = 'beep boop'
dht.once('ready', function () {
  dht.put(kp.store(value), function (errors, hash) {
    if (errors.length) errors.forEach(console.log)
    else console.log(kp.id)
  })
})
```

## save and load a key from a file

``` js
var KP = require('bittorrent-dht-store-keypair')
var kp = KP()
console.log(JSON.stringify({
  publicKey: kp.publicKey.toString('hex'),
  secretKey: kp.secretKey.toString('hex')
}))
```

```
$ node generate.js > keypair.json
```

``` js
var KP = require('bittorrent-dht-store-keypair')
var DHT = require('bittorrent-dht')
var path = require('path')
var concat = require('concat-stream')

var dht = new DHT({ verify: KP.verify })
var kp = KP(require(path.resolve(process.argv[2])))

dht.once('ready', function () {
  process.stdin.pipe(concat(function (value) {
    dht.put(kp.store(value), function (errors, hash) {
      if (errors.length) errors.forEach(console.log)
      else console.log(kp.id)
    })
  }))
})
```

```
$ echo wow cool | node put.js keypair.json
```

# api

``` js
var KP = require('bittorrent-dht-store-keypair')
```

## var kp = KP(opts)

* `opts.publicKey` - create `kp` with a buffer or hex string public key
* `opts.secretKey` - create `kp` with a buffer or hex string private key
* `opts.seq` - sequence to start at in `kp.store()`

## var signature = kp.sign(value)

Sign a buffer or string `value` with the private key.

## var putOpts = kp.store(value, opts)

Create the `putOpts` for a `value` to pass into bittorrent-dht's `put()`
function.

`kp.seq` is incremented here unless `opts.seq` is provided.

## kp.publicKey

public key (32 bytes)

## kp.secretKey

private key (64 bytes)

## kp.id

sha1 hash of the `kp.publicKey`

## kp.seq

sequence number

## KP.verify

The underlying ed25519-supercop verify function.
This is handy to pass into the bittorrent-dht constructor as the `verify`
parameter:

``` js
var DHT = require('bittorrent-dht')
var KP = require('bittorrent-dht-store-keypair')
var dht = new DHT({ verify: KP.verify })
```

# install

```
npm install bittorrent-dht-store-keypair
```

# license

MIT

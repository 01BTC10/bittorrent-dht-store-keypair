# bittorrent-dht-store-keypair

Setting up elliptic curve keys and signing properly for
[BEP44](https://github.com/feross/bittorrent-dht/pull/61)
can be tricky.

This module makes it easier:

``` js
var kp = require('bittorrent-dht-store-keypair')()
var DHT = require('bittorrent-dht')
var dht = new DHT({ bootstrap: false })
console.log(kp.id)

dht.listen(5001, function () {
  dht.put(kp.store('whatever'), function (errors, hash) {
    console.log(hash)
  })
})
```

# license

MIT

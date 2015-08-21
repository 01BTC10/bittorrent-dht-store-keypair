var kp = require('../')()
var DHT = require('bittorrent-dht')
var dht = new DHT({ bootstrap: false })
console.log(kp.id)

dht.listen(5001, function () {
  dht.put(kp.store('whatever'), function (errors, hash) {
    console.log(hash)
  })
})

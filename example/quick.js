var KP = require('../')
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

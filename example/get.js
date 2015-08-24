var KP = require('../')
var DHT = require('bittorrent-dht')
var path = require('path')

var dht = new DHT({ verify: KP.verify })
var hash = Buffer(process.argv[2], 'hex')
dht.once('ready', function () {
  dht.get(hash, function (err, node) {
    if (err) console.error(err)
    else console.log(node.v.toString())
  })
})

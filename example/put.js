var KP = require('../')
var DHT = require('bittorrent-dht')
var path = require('path')
var concat = require('concat-stream')

var dht = new DHT({ bootstrap: false, verify: KP.verify })
var kp = KP(require(path.resolve(process.argv[2])))

dht.addNode('127.0.0.1:5001')
dht.once('node', function () {
  process.stdin.pipe(concat(function (value) {
    dht.put(kp.store(value), function (errors, hash) {
      if (errors.length) errors.forEach(console.log)
      else console.log(kp.id)
    })
  }))
})

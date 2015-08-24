var DHT = require('bittorrent-dht')
var KP = require('../')
var dht = new DHT({ bootstrap: false, verify: KP.verify })
dht.listen(5001)

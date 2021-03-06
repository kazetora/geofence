function GeofenceServer(listenPort) {
  this.listenPort = 5555;
  this.server = null;
  this.activeArea = [];
  this.template = null;
  this._init(listenPort);
}

GeofenceServer.prototype._init = function(listenPort){
  var _self = this;
  if(typeof listenPort !== 'undefined' && listenPort) {
    _self.listenPort = listenPort;
  }
  _self.template = {
    result: 0,
    data: null
  };
}

GeofenceServer.prototype.start = function(){
  var _self = this;
  var restify = require('restify');

  _self.server = restify.createServer({
    name: 'GeofenceServer'
  });

  // use body parser
  _self.server.use(restify.bodyParser());

  // server route
  _self.server.get('/geofence/getActiveArea', _self.getActiveArea.bind(_self));
  _self.server.post('/geofence/updateActiveArea', _self.updateActiveArea.bind(_self));

  _self.server.listen(_self.listenPort, function(){
    console.log('%s listening at %s', _self.server.name, _self.server.url)
  });
}

GeofenceServer.prototype.getActiveArea = function(req, res, next) {
console.log("get active area");
  var _self = this;
  var response = _self.template;
  response.data = _self.activeArea;
  res.send(response);
}

GeofenceServer.prototype.updateActiveArea = function(req, res, next) {
console.log("update active area");
  var _self = this;
  var params = req.params;
  var response = _self.template;

  //console.log(params);
  var gju = require('geojson-utils');
  var async = require('async');

  var point = params.point;
  var areas = params.area;
//console.log(areas);

  var activeContents = [];
  async.each(areas, function(area_item, callback){
    var coords = area_item.coords;
    var polygon = [];
    async.each(coords, function(coorditem, callback_in){
      polygon.push([coorditem.lat, coorditem.lng]);
      callback_in();
    }, function(err){
      if(gju.pointInPolygon({"type":"Point", "coordinates": point},
                            {"type": "Polygon", "coordinates": [polygon]})) {
        var cuids = area_item.cuids;
console.log(cuids);
        activeContents = activeContents.concat(cuids.filter(function(item){
          return activeContents.indexOf(item) < 0;
        }));
      }
      callback();
    });
  }, function(err) {
    if(err) {
      console.error('ERROR: Geo fencing failed');
      response.result = -1;
    }
    else {
      _self.activeArea = activeContents;
      response.data = _self.activeArea;
    }
    res.send(response);
  });
}

module.exports = GeofenceServer;

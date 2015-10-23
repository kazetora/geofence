var GeofenceServer = function(listenPort) {
  this.listenPort = 5555;
  this.server = null;
  this.activeArea = [];
  this._init(listenPort);
}

GeofenceServer.prototype._init = function(listenPort){
  var _self = this;
  if(typeof listenPort !== 'undefined' && listenPort) {
    _self.listenPort = listenPort;
  }
}

GeofenceServer.prototype.start = function(){
  var _self = this();
  var restify = require('restify');

  _self.server = restify.createServer({
    name: 'GeofenceServer'
  });

  // use body parser
  _self.server.use(restify.bodyParser());

  // server route
  _self.server.get('/geofence/getActiveArea', _self.getActiveArea);
  _self.server.post('/geofence/updateActiveArea', _self.updateActiveArea);

  _self.server.listen(_self.listenPort, function(){
    console.log('%s listening at %s', server.name, server.url)
  })
}

GeofenceServer.prototype.getActiveArea = function(req, res, next) {
  var _self = this;
  var response = _self._getResponseTemplate();
  response.data = _self.activeArea;
  res.send(response);
}

GeofenceServer.prototype.updateActiveArea = function(req, res, next) {
  var params = req.params;
  var response = _self._getResponseTemplate();

  console.log(params);

  res.send(response);
}

Geofence.prototype._getResponseTemplate = function(){
  var template = {
    result: 0,
    data: null
  }

  return template;
}

module.exports = GeofenceServer;

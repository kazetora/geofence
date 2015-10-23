var GeofenceServer = require("./server/geofenceServer");

server = new GeofenceServer(5555);

server.start();

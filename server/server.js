var connect = require('connect');
var serverStatic = require('serve-static');

connect().use(serverStatic('./dist'))
    .listen(8080, function() {
        console.log('Server running on port: 8080');
    });
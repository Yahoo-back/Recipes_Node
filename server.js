var app = require('./app');
var port = process.env.PORT || 3002;

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

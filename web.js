var express = require('express');

var app = express.createServer(express.logger());

console.log("jaklsdfjklsdafjladfa");

var fs = require('fs');

app.get('/', function(request, response) {
//  response.send('Hello World 2!');

  fs.readFile('index.html', function (err, data) {
    if (err) throw err;
    console.log(data);
    response.send(data.toString());
  });

});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});

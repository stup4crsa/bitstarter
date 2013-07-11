var express = require('express');

var app = express.createServer(express.logger());

console.log("jaklsdfjklsdafjladfa");

var fs = require('fs');
fs.readFile('index.html', function (err, data) {
  if (err) throw err;
  console.log(data);
//response.send(data);
});

app.get('/', function(request, response) {
  response.send('Hello World 2!');

fs.writeFile('message.txt', 'Hello Node', function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});

});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

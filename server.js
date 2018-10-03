// ***************
// ***  SETUP  ***
// ***************

const express = require('express');
const app = express();
app.use('/static', express.static('static'));
app.use('/', express.static('example'));

// ****************
// ***  SERVER  ***
// ****************

const port = process.env.PORT || 9999;

const server = app.listen(port, function () {

  const host = server.address().address;
  const port = server.address().port;

  console.log('Vue Example listening at http://%s:%s', host, port);

});

;(function (io) {
  'use strict';

  var socket = window.socket = io.connect(location.host);

  socket.on('error', function(data) {
    console.log(data);
  });

})(window.io)

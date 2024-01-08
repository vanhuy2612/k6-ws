import ws from 'k6/ws';
import { check } from 'k6';

export default function () {
  const url = 'ws://localhost:3000/socket.io/?EIO=3&transport=websocket';
  const params = {};

  const response = ws.connect(url, params, function (socket) {
    socket.on('open', function open() {
      socket.setInterval(function timeout() {
        socket.send('ping', {});
        console.log('Pinging every 1sec (setInterval test)');
      }, 1000);
    });

    socket.on('ping', function () {
      console.log('PING!');
    });

    socket.on('pong', function (data) {
      console.log('PONG!', data);
    });

    socket.on('pong', function () {
      // Multiple event handlers on the same event
      console.log('OTHER PONG!');
    });

    socket.on('close', function () {
      console.log('disconnected');
    });

    socket.on('error', function (e) {
      if (e.error() != 'websocket: close sent') {
        console.log('An unexpected error occured: ', e.error());
      }
    });

    socket.setTimeout(function () {
      console.log('2 seconds passed, closing the socket');
      socket.close();
    }, 2000);
  });

  check(response, { 'status is 101': (r) => r && r.status === 101 });
}
//VU execution won't be completely finished until the connection is closed.

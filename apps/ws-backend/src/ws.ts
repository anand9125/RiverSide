import express from 'express';
import ws from 'ws';
import http from 'http';
import { mediaSoupServer } from './mediasoupServer';



export const main = async () => {
  const app = express();
  const server = http.createServer(app);
  const wss = new ws.Server({ server });

  mediaSoupServer(wss);
  
  server.listen(4000, () => {
    console.log('Server is running on port 4000');
  });
}
main();
import { Session } from 'mpc-framework';
import { WebSocketServer } from 'ws';
import assert from 'assert';
import generateProtocol from './utils/generateProtocol';

// Bob's circuit input.
const NUMBER = 4;

const PORT = 8080

const wss = new WebSocketServer({ port: PORT });

console.info(`Listening on port ${PORT}...`);

wss.on('connection', async ws => {
  ws.on('error', console.error);

  const protocol = await generateProtocol('./src/circuit/main.ts');

  let session: Session;

  ws.on('message', (msg: Buffer) => {
    if (!session) {
      session = protocol.join('bob', { b: NUMBER }, (to, msg) => {
        assert(to === 'alice', 'Unexpected party');

        ws.send(msg);
      });

      session.output().then(({ main }) => {
        console.log(`Result: ${main}`);
      });
    }

    session.handleMessage('alice', new Uint8Array(msg));
  });
});

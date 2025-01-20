import { WebSocket } from 'ws';
import assert from 'assert';
import generateProtocol from './utils/generateProtocol';

// Alice's circuit input.
const NUMBER = 8;

const ws = new WebSocket('ws://localhost:8080');

ws.on('error', console.error);

ws.on('open', async () => {
  const protocol = await generateProtocol('./src/circuit/main.ts');

  const session = protocol.join('alice', { a: NUMBER }, (to, msg) => {
    assert(to === 'bob', 'Unexpected party');
    ws.send(msg);
  });

  ws.on('message', (msg: Buffer) => {
    session.handleMessage('bob', msg);
  });

  const { main } = await session.output();

  console.log(`Result: ${main}`);
});

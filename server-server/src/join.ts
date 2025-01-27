import assert from 'assert';
import inquirer from 'inquirer';
import { WebSocket } from 'ws';
import { PORT } from './utils/constants';
import generateProtocol from './utils/generateProtocol';

const ws = new WebSocket(`ws://localhost:${PORT}`);

ws.on('error', console.error);

ws.on('open', async () => {
  const protocol = await generateProtocol('./src/circuit/main.ts');

  // Alice's circuit input.
  const { number } = await inquirer.prompt({
    type: 'input',
    name: 'number',
    message: 'Enter your number:',
  });

  const session = protocol.join('alice', { a: Number(number) }, (to, msg) => {
    assert(to === 'bob', 'Unexpected party');
    ws.send(msg);
  });

  ws.on('message', (msg: Buffer) => {
    session.handleMessage('bob', msg);
  });

  const { main } = await session.output();

  console.info(`\nThe largest number is: ${main}\n`);

  ws.close();
});

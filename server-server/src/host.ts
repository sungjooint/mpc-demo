import assert from 'assert';
import inquirer from 'inquirer';
import { Session } from 'mpc-framework';
import { WebSocketServer } from 'ws';
import generateProtocol from './utils/generateProtocol';

export const PORT = 8080;

const wss = new WebSocketServer({ port: PORT });

console.info(`Listening on port ${PORT}...\n`);

wss.on('connection', async ws => {
  ws.on('error', console.error);

  const protocol = await generateProtocol('./src/circuit/main.ts');

  let session: Session;

  ws.on('message', async (msg: Buffer) => {
    if (!session) {
      // Bob's circuit input.
      const { number } = await inquirer.prompt({
        type: 'input',
        name: 'number',
        message: 'Enter your number:',
      });

      session = protocol.join('bob', { b: Number(number) }, (to, msg) => {
        assert(to === 'alice', 'Unexpected party');

        ws.send(msg);
      });

      session.output().then(({ main }) => {
        console.info(`\nThe largest number is: ${main}\n`);

        wss.close();
      });
    }

    session.handleMessage('alice', new Uint8Array(msg));
  });
});

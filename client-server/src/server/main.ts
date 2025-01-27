import { WebSocketServer } from 'ws';
import generateProtocol from '../utils/generateProtocol';
import assert from '../utils/assert';
import { readFileSync } from 'fs';
import { Session } from 'mpc-framework';
import inquirer from 'inquirer';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', async ws => {
  ws.on('error', console.error);

  const protocol = await generateProtocol(
    './src/circuit/main.ts',
    (filePath: string) => readFileSync(filePath, 'utf8'),
  );

  let session: Session;

  ws.on('message', async (msg: Buffer) => {
    if (!session) {
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

        ws.close();
      });
    }

    session.handleMessage('alice', new Uint8Array(msg));
  });
});

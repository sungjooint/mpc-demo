import * as summon from 'summon-ts';
import { readFileSync } from 'fs';
import { Protocol } from 'mpc-framework';
import { EmpWasmBackend } from 'emp-wasm-backend';

export default async function generateProtocol(mainFile: string) {
  await summon.init();

  const circuit = summon.compileBoolean(mainFile, 16, (filePath: string) =>
    readFileSync(filePath, 'utf8'),
  );

  const mpcSettings = [
    {
      name: 'alice',
      inputs: ['a'],
      outputs: ['main'],
    },
    {
      name: 'bob',
      inputs: ['b'],
      outputs: ['main'],
    },
  ];

  return new Protocol(circuit, mpcSettings, new EmpWasmBackend());
}

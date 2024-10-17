import * as summon from 'summon-ts';
import { Protocol } from 'mpc-framework';
import { EmpWasmBackend } from 'emp-wasm-backend';

export default async function generateProtocol() {
  await summon.init();

  const circuit = summon.compileBoolean('/src/main.ts', 16, {
    '/src/main.ts': `
      export default function main(a: number, b: number) {
        return a > b ? a : b;
      }
    `,
  });

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

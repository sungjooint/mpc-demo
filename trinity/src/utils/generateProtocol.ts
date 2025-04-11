import * as summon from 'summon-ts';
import getCircuitFiles from './getCircuitFiles';
import { initTrinity, parse_circuit } from '@trinity/core';

export default async function generateProtocol() {
  await summon.init();
  const trinityModule = await initTrinity();

  const circuit = summon.compileBoolean(
    'circuit/main.ts',
    16,
    await getCircuitFiles(),
  );

  let circuit_parsed = parse_circuit(circuit.circuit.bristol, 16, 16, 16);

  return { trinityModule, circuit_parsed };
}

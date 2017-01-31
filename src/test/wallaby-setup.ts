import { Worker } from './worker';

export async function Setup(wallaby) {

  wallaby.delayStart();

  const worker = new Worker(wallaby.workerId);

  await worker.setup();

  global['_wallabyConfig'] = worker;

  wallaby.start();

}
import { Worker } from './worker';
import { find, isUndefined } from 'lodash';
import { config } from './config';

export class WorkerManager {

  private _workers: Worker[] = [];

  constructor() {

  }

  findWorker(workerId: number) {
  
    return find(this._workers, (worker: Worker) => {
      
      return worker.workerId === workerId;

    });

  }

  async handleWorker(workerId: number, projectDir:string, config: config) {

    let worker = this.findWorker(workerId);

    if (isUndefined(worker)) {
      
      worker = new Worker(workerId, projectDir, config);
  
      await worker.setup();

    }

    this._workers.push(worker);

    await worker.initialize();

    return worker;

  }
  
}
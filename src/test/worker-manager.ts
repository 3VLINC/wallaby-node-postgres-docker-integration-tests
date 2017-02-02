import { Worker } from './worker';
import { find, isUndefined } from 'lodash';

export class WorkerManager {

  private _workers: Worker[] = [];

  constructor() {

  }

  findWorker(workerId: number) {
  
    return find(this._workers, (worker: Worker) => {
      
      return worker.workerId === workerId;

    });

  }

  async handleWorker(workerId: number, projectDir:string) {

    let worker = this.findWorker(workerId);

    if (isUndefined(worker)) {
      
      worker = new Worker(workerId, projectDir);
  
      await worker.setup();

    }

    this._workers.push(worker);

    await worker.initialize();

    return worker;

  }
  
}
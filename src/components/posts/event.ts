import { db } from '../../db';

export class EventComponent {

  static async create(name: string) {

    return await db('events').returning(['id', 'name']).insert({name});

  }
  
  static async createSeatingPlan(name: string) {

    return await db('seatingPlans').returning(['id', 'name']).insert({name});

  }

}
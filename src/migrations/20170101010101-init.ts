import * as Knex from 'knex';

async function up(knex: Knex ) {

  let exists = true;

  exists = await knex.schema.hasTable('events');

  if (!exists) {

    await knex.schema.createTable('events', function(table) {

      table.increments('id').unsigned().primary();
      table.string('name').notNullable();
      table.timestamps(true, true);

    });
  };

  exists = await knex.schema.hasTable('guests');

  if (!exists) {

    await knex.schema.createTableIfNotExists('guests', function(table) {

      table.increments('id').unsigned().primary();
      table.string('name').notNullable();
      table.integer('eventId').unsigned();
      table.foreign('eventId').references('id').inTable('events').onDelete('cascade');
      table.timestamps(true, true);

    });

  }

  exists = await knex.schema.hasTable('seatingPlans');

  if (!exists) {

    await knex.schema.createTableIfNotExists('seatingPlans', function(table) {

      table.increments('id').unsigned().primary();
      table.string('name').notNullable();
      table.integer('eventId').unsigned();
      table.foreign('eventId').references('id').inTable('events').onDelete('cascade');
      table.timestamps(true, true);

    });

  }

  exists = await knex.schema.hasTable('tables');

  if (!exists) {

    await knex.schema.createTableIfNotExists('tables', function(table) {

      table.increments('id').unsigned().primary();
      table.string('name');
      table.string('shape').notNullable();
      table.integer('spaces').notNullable();
      table.integer('tableNumber').notNullable();
      table.integer('seatingPlanId').unsigned();
      table.foreign('seatingPlanId').references('id').inTable('seatingPlans').onDelete('cascade');
      table.timestamps(true, true);

      table.unique(['seatingPlanId', 'tableNumber']);

    });
  }

  exists = await knex.schema.hasTable('users');

  if (!exists) {

    await knex.schema.createTableIfNotExists('users', function(table) {

      table.increments('id').unsigned().primary();
      table.string('username').unique().notNullable();
      table.string('password').notNullable();
      table.timestamps(true, true);

    });

  }

  exists = await knex.schema.hasTable('eventUsers');
  if (!exists) {

    await knex.schema.createTableIfNotExists('eventUsers', function(table) {

      table.increments('id').unsigned().primary();
      table.string('role').notNullable();
      table.integer('eventId').unsigned();
      table.foreign('eventId').references('id').inTable('events').onDelete('cascade');
      table.integer('userId').unsigned();
      table.foreign('userId').references('id').inTable('users').onDelete('cascade');
      table.timestamps(true, true);

    });
  }
  exists = await knex.schema.hasTable('tableAssignments');

  if (!exists) {

    await knex.schema.createTableIfNotExists('tableAssignments', function(table) {

      table.increments('id').unsigned().primary();
      table.integer('tablePosition').notNullable();
      table.integer('tableId').unsigned();
      table.foreign('tableId').references('id').inTable('tables').onDelete('cascade');
      table.integer('guestId').unsigned();
      table.foreign('guestId').references('id').inTable('guests').onDelete('cascade');
      table.timestamps(true, true);
      table.unique(['tableId', 'tablePosition']);

    });

  }

}

async function down(knex: Knex) {

  await knex.schema.dropTableIfExists('events');
  await knex.schema.dropTableIfExists('guests');
  await knex.schema.dropTableIfExists('seatingPlans');
  await knex.schema.dropTableIfExists('tables');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('eventUsers');
  await knex.schema.dropTableIfExists('tableAssignments');

}

export { up, down }

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

}

async function down(knex: Knex) {

  await knex.schema.dropTableIfExists('events');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('eventUsers');

}

export { up, down }

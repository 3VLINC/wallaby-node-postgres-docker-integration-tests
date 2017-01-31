import * as Knex from 'knex';

async function up(knex: Knex ) {

  let exists = true;

  exists = await knex.schema.hasTable('posts');

  if (!exists) {

    await knex.schema.createTable('posts', function(table) {

      table.increments('id').unsigned().primary();
      table.string('name').notNullable();
      table.string('body').notNullable();
      table.timestamps(true, true);

    });
  };

}

async function down(knex: Knex) {

  await knex.schema.dropTableIfExists('posts');

}

export { up, down }

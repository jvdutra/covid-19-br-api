import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('data', table => {
        table.increments('id').primary();
        table.string('uf', 2).notNullable();
        table.string('confirmed').notNullable();
        table.string('deaths').notNullable();
        table.dateTime('created').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('data');
}
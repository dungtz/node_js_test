const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const passwordHash = await bcrypt.hash('123456', 10);
    await knex('users')
        .insert({ username: 'admin', password: passwordHash })
        .onConflict('username')
        .ignore();
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex('users').where({ username: 'admin' }).del();
};

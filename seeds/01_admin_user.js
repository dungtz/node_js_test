const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    const passwordHash = await bcrypt.hash('123456', 10);

    await knex('users')
        .insert({ username: 'admin', password: passwordHash })
        .onConflict('username')
        .merge({ password: passwordHash });
};

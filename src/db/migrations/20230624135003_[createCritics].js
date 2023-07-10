exports.up = function (knex) {
  return knex.schema.createTable("critics", (table) => {
    table.increments("critic_id").primary(); //unique ID for critics
    table.string("preferred_name");
    table.string("surname");
    table.string("organization_name");
    table.timestamps(true, true); //created_at and updated_at columns
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("critics");
};

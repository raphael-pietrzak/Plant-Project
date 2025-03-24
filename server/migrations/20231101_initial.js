exports.up = function(knex) {
  return knex.schema
    // Table des appareils
    .createTable('devices', table => {
      table.string('device_id').primary();
      table.string('name');
      table.string('location');
      table.datetime('last_seen');
      table.timestamps(true, true);
    })
    
    // Table des mesures
    .createTable('measurements', table => {
      table.increments('id').primary();
      table.string('device_id').references('device_id').inTable('devices').onDelete('CASCADE');
      table.float('temperature');
      table.float('humidity');
      table.datetime('timestamp').defaultTo(knex.fn.now());
      table.timestamps(true, true);
    })
    
    // Table des plantes
    .createTable('plants', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('species');
      table.string('location');
      table.integer('waterFrequency');
      table.datetime('lastWatered');
      table.string('image_url');
      table.string('device_id').references('device_id').inTable('devices').onDelete('SET NULL');
      table.timestamps(true, true);
    })
    
    // Table des préférences
    .createTable('preferences', table => {
      table.increments('id').primary();
      table.boolean('notificationsEnabled').defaultTo(true);
      table.boolean('darkMode').defaultTo(false);
      table.string('measurementUnit').defaultTo('metric');
      table.string('language').defaultTo('fr');
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('measurements')
    .dropTableIfExists('plants')
    .dropTableIfExists('preferences')
    .dropTableIfExists('devices');
};

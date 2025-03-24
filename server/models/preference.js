const db = require('../config/database');

const Preference = {
  tableName: 'preferences',
  
  findAll() {
    return db(this.tableName);
  },
  
  findOne(conditions) {
    return db(this.tableName).where(conditions).first();
  },
  
  create(data) {
    return db(this.tableName)
      .insert(data)
      .then(ids => this.findOne({id: ids[0]}));
  },
  
  update(conditions, data) {
    return db(this.tableName).where(conditions).update(data);
  },
  
  findOrCreate({ where, defaults }) {
    return this.findOne(where)
      .then(found => {
        if (found) return [found, false];
        return this.create({...where, ...defaults}).then(created => [created, true]);
      });
  }
};

module.exports = Preference;

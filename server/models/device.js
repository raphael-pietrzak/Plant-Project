const db = require('../config/database');

const Device = {
  tableName: 'devices',
  
  findAll(options = {}) {
    const query = db(this.tableName);
    
    if (options.order) {
      const [field, direction] = options.order;
      query.orderBy(field, direction.toLowerCase());
    }
    
    return query;
  },
  
  findOne(conditions) {
    return db(this.tableName).where(conditions).first();
  },
  
  create(data) {
    return db(this.tableName).insert(data).then(() => this.findOne({device_id: data.device_id}));
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

module.exports = Device;

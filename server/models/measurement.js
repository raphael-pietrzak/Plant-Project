const db = require('../config/database');

const Measurement = {
  tableName: 'measurements',
  
  create(data) {
    return db(this.tableName)
      .insert(data)
      .then(ids => this.findOne({id: ids[0]}));
  },
  
  findAll(options = {}) {
    const query = db(this.tableName);
    
    if (options.where) {
      query.where(options.where);
    }
    
    if (options.order) {
      const [field, direction] = options.order;
      query.orderBy(field, direction.toLowerCase());
    }
    
    if (options.limit) {
      query.limit(options.limit);
    }
    
    return query;
  },
  
  findOne(conditions) {
    return db(this.tableName).where(conditions).first();
  }
};

module.exports = Measurement;

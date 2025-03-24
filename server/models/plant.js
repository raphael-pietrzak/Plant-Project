const db = require('../config/database');

const Plant = {
  tableName: 'plants',
  
  findAll(options = {}) {
    const query = db(this.tableName);
    
    if (options.where) {
      query.where(options.where);
    }
    
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
    return db(this.tableName)
      .insert(data)
      .then(ids => this.findOne({id: ids[0]}));
  },
  
  update(conditions, data) {
    return db(this.tableName).where(conditions).update(data);
  },
  
  delete(conditions) {
    return db(this.tableName).where(conditions).del();
  }
};

module.exports = Plant;

const db = require('../config/database');

const Preference = {
  tableName: 'preferences',
  
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
  
  findByKey(key) {
    return this.findOne({ key }).then(preference => {
      if (preference && preference.value) {
        try {
          // Si c'est déjà un objet, on le retourne directement
          if (typeof preference.value === 'object') return preference;
          // Sinon, on tente de le parser
          preference.value = JSON.parse(preference.value);
          return preference;
        } catch (e) {
          // Si ce n'est pas du JSON valide, on retourne la préférence telle quelle
          return preference;
        }
      }
      return preference;
    });
  },
  
  create(data) {
    // S'assurer que la valeur est stockée en JSON
    if (typeof data.value === 'object') {
      data.value = JSON.stringify(data.value);
    }
    
    return db(this.tableName)
      .insert(data)
      .then(ids => this.findOne({id: ids[0]}));
  },
  
  update(conditions, data) {
    // S'assurer que la valeur est stockée en JSON
    if (data.value && typeof data.value === 'object') {
      data.value = JSON.stringify(data.value);
    }
    
    return db(this.tableName).where(conditions).update(data);
  },
  
  delete(conditions) {
    return db(this.tableName).where(conditions).del();
  }
};

module.exports = Preference;

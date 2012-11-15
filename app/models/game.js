module.exports = function(mongoose) {
  var validator = require('../../lib/validator'),
      Schema    = mongoose.Schema,
      Game;

  Game = new Schema({
    key  :  {
      type     : String,
      validate : [validator({
        length: {
          min : 0,
          max : 100
        }
      }), "key"],
      unique   : true,
      required : true
    },
    key2 : { key: val }
  });

  // similar to SQL's like
  function like(query, field, val) {
    return (field) ? query.regex(field, new RegExp(val, 'i')) : query;
  }

  Game.statics.search = function search(params, callback) {
    var Model = mongoose.model('Game'),
        query = Model.find();


    like(query, 'key', params.key);
    like(query, 'otherkey', params.otherkey);

    query.exec(callback);
  };

  Game.statics.findById = function findById(id, callback) {
    var Model = mongoose.model('Game'),
        query = Model.find();

    if (id.length !== 24) {
      callback(null, null);
    } else {
      Model.findOne().where('_id', id).exec(callback);
    }
  };

  return mongoose.model('Game', Game);
}

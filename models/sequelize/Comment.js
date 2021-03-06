'use strict';

var instanceMethods = {};

module.exports = function(db, DataTypes) {
  var Comment = db.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    crimeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId:{
      type: DataTypes.INTEGER,
      allownull: false
    }
  }, {
    tableName: 'comment',
    instanceMethods: instanceMethods,
    classMethods: {},
    hooks: {}
  });

  return Comment;
}

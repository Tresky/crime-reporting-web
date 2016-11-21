'use strict';

var instanceMethods = {

};

module.exports = function(db, DataTypes) {
  var Notification = db.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    regionalId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    crimeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    viewedAt: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'notification',
    instanceMethods: instanceMethods,
    classMethods: {

    },
    hooks: {

    }
  });

  return Notification;
}

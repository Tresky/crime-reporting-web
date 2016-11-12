'use strict';

// Crime:
//   crimeType => 'sexual' | 'violent' | 'theft'|
//   longitude
//   latitude
//   dateOfCrime
//   userID
//   email=> userID === null -> email must be defined
//
//   createdAt
//   updatedAt
//
// Comment:
//   id
//   message => 'was wearing a red shirt'
//   userID => if null -> anonymous
//
//   createdAt
//   updatedAt

var instanceMethods = {

};

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
    classMethods: {

    },
    hooks: {

    }
  });

  return Comment;
}

'use strict';

var instanceMethods = {};

module.exports = function(db, DataTypes){

	var Crime = db.define('Crime', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		crimeType: {
			type: DataTypes.STRING,
			allowNull: false
		},
		placeId: {
			type: DataTypes.STRING,
			allowNull: false
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false
		},
		latitude: {
			type: DataTypes.STRING,
			allowNull: false
		},
		longitude: {
			type: DataTypes.STRING,
			allowNull: false
		},
		dateOfCrime: {
			type: DataTypes.DATE,
			allowNull: false
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		tableName: 'crime',
		instanceMethods: instanceMethods,
		classMethods: {},
		hooks: {}
	});

	return Crime;
}

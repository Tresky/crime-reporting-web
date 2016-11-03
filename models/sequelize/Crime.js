'use strict';

var instanceMethods = {





};



// getAllCrime = function() {
// 	return {
// 		id:
// 		crimeType:
// 		longitude:
// 		latitude:
// 		dateOfCrime:
// 		userId:
// 		email:
// 	};
// }




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

		longitude: {

			type: DataTypes.FLOAT,
			allowNull: false

		},

		latitude: {

			type: DataTypes.FLOAT,
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

		tableName: 'crime' || 'comment',
		instanceMethods: instanceMethods,
		classMethods: {

		},
		hooks: {


		}

	});

	return Crime;
}

'use strict';
module.exports = (sequelize, DataTypes) => {
  const PlateNumber = sequelize.define('PlateNumber', {
    userId: DataTypes.INTEGER,
    platenumber: DataTypes.STRING
  }, {});
  PlateNumber.associate = function(models) {
    PlateNumber.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'owner'
    });
  };
  return PlateNumber;
};
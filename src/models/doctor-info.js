"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Doctor_Info extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Doctor_Info.belongsTo(models.User, { foreignKey: 'doctorId' })
            Doctor_Info.belongsTo(models.Allcode, { foreignKey: 'stateId', targetKey: 'keyMap', as: 'stateData' })
            Doctor_Info.belongsTo(models.Allcode, { foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentData' })
        }
    }
    Doctor_Info.init(
        {
            doctorId: DataTypes.INTEGER,
            stateId: DataTypes.STRING,
            paymentId: DataTypes.STRING,
            note: DataTypes.STRING,
            addressClinic: DataTypes.STRING,
            nameClinic: DataTypes.STRING,
            count: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Doctor_Info",
        }
    );
    return Doctor_Info;
};

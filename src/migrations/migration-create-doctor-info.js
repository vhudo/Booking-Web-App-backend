"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Doctor_Infos", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            doctorId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            specialtyId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            clinicId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            note: {
                type: Sequelize.STRING,
                defaultValue: 'none'
            },
            stateId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            paymentId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            addressClinic: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            nameClinic: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("Doctor_Infos");
    },
};

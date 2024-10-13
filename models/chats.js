const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Adjust the path as needed

const Chat = sequelize.define('Chat', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    timestamps: false,
});

module.exports = Chat;

// models/Question.js
const { DataTypes, Model } = require('sequelize');

class Question extends Model {
  static initModel(sequelize) {
    Question.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        question: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        answer: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Question',
        tableName: 'questions',
        timestamps: true, // Adds createdAt and updatedAt fields
      }
    );
  }
}

module.exports = Question;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subtask = sequelize.define('Subtask', {
  title: DataTypes.STRING,
  deadline: DataTypes.DATE,
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'subtasks',
  timestamps: true,
});

module.exports = Subtask;
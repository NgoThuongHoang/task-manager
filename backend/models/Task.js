const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Subtask = require('./Subtask');

const Task = sequelize.define('Task', {
  title: DataTypes.STRING,
  deadline: DataTypes.DATE,
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'tasks',
  timestamps: true,
});

Task.hasMany(Subtask, { as: 'subtasks', foreignKey: 'taskId', onDelete: 'CASCADE' });
Subtask.belongsTo(Task, { foreignKey: 'taskId' });

module.exports = Task;
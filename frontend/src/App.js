import React from 'react';
import TaskManager from './components/TaskManager';

function App() {
  return (
    <div className="font-sans p-5 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-5">Task Manager</h1>
      <TaskManager />
    </div>
  );
}

export default App;
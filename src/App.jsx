import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleAdd = () => {
    if (task.trim() === '') return;
    if (editId !== null) {
      setTaskList(taskList.map(t => t.id === editId ? { ...t, name: task } : t));
      setEditId(null);
    } else {
      const newTask = { id: Date.now(), name: task, completed: false };
      setTaskList([...taskList, newTask]);
    }
    setTask('');
  };

  const handleDelete = (id) => {
    setTaskList(taskList.filter((t) => t.id !== id));
  };

  const handleToggle = (id) => {
    setTaskList(
      taskList.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleEdit = (task) => {
    setTask(task.name);
    setEditId(task.id);
  };

  const filteredTasks = taskList.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'incomplete') return !t.completed;
    return true;
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(taskList));
  }, [taskList]);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      <h2 className="heading">My To-Do List</h2>
      <div className="input-row">
        <input
          type="text"
          placeholder="Enter your task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={handleAdd}>+</button>
      </div>

      <p className="date-text">📆 {formattedDate}</p>

      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
        <button onClick={() => setFilter('incomplete')} className={filter === 'incomplete' ? 'active' : ''}>Incomplete</button>
      </div>

      <div className="task-container">
        {filteredTasks.map((t) => (
          <div key={t.id} className={`task-card ${t.completed ? 'done' : ''}`}>
            <div className="task-content">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => handleToggle(t.id)}
              />
              <span>{t.name}</span>
              <button className="edit-btn" onClick={() => handleEdit(t)}>
                <img src="/edit.png" alt="edit" className="edit-icon" />

              </button>
            </div>
            <button className="delete-btn" onClick={() => handleDelete(t.id)}>
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
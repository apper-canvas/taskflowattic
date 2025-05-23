import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

const PlusIcon = getIcon('plus');
const CheckIcon = getIcon('check');
const ClockIcon = getIcon('clock');
const EditIcon = getIcon('edit-3');
const TrashIcon = getIcon('trash-2');
const FlagIcon = getIcon('flag');
const SearchIcon = getIcon('search');
const XIcon = getIcon('x');

// Placeholder for initial tasks data
const initialTasks = [
  { 
    id: 1, 
    title: 'Complete project proposal', 
    description: 'Finalize the project scope and requirements document',
    status: 'incomplete', 
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), 
    priority: 'high',
    categoryId: 'work'
  },
  { 
    id: 2, 
    title: 'Schedule dentist appointment', 
    description: 'Call the clinic to book a check-up',
    status: 'incomplete', 
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
    priority: 'medium',
    categoryId: 'health'
  },
  { 
    id: 3, 
    title: 'Buy groceries', 
    description: 'Get milk, eggs, bread, and vegetables',
    status: 'complete', 
    dueDate: new Date(Date.now() - 12 * 60 * 60 * 1000), 
    priority: 'low',
    categoryId: 'shopping'
  },
  { 
    id: 4, 
    title: 'Review quarterly reports', 
    description: 'Analyze Q3 financial data and prepare summary',
    status: 'incomplete', 
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 
    priority: 'high',
    categoryId: 'work'
  },
  { 
    id: 5, 
    title: 'Clean garage', 
    description: 'Organize tools and discard unused items',
    status: 'incomplete', 
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), 
    priority: 'low',
    categoryId: 'personal'
  }
];

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

// Utility function to format date
const formatDate = (date) => {
  if (!date) return 'No date';
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const taskDate = new Date(date);
  
  if (taskDate.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (taskDate.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

// Check if date is overdue
const isOverdue = (date, status) => {
  if (status === 'complete') return false;
  return date && new Date(date) < new Date() && new Date(date).toDateString() !== new Date().toDateString();
};

const MainFeature = ({ categoryId }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  
  // Initialize tasks from initial data
  useEffect(() => {
    setTasks(initialTasks);
  }, []);
  
  // Filter tasks based on category, search query, and completion status
  useEffect(() => {
    let filtered = [...tasks];
    
    // Filter by category if not "all"
    if (categoryId && categoryId !== 'all') {
      filtered = filtered.filter(task => task.categoryId === categoryId);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by completion status
    if (!showCompleted) {
      filtered = filtered.filter(task => task.status !== 'complete');
    }
    
    // Sort tasks: incomplete first, then by due date, then by priority
    filtered.sort((a, b) => {
      // Completed tasks go last
      if (a.status === 'complete' && b.status !== 'complete') return 1;
      if (a.status !== 'complete' && b.status === 'complete') return -1;
      
      // Then sort by due date (overdue first)
      if (a.dueDate && b.dueDate) {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA - dateB;
      }
      
      // Tasks without due dates go last
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      // Then sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    setFilteredTasks(filtered);
  }, [tasks, categoryId, searchQuery, showCompleted]);

  const handleAddTask = () => {
    if (newTask.title.trim() === '') {
      toast.error('Task title cannot be empty');
      return;
    }
    
    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      status: 'incomplete',
      priority: newTask.priority,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
      categoryId: categoryId === 'all' ? 'personal' : categoryId
    };
    
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    setIsAdding(false);
    toast.success('Task added successfully');
  };
  
  const handleUpdateTask = () => {
    if (newTask.title.trim() === '') {
      toast.error('Task title cannot be empty');
      return;
    }
    
    setTasks(tasks.map(task => 
      task.id === editingTaskId 
        ? {
            ...task,
            title: newTask.title,
            description: newTask.description,
            priority: newTask.priority,
            dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null
          }
        : task
    ));
    
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    setEditingTaskId(null);
    toast.success('Task updated successfully');
  };
  
  const handleToggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? {...task, status: task.status === 'complete' ? 'incomplete' : 'complete'} 
        : task
    ));
    
    // Find the task to show in the toast message
    const taskToToggle = tasks.find(task => task.id === id);
    if (taskToToggle) {
      const newStatus = taskToToggle.status === 'complete' ? 'incomplete' : 'complete';
      toast.success(`Task marked as ${newStatus}`);
    }
  };
  
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted successfully');
  };
  
  const handleEditTask = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setEditingTaskId(task.id);
  };
  
  const cancelEdit = () => {
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    setEditingTaskId(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4 min-w-0">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-surface-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchQuery('')}
            >
              <XIcon className="h-5 w-5 text-surface-400 hover:text-surface-600" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <label className="flex items-center space-x-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
              checked={showCompleted}
              onChange={() => setShowCompleted(!showCompleted)}
            />
            <span>Show completed</span>
          </label>
          
          <button 
            className="btn-primary ml-auto whitespace-nowrap"
            onClick={() => {
              setIsAdding(true);
              setEditingTaskId(null);
            }}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            <span>Add Task</span>
          </button>
        </div>
      </div>
      
      {/* Add/Edit task form */}
      <AnimatePresence>
        {(isAdding || editingTaskId !== null) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="card mb-6 border-2 border-primary/20">
              <h3 className="text-lg font-semibold mb-4">
                {editingTaskId !== null ? 'Edit Task' : 'Add New Task'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="input"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="2"
                    className="input resize-none"
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      className="input"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      className="input"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={editingTaskId !== null ? handleUpdateTask : handleAddTask}
                  >
                    {editingTaskId !== null ? 'Update Task' : 'Add Task'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tasks list */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-12 text-center">
            <img 
              src="https://cdn.pixabay.com/photo/2019/02/18/09/16/checklist-4004666_960_720.png" 
              alt="No tasks" 
              className="h-32 w-auto mb-4 opacity-50"
            />
            <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
            <p className="text-surface-500 mb-6 max-w-md">
              {searchQuery 
                ? "No tasks match your search criteria. Try a different search term." 
                : "You have no tasks in this category yet. Add your first task to get started."}
            </p>
            {!isAdding && (
              <button 
                className="btn-primary"
                onClick={() => {
                  setIsAdding(true);
                  setEditingTaskId(null);
                }}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                <span>Add Your First Task</span>
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredTasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 30, 
                  mass: 1
                }}
                className={`task-card ${
                  task.status === 'complete' 
                    ? 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                    : isOverdue(task.dueDate, task.status)
                      ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                      : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.status === 'complete'
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-surface-300 dark:border-surface-600 hover:border-primary dark:hover:border-primary'
                    }`}
                    aria-label={task.status === 'complete' ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {task.status === 'complete' && <CheckIcon className="h-4 w-4" />}
                  </button>
                  
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-medium ${
                        task.status === 'complete' ? 'line-through text-surface-500' : ''
                      }`}>
                        {task.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 ml-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className={`text-sm mt-1 ${
                        task.status === 'complete' 
                          ? 'text-surface-500 line-through' 
                          : 'text-surface-600 dark:text-surface-400'
                      }`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                      {task.dueDate ? (
                        <div className={`flex items-center text-xs ${
                          isOverdue(task.dueDate, task.status) 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-surface-500'
                        }`}>
                          <ClockIcon className="h-3.5 w-3.5 mr-1" />
                          <span>
                            {isOverdue(task.dueDate, task.status) ? 'Overdue: ' : ''}
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-xs text-surface-500">
                          <span>No due date</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="p-1.5 rounded-full text-surface-500 hover:text-primary hover:bg-surface-200 dark:hover:bg-surface-700"
                          aria-label="Edit task"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 rounded-full text-surface-500 hover:text-red-500 hover:bg-surface-200 dark:hover:bg-surface-700"
                          aria-label="Delete task"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default MainFeature;
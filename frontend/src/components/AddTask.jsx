import React from "react";

const AddTask = ({ task, handleInputChange, handleAddTask }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-5">
        Add Task
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Task Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter task name"
            value={task.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Task Priority:</label>
          <select
            name="priority"
            value={task.priority}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Description:</label>
          <textarea
            name="description"
            placeholder="Enter task description"
            value={task.description}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Set End Date:</label>
          <input
            type="date"
            name="endDate"
            value={task.endDate}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
          />
        </div>

        <button
          onClick={handleAddTask}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default AddTask;

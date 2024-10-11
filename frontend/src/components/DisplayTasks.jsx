import React, { useState } from "react";
import Modal from "./Modal";

const DisplayTasks = ({ tasks, handleCompleteTask, handleDeleteTask }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const handleShowModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const maxDescriptionLength = 100; // Set the character limit for description

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-5">
        To-Do List
      </h1>
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks yet. Add some!</p>
      ) : (
        <ul className="grid grid-cols-2 gap-5">
          {tasks.map((taskItem, index) => (
            <li
              key={index}
              className={`p-4 rounded-md shadow-md min-h-[200px] flex flex-col justify-between ${
                taskItem.completed
                  ? "bg-green-100 line-through text-gray-500"
                  : "bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">{taskItem.name}</span>
                <p className="text-sm text-gray-500 mt-1">
                  Priority: <span>{taskItem.priority}</span>
                </p>
              </div>

              <p className="text-gray-700">
                {taskItem.description.length > maxDescriptionLength ? (
                  <>
                    {taskItem.description.slice(0, maxDescriptionLength)}...
                    <button
                      onClick={() => handleShowModal(taskItem)}
                      className="text-blue-500 underline ml-2"
                    >
                      Read More
                    </button>
                  </>
                ) : (
                  taskItem.description
                )}
              </p>

              <div className="flex mt-2 justify-between items-center">
                <p className="text-sm text-gray-500 mt-1">
                  End Date: <span>{taskItem.endDate || "No date set"}</span>
                </p>
                <div className="flex flex-row-reverse gap-5">
                  <button
                    onClick={() => handleDeleteTask(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleCompleteTask(index)}
                    className={`px-3 py-1 rounded-md text-white ${
                      taskItem.completed ? "bg-yellow-500" : "bg-green-500"
                    } hover:opacity-90`}
                  >
                    {taskItem.completed ? "Undo" : "Complete"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal Popup */}
      {showModal && (
        <Modal selectedTask={selectedTask} handleCloseModal={handleCloseModal}/>
        // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        //   <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        //     <div className="flex justify-between items-center mb-4">
        //       <h2 className="text-xl font-bold">{selectedTask.name}</h2>
        //       <button onClick={handleCloseModal} className="text-gray-500">
        //         <AiOutlineClose size={24} />
        //       </button>
        //     </div>
        //     <p className="text-gray-700 mb-4">{selectedTask.description}</p>
        //     <p className="text-sm text-gray-500">
        //       Priority: {selectedTask.priority} | End Date:{" "}
        //       {selectedTask.endDate || "No date set"}
        //     </p>
        //   </div>
        // </div>
      )}
    </>
  );
};

export default DisplayTasks;

import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const Modal = ({selectedTask, handleCloseModal}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{selectedTask.name}</h2>
          <button onClick={handleCloseModal} className="text-gray-500">
            <AiOutlineClose size={24} />
          </button>
        </div>
        <p className="text-gray-700 mb-4">{selectedTask.description}</p>
        <p className="text-sm text-gray-500">
          Priority: {selectedTask.priority} | End Date:{" "}
          {selectedTask.endDate || "No date set"}
        </p>
      </div>
    </div>
  );
};

export default Modal;

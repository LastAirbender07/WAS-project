import React, { useState, useEffect } from "react";
import AddTask from "../components/AddTask";
import DisplayTasks from "../components/DisplayTasks";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  console.log(email);
  const [task, setTask] = useState({
    name: "",
    priority: "Low",
    description: "",
    endDate: "",
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.post("http://localhost:5000/get-tasks", {
          email,
        });
        setTasks(response.data.tasks);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [email]);

  const handleAddTask = async () => {
    const sanitizedTask = {
      name: DOMPurify.sanitize(task.name),
      priority: DOMPurify.sanitize(task.priority),
      description: DOMPurify.sanitize(task.description),
      endDate: DOMPurify.sanitize(task.endDate),
    };

    if (
      sanitizedTask.name.trim() === "" ||
      sanitizedTask.description.trim() === ""
    ) {
      toast.error("Task name and description are required.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/add-task", {
        email,
        task: sanitizedTask,
      });
      setTasks([...tasks, { ...sanitizedTask, completed: false }]);
      setTask({ name: "", priority: "Low", description: "", endDate: "" });
      toast.success("Task added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add task.");
    }
  };

  const handleCompleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const handleDeleteTask = async (index) => {
    const newTasks = [...tasks];
    const taskToDelete = newTasks[index];
    newTasks.splice(index, 1);
    setTasks(newTasks);
    toast.success("Task deleted successfully!");

    try {
      await axios.post("http://localhost:5000/delete-task", {
        email,
        task: taskToDelete,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-green-400 via-green-300 to-green-400 px-2 overflow-y-hidden">
      <div className="flex flex-row gap-3">
        <div className="bg-white w-1/3 my-5 mx-3 px-6 py-3 rounded-lg shadow-lg overflow-y-hidden">
          <AddTask
            task={task}
            handleInputChange={handleInputChange}
            handleAddTask={handleAddTask}
          />
        </div>
        <div className="w-2/3 ml-auto px-6 py-5 overflow-y-scroll h-screen">
          <DisplayTasks
            tasks={tasks}
            handleCompleteTask={handleCompleteTask}
            handleDeleteTask={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

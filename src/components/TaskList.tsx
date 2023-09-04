import "./TaskList.scss";
import { Task as TaskType } from "../store/tasks";
import RemoveTodo from "../assets/img/remove.svg";
import CheckTodo from "../assets/img/check.svg";
import CheckSound from "../assets/sounds/done.mp3"

import { useState, useEffect } from "react";

interface TaskListProps {
  tasks: TaskType[];
  handleRemoveTask: (taskId: string) => void;
  handleCompleteTask: (taskId: string, completed: boolean) => void;
}

export default function TaskList({
  tasks,
  handleRemoveTask,
  handleCompleteTask,
}: TaskListProps) {



  const [completedTasks, setCompletedTasks] = useState<{ [taskId: string]: boolean }>({});

  
  useEffect(() => {
    // Initialize the completedTasks state based on the tasks passed in the props
    const initialCompletedTasks = tasks.reduce((acc, task) => {
      acc[task.id] = task.completed;
      return acc;
    }, {} as { [taskId: string]: boolean });
    setCompletedTasks(initialCompletedTasks);
  }, [tasks]);



  const handleComplete = async (taskId: string) => {
    // Toggle the local state first
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));

    // Calculate the new completion status to send to the backend
    const newCompletedStatus = !completedTasks[taskId];

    // Update the backend with the new completion status
    try {
      await handleCompleteTask(taskId, newCompletedStatus);
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error("Error updating task completion status:", error);
      
      // Revert the local state to the previous status on error
      setCompletedTasks((prev) => ({
        ...prev,
        [taskId]: !newCompletedStatus,
      }));
    }
  };





  

  const playSound = () => {
    new Audio(CheckSound).play();
  } 

  return (
    <div className="todo-list">
      {tasks.map((task) => (
        <div style={{opacity: completedTasks[task.id] ? "0.5" : "1"}} className={`todo-list__item ${
          completedTasks[task.id] ? "shake" : ""
        }`} key={task.id}>
          <div
            style={{
              backgroundImage: `url(${completedTasks[task.id] ? CheckTodo : ""})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              cursor: completedTasks[task.id] ? "pointer" : "initial",
            }}
            title="Mark as completed"
            onClick={() => {
              handleComplete(task.id)
              
              !completedTasks[task.id] ? playSound() : null;
            } }
            className="todo-list__item--complete"
          ></div>
          <div style={{
            textDecoration: completedTasks[task.id] ? "line-through" : ""
          }} className="todo-list__item__title">{task.title}</div>
          <div
            onClick={() => handleRemoveTask(task.id)}
            className="todo-list__item--remove"
          >
            <img title="Remove Task" src={RemoveTodo} alt="remove-todo" />
          </div>
        </div>
      ))}
    </div>
  );
}

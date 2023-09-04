import { useState } from "react";
import "./TaskInput.scss";

interface TaskInputProps {
  handleAddTask: (taskTitle: string) => void;
}

export default function TaskInput({ handleAddTask }: TaskInputProps) {
  const [taskTitle, setTaskTitle] = useState("");

  const handleTaskInput = () => {
    if (taskTitle.trim() !== "") {
      handleAddTask(taskTitle);
      setTaskTitle("");
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTaskInput();
    }
  };

  return (
    <div className="task-input">
      <div className="input-container">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter task..."
        />
        <div onClick={handleTaskInput} className="add-task">+</div>
      </div>
    </div>
  );
}

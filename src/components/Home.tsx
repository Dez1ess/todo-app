import "./Home.scss";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { addTaskAsync, removeTaskAsync, completeTaskAsync } from "../store/tasks";
import { useDispatch } from "react-redux";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import { AppDispatch } from "../store/configureStore";
import { v4 as uuidv4 } from 'uuid';

import GenderMale from '../assets/img/gender-male.png'
import GenderFemale from '../assets/img/gender-female.png'

import UkraineFlag from "../assets/img/ukraine-flag.svg"
import PolandFlag from "../assets/img/poland-flag.svg"
import CzechRepublicFlag from '../assets/img/czech-republic-flag.svg'


interface UserData {
  username: string;
  email: string;
  gender: string;
  country: string;
  userId: string;
}

interface userTask {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
}

export default function Home() {
  const [userinfo, setUserInfo] = useState<UserData>({
    username: "",
    email: "",
    gender: "",
    country: "",
    userId: "",
  });

  const [userTasks, setUserTasks] = useState<userTask[]>([]);

  const fetchUserTasks = async () => {
    try {
      const taskResponse = await axios.get(`todo-app-api-chi.vercel.app/user/tasks/${userinfo.userId}`);
      setUserTasks(taskResponse.data);
    } catch (error) {
      console.error("Error fetching user tasks:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get("todo-app-api-chi.vercel.app/auth/user", {
        withCredentials: true,
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  useEffect(() => {
    fetchUserData().then(() => {
      if (userinfo.userId) {
        fetchUserTasks();
      }
    });
  
  }, [userinfo.userId]);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddTask = async (taskTitle: string) => {
    const newId = uuidv4(); 
    console.log(newId);

    await dispatch(
      addTaskAsync({
        id: newId,
        title: taskTitle,
        userId: userinfo.userId,
      })
    );
    await fetchUserTasks()
  };

  const handleRemoveTask = async (taskId: string) => {
    await dispatch(
      removeTaskAsync({
        id: taskId,
        userId: userinfo.userId,
      })
    );
    await fetchUserTasks()
  };

  const handleCompleteTask = async (taskId: string) => {
    await dispatch(
      completeTaskAsync({
        id: taskId,
        userId: userinfo.userId,
      })
    );
    await fetchUserTasks()
  };


  const getGender = (gender: string) => {
    if (gender === "Male") {
      return GenderMale;
    } else if (gender === "Female") {
      return GenderFemale;
    } 
  }

  const getCountry = (country: string) => {
    if (country === "Ukraine") {
      return UkraineFlag;
    } else if (country === "Poland") {
      return PolandFlag;
    } else if (country === "Czech Republic") {
      return CzechRepublicFlag;
    }
  }

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('todo-app-api-chi.vercel.app/auth/logout');
      navigate('/auth/login'); 

    } catch(error) {
      console.error('Error logging out:', error);
    }
  }

  return (
    <div className="home">
      <header>
        <div className="user-details">
          <div className="user-details__gender">
            <img src={getGender(userinfo.gender)}  alt="user-gender-logo" />
          </div>
          <div className="user-details__info">
            <p className="username">{userinfo.username}</p>
            <div className="country"><img src={getCountry(userinfo.country)}  alt="country" /></div>
          </div>  
        </div>
        <button onClick={handleLogout} className="logout-button">Log out</button>
      </header>
        <div className="container">
        <TaskInput handleAddTask={handleAddTask} />
        <TaskList
          tasks={userTasks}
          handleRemoveTask={handleRemoveTask}
          handleCompleteTask={handleCompleteTask} 
        />
        </div>
    </div>
  );
}

import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  userId: string
}

type AddTaskPayload = {
  id: string;
  title: string;
  userId: string;
}

type RemoveTaskPayload = {
  id: string;
  userId: string;
}

type CompleteTaskPayload = {
  id: string;
  userId: string;
}

export const addTaskAsync = createAsyncThunk(
  'tasks/addTask',
  async (payload: AddTaskPayload) => {
    const response = await axios.post("todo-app-api-chi.vercel.app/user/tasks", {
      id: payload.id, 
      title: payload.title,
      userId: payload.userId,
    });
    return response.data;
  }
);

export const removeTaskAsync = createAsyncThunk(
  'tasks/removeTask',
  async (payload: RemoveTaskPayload) => {
    await axios.delete(`todo-app-api-chi.vercel.app/user/tasks/${payload.userId}/${payload.id}`);
    return payload.id;
  }
);

export const completeTaskAsync = createAsyncThunk(
  'tasks/completeTask',
  async (payload: CompleteTaskPayload) => {
    await axios.put(`todo-app-api-chi.vercel.app/user/tasks/${payload.userId}/${payload.id}`);
    return payload.id;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: [] as Task[],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(removeTaskAsync.fulfilled, (state, action) => {
        return state.filter((task) => task.id !== action.payload);
      })
      .addCase(completeTaskAsync.fulfilled, (state, action) => {
        return state.map((task) =>
          task.id === action.payload ? { ...task, completed: true } : task
        );
      });
  },
});

export default taskSlice.reducer;
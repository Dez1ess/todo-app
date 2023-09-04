import { configureStore } from "@reduxjs/toolkit"
import taskReducer from './tasks'

export const store = configureStore({reducer: {
  taskReducer
}})



export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import menuReducer from './slices/menuSlice'
import counterReducer from './slices/counterSlice'

export function makeStore() {

  return configureStore({
    reducer: { user:userReducer, menu:menuReducer,counter:counterReducer }
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store
import { configureStore, createSlice } from '@reduxjs/toolkit'

export const routeLoading = createSlice({
  name: 'routeLoading',
  initialState: {
    value: false,
  },
  reducers: {
    isLoading: (state) => {
      state.value = true
    },
    notLoading: (state) => {
      state.value = false
    },
  },
})

export const { isLoading, notLoading } = routeLoading.actions

export default configureStore({
  reducer: {
    routeLoading: routeLoading.reducer,
  },
  devTools: process.env.NODE_ENV === 'development',
})

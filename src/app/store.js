import { configureStore } from "@reduxjs/toolkit";
import groupReducer from '../features/group/groupSlice'
import memberReducer from '../features/member/memberSlice'

export const store = configureStore({
  reducer: {
    group: groupReducer,
    member: memberReducer
  }
})

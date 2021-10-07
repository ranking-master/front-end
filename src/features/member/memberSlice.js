import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = 'https://rankmaster-backend.herokuapp.com/v1'

const initialState = {
  members: [],
}


export const fetchMembers = createAsyncThunk(
  'member/fetchMembers',
  async ({user, groupId}) => {
    
    return []
  }
)


export const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {}, extraReducers: (builder) => {
    builder.addCase(fetchMembers.fulfilled, (state, action) => {
      state.members = action.payload
    })
  }
})


export default memberSlice.reducer

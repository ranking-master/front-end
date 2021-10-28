import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_API

const initialState = {
  members: [],
}


export const fetchMembers = createAsyncThunk(
  'member/fetchMembers',
  async ({user, groupId}) => {
    const response = await axios.get(`${API}/groups/getAllMembers/${groupId}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "Application/json",
        "Authorization": `Bearer ${user.idToken}`
      }
    })

    return response.data.data
  }
)

export const isAdminUser = createAsyncThunk(
  'member/isAdminUser',
  async ({user, groupId}) => {
    const response = await axios.get(`${API}/groups/checkIsAdmin/${groupId}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "Application/json",
        "Authorization": `Bearer ${user.idToken}`
      }
    })

    return response.data.data
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

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = 'https://rankmaster-backend.herokuapp.com/v1'


const initialState = {
  matches: [],
  members: []
}

export const createMatch = createAsyncThunk(
  'group/createMatch',
  async ({user, groupId, matchName, userIds}) => {
    const response = await axios.post(`${API}/groups/matchDay/create/${groupId}`, {
      user_id: userIds,
      name: matchName,
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "Application/json",
        "Authorization": `Bearer ${user.idToken}`
      }
    })

    return response.data.data
  }
)

export const fetchMatches = createAsyncThunk(
  'group/fetchMatches',
  async ({user, groupId}) => {
    const response = await axios.get(`${API}/groups/getAllMatchDays/${groupId}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "Application/json",
        "Authorization": `Bearer ${user.idToken}`
      }
    })

    return response.data.data
  }
)

export const fetchMatchMembers = createAsyncThunk(
  'member/fetchMatchMembers',
  async ({user, matchDayId}) => {
    const response = await axios.get(`${API}/groups/listMembers/${matchDayId}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "Application/json",
        "Authorization": `Bearer ${user.idToken}`
      }
    })

    return response.data.data
  }
)

export const fetchMatchDayById = createAsyncThunk('group/fetchMatchDayById', async ({user, matchDayId}) => {
  const response = await axios.get(`${API}/groups/getMatchDayDetail/${matchDayId}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${user.idToken}`
    }
  })

  return response.data.data
})

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {}, extraReducers: (builder) => {
    builder.addCase(createMatch.fulfilled, (state, action) => {
      state.matches.push(action.payload)
    })
    builder.addCase(fetchMatches.fulfilled, (state, action) => {
      state.matches = action.payload
    })
    builder.addCase(fetchMatchMembers.fulfilled, (state, action) => {
      state.members = action.payload
    })
  }
})


export default matchSlice.reducer

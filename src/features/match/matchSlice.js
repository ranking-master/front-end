import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_API


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

export const fetchFinishedMatches = createAsyncThunk(
  'group/fetchFinishedMatches',
  async ({user, groupId}) => {
    const response = await axios.get(`${API}/groups/getAllPreviousMatchDays/${groupId}`, {
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

export const fetchPreviousMatchMembers = createAsyncThunk(
  'member/fetchPreviousMatchMembers',
  async ({user, matchDayId}) => {
    const response = await axios.get(`${API}/groups/listMembersInPreviousMatchDay/${matchDayId}`, {
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

export const makeMatchDayRateActive = createAsyncThunk('group/makeMatchDayRateActive', async ({user, matchDayId}) => {
  const response = await axios.put(`${API}/groups/makeRateLinkVisible/${matchDayId}`, {}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${user.idToken}`
    }
  })

  return response.data.data
})

export const isMemberInMatchDay = createAsyncThunk('group/isMemberInMatchDay', async ({user, uuid}) => {
  const response = await axios.get(`${API}/groups/isMemberInMatchDay/${uuid}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${user.idToken}`
    }
  })

  return response.data.data
})

export const isRateSubmitted = createAsyncThunk('group/isRateSubmitted', async ({user, matchDayId}) => {
  const response = await axios.get(`${API}/groups/checkAlreadyRated/${matchDayId}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${user.idToken}`
    }
  })

  return response.data.data
})

export const submitRate = createAsyncThunk('group/submitRate', async ({user, matchDayId, userIds}) => {
  const response = await axios.post(`${API}/groups/addRating/${matchDayId}`, {user_id: userIds}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${user.idToken}`
    }
  })

  return response.data.data
})

export const expireMatchDay = createAsyncThunk('group/expireMatchDay', async ({user, matchDayId}) => {
  const response = await axios.put(`${API}/groups/closeRating/${matchDayId}`, {}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${user.idToken}`
    }
  })

  return response.data.data
})

export const isMatchDayExpired = createAsyncThunk('group/isMatchDayExpired', async ({user, matchDayId}) => {
  const response = await axios.get(`${API}/groups/checkRatingExpired/${matchDayId}`, {
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
      state.matches = [action.payload, ...state.matches]
    })
    builder.addCase(fetchMatches.fulfilled, (state, action) => {
      state.matches = action.payload
    })
    builder.addCase(fetchMatchMembers.fulfilled, (state, action) => {
      state.members = action.payload
    })
    builder.addCase(fetchPreviousMatchMembers.fulfilled, (state, action) => {
      state.members = action.payload
    })
  }
})


export default matchSlice.reducer

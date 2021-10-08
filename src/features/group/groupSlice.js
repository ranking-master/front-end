import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = 'https://rankmaster-backend.herokuapp.com/v1'


const initialState = {
  groups: [],
}

export const fetchGroups = createAsyncThunk(
  'group/fetchGroups',
  async ({user}) => {
    const response = await axios.get(`${API}/groups/getGroup?sort=createdAt&order=ASC&page=1&limit=100&search=`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "Application/json",
        "Authorization": `Bearer ${user.idToken}`
      }
    })

    return response.data.data.allGroups
  }
)

export const createGroup = createAsyncThunk(
  'group/createGroup',
  async ({user, group}) => {
    const response = await axios.post(`${API}/groups/createGroup`, {
      group_name: group
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

export const fetchGroupById = createAsyncThunk('group/fetchGroupById', async ({user, groupId}) => {
  const response = await axios.get(`${API}/groups/getGroup/${groupId}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${user.idToken}`
    }
  })

  return response.data.data
})

export const updateGroup = createAsyncThunk('group/updateGroup', async ({user, groupId, groupImageUrl}) => {
  const response = await axios.put(`${API}/groups/updateGroup/${groupId}`, {img_url: groupImageUrl}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${user.idToken}`
    }
  })
  return response.data.data
})

export const joinGroup = createAsyncThunk('group/joinGroup', async ({user, uuid}) => {
  const response = await axios.get(`${API}/groups/joinGroup/${uuid}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${user.idToken}`
    }
  })

  return response.data.data
})

export const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {}, extraReducers: (builder) => {
    builder.addCase(fetchGroups.fulfilled, (state, action) => {
      state.groups = action.payload
    })
    builder.addCase(createGroup.fulfilled, (state, action) => {
      state.groups.push(action.payload)
    })
    builder.addCase(updateGroup.fulfilled, (state, action) => {
      state.groups.map(group => {
        if (group.id === action.payload.id) {
          return {...group, ...action.payload}
        } else {
          return group
        }
      })
    })
  }
})


export default groupSlice.reducer

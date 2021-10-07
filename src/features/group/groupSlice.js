import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  groups: [],
}

export const fetchGroups = createAsyncThunk(
  'group/fetchGroups',
  async ({user}) => {
    const response = await axios.get(`${process.env.BACKEND_API}/groups/getGroup?sort=createdAt&order=ASC&page=1&limit=10&search=`, {
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
    const response = await axios.post(`${process.env.BACKEND_API}/groups/createGroup`, {
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
  const response = await axios.get(`${process.env.BACKEND_API}/groups/getGroup/${groupId}`, {
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
  }
})


// export const {addGroup} = groupSlice.actions

export default groupSlice.reducer

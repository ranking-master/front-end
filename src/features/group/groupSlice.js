import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groups: []
}

export const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    addGroup: (state, action) => {
      
    }
  }
})

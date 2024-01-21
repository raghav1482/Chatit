import { createSlice } from "@reduxjs/toolkit";

export const themeslice = createSlice({
    name : 'themeSlice',
    initialState : true ,
    reducers : {
        toggleTheme : (state)=>{
            state = !state;
        }
    }
}
);
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NavigationInterface } from "../Interfaces";


const initialState: NavigationInterface = {
    showSideNav: false,
    currentNav: 0,
    currentDropDown: 0,
    showTopNav: true,
}

const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        setShowSideNav: (state, action: PayloadAction<boolean>) => {
            state.showSideNav = action.payload
        },
        setCurrentNav: (state, action: PayloadAction<number>) => {
            state.currentNav = action.payload
        },
        setCurrentDropDown: (state, action: PayloadAction<number>) => {
            state.currentDropDown = action.payload
        },
        setShowTopNav: (state, action: PayloadAction<boolean>) => {
            state.showTopNav = action.payload
        }
    }
})


export const { setShowTopNav, setShowSideNav, setCurrentNav, setCurrentDropDown } = navigationSlice.actions


export default navigationSlice.reducer
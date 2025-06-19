import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface confirmBoxInterface {
    showConfirmBox: boolean,
    confirmMessage: string,
    confirmMessageDescription: string,
    confirmedAction: boolean
}


const initialState: confirmBoxInterface = {
    showConfirmBox: false,
    confirmMessage: "",
    confirmMessageDescription: "",
    confirmedAction: false
}

const confirmBox = createSlice({
    name: "confirmBox",
    initialState,
    reducers: {
        toggleShowConfirmBox: (state, action: PayloadAction<boolean>) => {
            state.showConfirmBox = action.payload
        },
        setConfirmMessage: (state, action: PayloadAction<string>) => {
            state.confirmMessage = action.payload
        },
        setConfirmMessageDescription: (state, action: PayloadAction<string>) => {
            state.confirmMessageDescription = action.payload
        },
        setConfirmedAction: (state, action: PayloadAction<boolean>) => {
            state.confirmedAction = action.payload
        }
    }
})


export const { toggleShowConfirmBox, setConfirmMessage, setConfirmMessageDescription, setConfirmedAction } = confirmBox.actions


export default confirmBox.reducer
2
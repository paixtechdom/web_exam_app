import { configureStore } from "@reduxjs/toolkit"
// import navigationReducer from "./navigation/navigationSlice"
import alertReducer from "./AlertSlice"
import navigationReducer from "./NavigationSlice"
import examsliceReducer from "./ExamSlice"
import AllExamsSlice from "./AllExamsSlice"
import studentsliceReducer from "./StudentSlice"
import confirmBoxReducer from "./ConfirmBoxSlice"
// import imageSliceReducer from "./ImageSlice"


export const store = configureStore({
    reducer: {
        alert: alertReducer,
        confirmBox: confirmBoxReducer,
        examslice: examsliceReducer,
        allexamsslice: AllExamsSlice,
        studentslice: studentsliceReducer,
        navigation: navigationReducer,
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch



import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { studentInfoInterface } from "../Interfaces";

const initialState: studentInfoInterface = {
    firstName: "",
    middleName: "",
    lastName: "",
    id: "",
    matricNumber: "",
    level: "",
    department: "",
    faculty: ""
}

const StudentSlice = createSlice({
    name: "studentslice",
    initialState,
    reducers: {
        setFirstName: (state, action: PayloadAction<string>) => {
            state.firstName = action.payload
        },
        setMiddleName: (state, action: PayloadAction<string>) => {
            state.middleName = action.payload
        },
        setLastName: (state, action: PayloadAction<string>) => {
            state.lastName = action.payload
        },
        setId: (state, action: PayloadAction<string>) => {
            state.id = action.payload
        },
        setMatricNumber: (state, action: PayloadAction<string>) => {
            state.matricNumber = action.payload
        },
        setLevel: (state, action: PayloadAction<string>) => {
            state.level = action.payload
        },
        setDepartment: (state, action: PayloadAction<string>) => {
            state.department = action.payload
        },
        setFaculty: (state, action: PayloadAction<string>) => {
            state.faculty = action.payload
        },
    }
})


export const { setFirstName,
    setMiddleName,
    setLastName,
    setId,
    setMatricNumber,
    setLevel,
    setDepartment,
    setFaculty } = StudentSlice.actions



export default StudentSlice.reducer
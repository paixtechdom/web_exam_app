import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from 'axios'
import { dbLocation } from "../Constants";
import { ExamInfoInterface } from "./ExamSlice";



interface AllExamsInterface{
    exams: ExamInfoInterface[],
    loading: boolean,
    error: string | null
}

const initialState: AllExamsInterface = {
    exams: [],
    loading: false,
    error: null
}

// function to fetch exams for admin only
export const FetchExams = 
createAsyncThunk<ExamInfoInterface[], void>(
    "exams/fetchExams",
    async(_, { rejectWithValue }) => {
        try{
            const response = await axios.get<ExamInfoInterface[]>(`${dbLocation}/exams.php/`)
            return response.data
        }catch(err: any){
            return rejectWithValue(err.message)
        }
    }
)



const AllExamsSlice = createSlice({
    name: "allexamsslice",
    initialState,
    reducers: {
        setExams: (state, action: PayloadAction<ExamInfoInterface[]>) => {
            state.exams = action.payload;
          }
    },
    extraReducers(builder) {
        builder
            .addCase(FetchExams.fulfilled, (state, action) => {
                state.exams = action.payload
                state.loading = false
            })
            .addCase(FetchExams.pending, state=>{
                state.loading = true
                state.error = null
            })
            .addCase(FetchExams.rejected, (state, action)=>{
                state.loading = false
                state.error = action.payload as string
            })
        },
})


export const {  setExams  } = AllExamsSlice.actions



export default AllExamsSlice.reducer
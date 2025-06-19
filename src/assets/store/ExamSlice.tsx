import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { dbLocation } from "../Constants";

export interface ExamQuestionInterface{
  question: string,
  optionA: string,
  optionB: string,
  optionC: string,
  optionD: string,
  answer: string,
  points: number,
  questionType: string,
  id?: number | string
}

export interface ExamInfoInterface {
  id: number,
  examKey: string,
  status: string,
  examTitle: string,
  duration: number,
  level: string,
  department: string,
  faculty: string,
  questionsLength: number,
  totalScore: number,
  questions:  ExamQuestionInterface[]
}
// Types
interface ExamState extends ExamInfoInterface {
    loading: boolean;
    error: string | null;
  }
  
  const initialState: ExamState = {
    id: 0,
    examKey: "",
    status: "",
    examTitle: "",
    duration: 0,
    level: "",
    department: "",
    faculty: "",
    questionsLength: 0,
    totalScore: 0,
    loading: false,
    error: null,
    questions :  []
  };
  


export const FetchExamQuestion =  createAsyncThunk<ExamQuestionInterface[], string>(
    "exams/fetchExamQuestions",
    async(examKey, { rejectWithValue }) => {
        try{
            const response = await axios.get<ExamQuestionInterface[]>(`${dbLocation}/examquestions.php/${examKey}`)
            return response.data
        }catch(err: any){
            return rejectWithValue(err.message)
        }
    }
)




  export const AddExam = createAsyncThunk<ExamInfoInterface, void>(
    "exams/AddExam",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.post<ExamInfoInterface>(`${dbLocation}/exams.php/`);
        return response.data;
      } catch (err: any) {
        return rejectWithValue(err.message);
      }
    }
  );
  
  const ExamSlice = createSlice({
    name: "examslice",
    initialState,
    reducers: {
      setExamKey: (state, action: PayloadAction<string>) => {
        state.examKey = action.payload;
      },
      setExamStatus: (state, action: PayloadAction<string>) => {
        state.status = action.payload;
      },
      setDuration: (state, action: PayloadAction<number>) => {
        state.duration = action.payload;
      },
      setExamTitle: (state, action: PayloadAction<string>) => {
        state.examTitle = action.payload;
      },
      setExamLevel: (state, action: PayloadAction<string>) => {
        state.level = action.payload;
      },
      setExamDepartment: (state, action: PayloadAction<string>) => {
        state.department = action.payload;
      },
      setExamFaculty: (state, action: PayloadAction<string>) => {
        state.faculty = action.payload;
      },
      setQuestionsLength: (state, action: PayloadAction<number>) => {
        state.questionsLength = action.payload;
      },
      setTotalScore: (state, action: PayloadAction<number>) => {
        state.totalScore = action.payload;
      },
      setQuestions: (state, action: PayloadAction<ExamQuestionInterface[]>) => {
        state.questions = action.payload;
      }
    },


    extraReducers: (builder) => {
      builder

        .addCase(FetchExamQuestion.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(FetchExamQuestion.fulfilled, (state, action) => {
          state.loading = false;
          state.questions = action.payload
        })
        .addCase(FetchExamQuestion.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })


        // // this should be moved to all exams
        // .addCase(AddExam.pending, (state) => {
        //   state.loading = true;
        //   state.error = null;
        // })
        // .addCase(AddExam.fulfilled, (state, action) => {
        //   state.loading = false;
        //   Object.assign(state, action.payload);
        // })
        // .addCase(AddExam.rejected, (state, action) => {
        //   state.loading = false;
        //   state.error = action.payload as string;
        // });
    }
  });
  
  export const {
    setExamKey,
    setExamStatus,
    setDuration,
    setExamTitle,
    setExamLevel,
    setExamDepartment,
    setExamFaculty,
    setQuestionsLength,
    setTotalScore,
    setQuestions
  } = ExamSlice.actions;
  
  export default ExamSlice.reducer;
  
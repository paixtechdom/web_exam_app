import { useDispatch } from "react-redux";
import { setDuration, setExamDepartment, setExamFaculty, setExamKey, setExamLevel, setExamStatus, setExamTitle, setTotalScore } from "../store/ExamSlice";
import { ExamInfoInterface } from "../Interfaces";

export const useUpdateExamDetails = () => {
    const dispatch = useDispatch();
  
    // Create a function that handles the alert logic
    const updateExamDetails = (exam: ExamInfoInterface) => {
      dispatch(setExamKey(exam.examKey))
      dispatch(setDuration(exam.duration))
      dispatch(setExamStatus(exam.status))
      dispatch(setExamTitle(exam.examTitle))
      dispatch(setExamLevel(exam.level))
      dispatch(setExamDepartment(exam.department))
      dispatch(setExamFaculty(exam.faculty))
      dispatch(setTotalScore(exam.totalScore))
    };
  
    return updateExamDetails; // Return the function so it can be used in components
  };
import { useDispatch } from "react-redux";
import { setDepartment, setFaculty, setFirstName, setId, setLastName, setLevel, setMatricNumber, setMiddleName } from "../store/StudentSlice";
import { studentInfoInterface } from "../Interfaces";

export const useUpdateStudentDetails = () => {
    const dispatch = useDispatch();
  
    // Create a function that handles the alert logic
    const updateStudentDetails = (student: studentInfoInterface) => {
        dispatch(setFirstName(student.firstName)),
        dispatch(setMiddleName(student.middleName)),
        dispatch(setLastName(student.lastName)),
        dispatch(setId(student.id)),
        dispatch(setMatricNumber(student.matricNumber)),
        dispatch(setLevel(student.level)),
        dispatch(setDepartment(student.department)),
        dispatch(setFaculty(student.faculty))
    };
  
    return updateStudentDetails; // Return the function so it can be used in components
  };
import { useDispatch } from "react-redux";
import { setAlertMessage, setAlertType, toggleShowAlert } from "../store/AlertSlice";

export const useMyAlert = () => {
    const dispatch = useDispatch();
  
    // Create a function that handles the alert logic
    const triggerAlert = (alertType: string, alertMessage: string) => {
      dispatch(setAlertType(alertType));
      dispatch(setAlertMessage(alertMessage));
      dispatch(toggleShowAlert(true));
    };
  
    return triggerAlert; // Return the function so it can be used in components
  };
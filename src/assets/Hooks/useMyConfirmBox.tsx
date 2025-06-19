import { useDispatch, useSelector } from "react-redux";
import { setConfirmMessage, setConfirmMessageDescription, toggleShowConfirmBox } from "../store/ConfirmBoxSlice";

export const useMyConfirmBox = () => {
    const dispatch = useDispatch();
    
    

    // Create a function that handles the alert logic
    const useConfirmBox = (confirmMessage: string, confirmMessageDescription: string) => {
      dispatch(toggleShowConfirmBox(true));
      dispatch(setConfirmMessage(confirmMessage));
      dispatch(setConfirmMessageDescription(confirmMessageDescription));
    };
  
    return useConfirmBox; // Return the function so it can be used in components


  };
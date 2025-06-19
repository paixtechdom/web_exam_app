import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { toggleShowAlert } from "../assets/store/AlertSlice"
import { AppDispatch, RootState } from "../assets/store/AppStore"


// This component is used with a custom hook, useMyAlert

const Alert = () => {
    const dispatch = useDispatch<AppDispatch>()
    const alert = useSelector((state:RootState) => state.alert)
    const alertType = alert.alertType
    const alertMessage = alert.alertMessage
    const showAlert = alert.showAlert
    
    let alertDuration = alertType == "info" ? 5000 : 3000

    useEffect(() => {
        if(showAlert){
            setTimeout(() => {
                dispatch(toggleShowAlert(false))
            }, alertDuration);
        }
    }, [showAlert])
    
  return (
    <div className={`fixed z-[100] transition-all duration-500 ease-in-out ${showAlert ? "bottom-[5vh] lg:bottom-[10vh]" : "-bottom-[15vh]"}  left-0 w-full center h-[10vh] lg:h-[12vh]`}>
        <div className={`bg-opacity-20 backdrop-blur-3xl w-11/12 md:w-9/12 lg:w-7/12 xl:w-5/12 rounded-xl flex items-center justify-between h-full shadow-xl px-3
            border-l-[16px] lg:border-l-[25px] ${
            alertType == "success" ? "border-green-700 bg-green-700" :
            alertType == "info" ? "border-blue-700 bg-blue-700" :
            alertType == "error" ? "border-red-700 bg-red-700" :
            "border-red-700"
        }
        `}>
            <p className="">
                {alertMessage}
            </p>

            <i onClick={() => {
                dispatch(toggleShowAlert(false))
            }}
            className="bi bi-x center text-xl rounded-full bg-gray-900 mx-4 h-8 w-8 cursor-pointer text-gray-100"></i>

        </div>
    </div>
  )
}

export default Alert

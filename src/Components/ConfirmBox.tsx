import { useDispatch, useSelector } from "react-redux"
import { PrimaryButtonCLass, SecondaryButtonCLass } from "../assets/Constants"
import { setConfirmedAction, setConfirmMessage, toggleShowConfirmBox } from "../assets/store/ConfirmBoxSlice"
import { AppDispatch, RootState } from "../assets/store/AppStore"

export const ConfirmBox = () =>{
    const dispatch = useDispatch<AppDispatch>()

    const confirmBox = useSelector((state:RootState) => state.confirmBox)
    const confirmMessage = confirmBox.confirmMessage
    const showConfirmBox = confirmBox.showConfirmBox
    const confirmMessageDescription = confirmBox.confirmMessageDescription

        
    return(
        <section className={`fixed top-0 left-0 bg-black  w-full h-screen center backdrop-blur-[2px]
            ${showConfirmBox ? "bg-opacity-50 z-[20]" : "bg-opacity-0 z-[-60]"}
        `}>

        <div className={`center flex-col gap-4 bg-white h-[50vh] w-11/12 md:w-9/12 lg:w-7/12 xl:w-5/12 rounded-xl shadow-xl p-9  transition-all duration-500 ease-in-out

                ${!showConfirmBox ? "scale-[0.5] z-[-50] opacity-0" : " "}
            `}>
                <div className="center flex-col w-full gap-2 text-center">
                    <h2 className={"text-2xl"}>
                        {confirmMessage}</h2>
                    <p className=" text-center">{confirmMessageDescription}</p>
                </div>

                <div className="center items-center lg:gap-5">

                    <button className={SecondaryButtonCLass + " scale-90 min-w-[150px]"} onClick={() =>{
                        dispatch(toggleShowConfirmBox(false))
                        dispatch(setConfirmMessage(""))
                        dispatch(setConfirmedAction(false))
                    }}>No</button>

                    <button className={PrimaryButtonCLass + " scale-90 min-w-[150px]"}
                        onClick={() => {
                            dispatch(setConfirmedAction(true))
                            dispatch(toggleShowConfirmBox(false))
                        }}
                    >Yes</button>

                </div>
            </div>
        </section>
)

}



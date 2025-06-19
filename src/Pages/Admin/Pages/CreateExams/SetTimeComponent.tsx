import React, { useEffect, useState } from 'react'
import { FormatTime } from '../../../../assets/Functions'
import { dbLocation, PrimaryButtonCLass, SecondaryButtonCLass } from '../../../../assets/Constants'
import { useDispatch } from 'react-redux'
import { setDuration } from '../../../../assets/store/ExamSlice'
import axios from 'axios'
import { useMyAlert } from '../../../../assets/Hooks/useMyAlert'
import { AsyncVoidFunction } from './CreateExam'

// to format time input in seconds to hr:min:sec format
interface d{
    examKey: string,
    duration: number
}
export const SetTimeComponent = ({examKey, duration} : d) => {    
    const [ timeFrame, setTimeFrame ] = useState(duration)
    const [ closeTimerInout, setCloseTimerInput ] = useState(true)
    const triggerAlert = useMyAlert()


    const addDuration:AsyncVoidFunction = async () =>{
        await axios.post(`${dbLocation}/exams.php/${timeFrame}/${examKey}`)
        .then((res) => {
            if(res.data.status == 1){
                triggerAlert("success", res.data.message)
            }else{
                triggerAlert("error", res.data.message)
            }
        }).catch(() =>{
            triggerAlert("error", "Failed to update time")
        })
    }

  return (
    <main className={``}>

        <div className={PrimaryButtonCLass + ' flex items-center gap-2'}
        onClick={()=> setCloseTimerInput(!closeTimerInout)}>
            <p className='text-sm'>Duration:</p>
            <p>
                {FormatTime(duration)}
            </p>
        </div>

        {
            !closeTimerInout &&
            <SetNewSession 
                setTimeFrame={setTimeFrame} 
                timeFrame={timeFrame}
                setCloseTimerInput={setCloseTimerInput}
                addDuration={addDuration}
            />
        }
           
    </main>
  )
}

interface e{
    setTimeFrame: (timeFrame: number) => void
    timeFrame:number, 
    setCloseTimerInput: (closeTimerInput: boolean) => void
    addDuration: AsyncVoidFunction
}

const SetNewSession = ({setTimeFrame, timeFrame, setCloseTimerInput, addDuration} : e) => {
    const [ sec, setSec ] = useState<number>(0)
    const [ min, setMin ] = useState<number>(0)
    const [ hr, setHr ] = useState<number>(0)
    
    const dispatch = useDispatch()
    
    const Minutes_To_Seconds = (min:number) => {
        return min * 60 
    }
    const Hours_To_Seconds = (hr:number) => {
        return hr * 60 * 60
    }

    useEffect(() => {
        setTimeFrame(Hours_To_Seconds(hr) + Minutes_To_Seconds(min) + sec)
    }, [sec, min, hr])



    return(
        <div className="absolute center flex-col gap-3 bg-gray-100 p-5 rounded-xl shadow-xl min-w-[220px] mt-4">
   
            <div className="flex justify-between gap-4 w-full">
                
                <SetValuesComponent 
                    value={hr}
                    setValue={setHr}
                    title={"Hr"}
                    />

                <SetValuesComponent 
                    value={min}
                    setValue={setMin}
                    title={"Min"}
                    />
                
                <SetValuesComponent 
                    value={sec}
                    setValue={setSec}
                    title={"Sec"}
                />
                
            </div>

            <div className="flex items-center w-full gap-3 mt-3">

                <button className={PrimaryButtonCLass + " w-full"}
                onClick={() => {
                    setCloseTimerInput(true)
                    dispatch(setDuration(timeFrame))
                    addDuration()
                }}>
                    Enter
                </button>
                
                <button className={SecondaryButtonCLass + " w-fit"} onClick={() => {setCloseTimerInput(true)}} >
                    Close
                </button>
            </div>

        </div>

    )
}

interface g {
    value: number,
    setValue: (value: number) => void,
    title: string
}

const SetValuesComponent = ({value, setValue, title}:g) => {
    return(
        <div className="center flex-col gap-2">
            <p className={`text-[12px] font-bold text-gray-500`}>{title}</p>
            <ControlsButton 
            func={() => {
                setValue(value + 1)
            }}>
                <i className='bi bi-chevron-up'></i>
            </ControlsButton>

            <input 
                type="number" 
                value={value} 
                className='w-12 text-center bg-transparent center outline-none'
                readOnly
            //     onChange={(e) => {
            //     setValue(value < 0 ? 0 : e.target.value) 
            // }}
            />
            
            <ControlsButton 
                func={() => {
                setValue(value <= 0 ? 0 : value - 1)
                }} 
                disabled={value == 0}
            >
                <i className='bi bi-chevron-down'></i>
            </ControlsButton>

        </div>
    )
}

interface f{
    children?: JSX.Element,
    func: () => void,
    disabled?: boolean
}

const ControlsButton = ({children, func, disabled}: f) => {
    return(
        <button className='bg-black bg-opacity-30 rounded h-7 w-full center active:scale-90 transition-all duration-100 active:rotate-[15deg] shadow-sm shadow-blue-950 scale-90 disabled:opacity-40 disabled:cursor-not-allowed' 
        disabled={disabled}
        onClick={func}
        >
            {children}
        </button>
    )
}


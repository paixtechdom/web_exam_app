import { Link } from "react-router-dom"
import { useEffect } from "react"
import { PrimaryButtonCLass } from "../assets/Constants"

export const PageNotFound = () => {
  document.documentElement.scrollTop = 0 
    // useEffect(() => {
    // }, [])

    return(

      <div className='pt-[10vh] w-full flex flex-col items-center justify-center h-[70vh] text-gray-900'>
      
      <div className="text-9xl flex items-end">4<i className="bi bi-exclamation-circle-fill h-fit text-8xl mb-3  bg-red-800 center rounded-full"></i>4</div>
      <p className="text-xl">
        Page not found 
      </p>

      <Link className={`${PrimaryButtonCLass} mt-9 text-white p-3 text-sm px-8 rounded-xl `} to='/'>Return to the Home Page <i className="bi bi-house-fill ml-2"></i></Link>
    </div>
    )
}


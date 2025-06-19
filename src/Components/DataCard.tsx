import { FC } from "react"

interface DataCardInterface {
    className?: string,
    data: string,
    value: string | number
    icon: string
}


export const DataCard: FC <DataCardInterface> = ({className, data, icon, value}) => {

    return(
        <div className={`w-full h-fit cursor-pointer transition-all duration-1000 hover:scale-90 ${className ? className : 'bg-white'} flex flex-col items-center p-5 shadow-lg lg:shadow-xl rounded-xl`}>

            <div className="w-full flex justify-between items-center">
                <p className="text-sm lg:text-lg text-gray-800 ">{data}</p> 
                <div className="w-10 h-10 rounded-full bg-gr ay-950">
                    <i className={`bi bi-${icon} bg-gray-900 scale-[0.7] h-14 w-14 shadow rounded-full center text-white text-2xl`}></i>
                </div>

            </div>
            <div className="w-full">
                <p className="text-xl lg:text-3xl text-secondary">{value}</p>
            </div>               

        </div>
    )
}


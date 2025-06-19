

export const FormatTime = (time: number) =>{
    let hours : number = Math.floor(time/3600) % 24
    let minutes: number | string = (Math.floor(time/60) % 60)
    let seconds : number | string = Math.floor(time % 60)
    if(minutes < 10) minutes = '0' + minutes
    if(seconds < 10) seconds = '0' + seconds
    if (hours > 0 ) {
        return `${hours} : ${minutes} : ${seconds}`
    }else{
        return `${minutes} : ${seconds}`
    }
}

export const EncodeValue = (value:string) => value.replace(/\s+/g, '-')



export const FormatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
    return date.toLocaleDateString("en-US", options)
}


export const ReplaceSpace = (s: string): string => {
    s.replace(" ", "-")
    .replace(" ", "-")
    .replace(" ", "-")
    .replace(" ", "-")
    .replace(" ", "-")
    .replace(" ", "-")
    .replace(" ", "-")
    .replace(" ", "-")
    .replace(" ", "-")
    .replace(" ", "-")
    .toLowerCase()

    return s
}
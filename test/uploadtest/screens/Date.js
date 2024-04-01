import { useEffect, useState } from "react"
import OutputScreen from "./OutputScreen"

const Date = () => {
    const [time, setTime] = useState("/------/--:--:--")

    useEffect(() => {
        const date = new Date()
        const formattedYear = date.getFullYear().toString().slice(-2)
        console.log("연도 포맷", formattedYear)
        const formattedDate = `${formattedYear}${date.getMonth() + 1}${date.getDate()}`
        console.log("날짜 포맷", formattedDate)
        const hours = String(date.getHours()).padStart(2, "0")
        console.log("시간 포맷", hours)
        const minutes = String(date.getMinutes()).padStart(2, "0")
        console.log("분 포맷", minutes)
        const seconds = String(date.getSeconds()).padStart(2, "0")
        console.log("초 포맷", seconds)
        const formattedTime = `${hours}:${minutes}:${seconds}`
        console.log("최종 시간 포맷", formattedTime)
    
        setTime(`/${formattedDate}/${formattedTime}`)
        console.log("최종 날짜 포맷", time)
    })

    return (
        <>
            <OutputScreen timeset={time} />
        </>
    )
}

export default Date
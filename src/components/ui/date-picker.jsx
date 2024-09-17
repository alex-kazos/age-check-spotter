import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
]

const MonthYearPicker = ({ date, setDate }) => {
  const handleMonthChange = (month) => {
    const newDate = new Date(date.getFullYear(), months.indexOf(month), 1)
    setDate(newDate)
  }

  const handleYearChange = (year) => {
    const newDate = new Date(parseInt(year), date.getMonth(), 1)
    setDate(newDate)
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 99 + i)

  return (
    <div className="flex justify-between items-center p-2 space-x-2">
      <Select value={months[date.getMonth()]} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue>{months[date.getMonth()]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={date.getFullYear().toString()} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[100px]">
          <SelectValue>{date.getFullYear()}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function DatePicker({ date, setDate }) {
  const [selectedDate, setSelectedDate] = React.useState(date || new Date())

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate)
    setDate(newDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <MonthYearPicker date={selectedDate} setDate={handleDateChange} />
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateChange}
          month={selectedDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
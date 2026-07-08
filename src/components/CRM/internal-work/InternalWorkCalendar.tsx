'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { InternalTask, InternalAssociate } from './types'

interface InternalWorkCalendarProps {
  tasks: InternalTask[]
  associates: InternalAssociate[]
}

export function InternalWorkCalendar({ tasks, associates }: InternalWorkCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1

  const getTasksForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return tasks.filter(t => t.due.startsWith(dateStr))
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const getAssociateName = (id: string) => {
    return associates.find(a => a.id === id)?.name || 'Unassigned'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-[#e8f5e9]'
      case 'progress':
        return 'bg-[#fff3e0]'
      case 'blocked':
        return 'bg-[#ffebee]'
      default:
        return 'bg-[#f5f5f5]'
    }
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-medium text-[#1c1a18]">{monthName}</h3>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors"
            type="button"
          >
            <ChevronLeft className="w-5 h-5 text-[#736c63]" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors"
            type="button"
          >
            <ChevronRight className="w-5 h-5 text-[#736c63]" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-[#e7e1d9] rounded-[12px] overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-[#f5f5f5]">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-[12px] font-semibold text-[#736c63] border-b border-[#e7e1d9]">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: adjustedFirstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-[#fafaf8] border-b border-r border-[#e7e1d9] h-24" />
          ))}

          {/* Days of month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayTasks = getTasksForDay(day)
            const isWeekend = (adjustedFirstDay + i) % 7 > 4

            return (
              <div
                key={day}
                className={`border-b border-r border-[#e7e1d9] p-2 h-24 overflow-hidden ${
                  isWeekend ? 'bg-[#fafaf8]' : 'bg-white'
                }`}
              >
                <div className="text-[12px] font-semibold text-[#1c1a18] mb-1">{day}</div>
                <div className="space-y-1">
                  {dayTasks.slice(0, 2).map((task, idx) => (
                    <div
                      key={idx}
                      className={`text-[10px] px-2 py-1 rounded ${getStatusColor(task.status)} truncate`}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-[10px] text-[#736c63] px-2">+{dayTasks.length - 2} more</div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Empty cells for days after month ends */}
          {Array.from({ length: (42 - adjustedFirstDay - daysInMonth) % 7 }).map((_, i) => (
            <div key={`end-${i}`} className="bg-[#fafaf8] border-b border-r border-[#e7e1d9] h-24" />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-[13px]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#e8f5e9]" />
          <span className="text-[#736c63]">Done</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#fff3e0]" />
          <span className="text-[#736c63]">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#ffebee]" />
          <span className="text-[#736c63]">Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#f5f5f5]" />
          <span className="text-[#736c63]">To Do</span>
        </div>
      </div>
    </div>
  )
}

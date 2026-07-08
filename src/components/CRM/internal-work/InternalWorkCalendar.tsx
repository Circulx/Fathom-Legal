'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react'
import { useInternalWork } from './InternalWorkContext'
import { fmtDate, isOverdue } from './utils'
import type { InternalTask } from './types'

const TASK_TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  client: { bg: '#fdf5f6', text: '#7a1322', border: '#e8d4d9' },
  firm: { bg: '#f5ecdb', text: '#9a6b1f', border: '#e8d9c4' },
  research: { bg: '#e6eef5', text: '#2f5d8a', border: '#d9e3ed' },
  completed: { bg: '#e8f1ea', text: '#3f7a52', border: '#d9e8de' },
  overdue: { bg: '#ffe6e6', text: '#8C3B3B', border: '#ffccc9' },
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

interface CalendarDay {
  date: number
  isCurrentMonth: boolean
  isToday: boolean
  tasks: InternalTask[]
}

export function InternalWorkCalendar() {
  const { tasks } = useInternalWork()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [filterType, setFilterType] = useState<'all' | 'client' | 'firm' | 'everyone'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filterType === 'client' && task.section !== 'client') return false
      if (filterType === 'firm' && task.section !== 'admin') return false
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return task.title.toLowerCase().includes(query) || task.notes?.toLowerCase().includes(query)
      }
      return true
    })
  }, [tasks, filterType, searchQuery])

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days: CalendarDay[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)

      const dayTasks = filteredTasks.filter((task) => {
        const taskDate = new Date(task.due)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate.getTime() === date.getTime()
      })

      days.push({
        date: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.getTime() === today.getTime(),
        tasks: dayTasks,
      })
    }

    return days
  }, [year, month, filteredTasks])

  const monthStats = useMemo(() => {
    const monthTasks = tasks.filter((task) => {
      const taskDate = new Date(task.due)
      return taskDate.getFullYear() === year && taskDate.getMonth() === month
    })
    return {
      total: monthTasks.length,
      client: monthTasks.filter((t) => t.section === 'client').length,
      firm: monthTasks.filter((t) => t.section === 'admin').length,
      completed: monthTasks.filter((t) => t.status === 'done').length,
      overdue: monthTasks.filter((t) => isOverdue(t.due, t.status)).length,
    }
  }, [tasks, year, month])

  const upcomingTasks = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return [...filteredTasks]
      .filter((t) => {
        const taskDate = new Date(t.due)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate >= today
      })
      .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
      .slice(0, 6)
  }, [filteredTasks])

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
      <div className="lg:col-span-3">
        <div className="bg-white border border-[#e7e1d9] rounded-[14px] overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-[#efebe4]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-semibold text-[#736c63] uppercase tracking-wider">Calendar</div>
                <h2 className="text-xl font-medium text-[#1c1a18] mt-1">Deadline calendar</h2>
                <p className="text-sm text-[#736c63] mt-1">
                  Everything due, last cut by date. Client work and firm work side by side — click a day to see or assign what&apos;s due.
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex gap-2 flex-wrap">
                {['All work', 'Client', 'Firm', 'Everyone'].map((label, idx) => (
                  <button
                    key={label}
                    onClick={() => setFilterType(['all', 'client', 'firm', 'everyone'][idx] as any)}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                      filterType === ['all', 'client', 'firm', 'everyone'][idx]
                        ? 'bg-[#1c1a18] text-white'
                        : 'bg-[#efebe4] text-[#736c63] hover:bg-[#e7e1d9]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex-1 min-w-xs">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#736c63]" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 border border-[#e7e1d9] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#7a1322]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="p-5 border-b border-[#efebe4] flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-[#1c1a18]">
                {MONTH_NAMES[month]} {year}
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={goToPrevMonth}
                className="p-2 hover:bg-[#efebe4] rounded transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#736c63]" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-xs font-medium text-[#7a1322] hover:bg-[#fdf5f6] rounded transition-colors"
              >
                Today
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-[#efebe4] rounded transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#736c63]" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-5">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-[#736c63] py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`aspect-square border rounded-lg p-1 text-xs overflow-hidden flex flex-col ${
                    day.isCurrentMonth ? 'bg-white border-[#e7e1d9]' : 'bg-[#fafaf8] border-[#efebe4]'
                  } ${day.isToday ? 'ring-1 ring-[#7a1322] bg-[#fdf5f6]' : ''}`}
                >
                  <div className={`font-medium ${day.isCurrentMonth ? 'text-[#1c1a18]' : 'text-[#c5bfb5]'}`}>
                    {day.date}
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-0.5">
                    {day.tasks.slice(0, 2).map((task, i) => (
                      <div
                        key={i}
                        className="text-[10px] px-1 py-0.5 rounded truncate"
                        style={{
                          backgroundColor: isOverdue(task.due, task.status)
                            ? TASK_TYPE_COLORS.overdue.bg
                            : task.status === 'done'
                              ? TASK_TYPE_COLORS.completed.bg
                              : TASK_TYPE_COLORS[task.section === 'client' ? 'client' : 'firm'].bg,
                          color: isOverdue(task.due, task.status)
                            ? TASK_TYPE_COLORS.overdue.text
                            : task.status === 'done'
                              ? TASK_TYPE_COLORS.completed.text
                              : TASK_TYPE_COLORS[task.section === 'client' ? 'client' : 'firm'].text,
                        }}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                    {day.tasks.length > 2 && (
                      <div className="text-[9px] text-[#736c63] px-1">+{day.tasks.length - 2}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-1 space-y-5">
        {/* Month at a Glance */}
        <div className="bg-white border border-[#e7e1d9] rounded-[14px] p-5">
          <h3 className="font-medium text-[#1c1a18] mb-4">Month at a glance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#736c63]">Total due this month</span>
              <span className="font-semibold text-[#1c1a18]">{monthStats.total}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TASK_TYPE_COLORS.client.text }} />
                <span className="text-xs text-[#736c63]">Client</span>
                <span className="ml-auto font-medium text-sm text-[#1c1a18]">{monthStats.client}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TASK_TYPE_COLORS.firm.text }} />
                <span className="text-xs text-[#736c63]">Firm</span>
                <span className="ml-auto font-medium text-sm text-[#1c1a18]">{monthStats.firm}</span>
              </div>
            </div>
            <div className="border-t border-[#efebe4] pt-3">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-[#736c63]">Completed</span>
                <span className="font-semibold text-[#1c1a18]">{monthStats.completed}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#736c63]">Overdue</span>
                <span className="font-semibold text-[#8C3B3B]">{monthStats.overdue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today & Upcoming */}
        <div className="bg-white border border-[#e7e1d9] rounded-[14px] p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-[#1c1a18]">Today & upcoming</h3>
            <span className="text-xs font-medium text-[#7a1322]">Next 6</span>
          </div>
          <div className="space-y-2">
            {upcomingTasks.length === 0 ? (
              <p className="text-xs text-[#736c63] py-3 text-center">No upcoming tasks</p>
            ) : (
              upcomingTasks.map((task) => (
                <div key={task.id} className="text-xs">
                  <div className="font-medium text-[#1c1a18] truncate">{task.title}</div>
                  <div className="text-[#736c63] text-[10px] mt-0.5">{fmtDate(task.due)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white border border-[#e7e1d9] rounded-[14px] p-5">
          <h3 className="font-medium text-[#1c1a18] mb-3">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: TASK_TYPE_COLORS.client.bg, border: `1px solid ${TASK_TYPE_COLORS.client.border}` }} />
              <span className="text-xs text-[#736c63]">Client · Matter-specific work</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: TASK_TYPE_COLORS.firm.bg, border: `1px solid ${TASK_TYPE_COLORS.firm.border}` }} />
              <span className="text-xs text-[#736c63]">Firm · Practice & firm work</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: TASK_TYPE_COLORS.completed.bg, border: `1px solid ${TASK_TYPE_COLORS.completed.border}` }} />
              <span className="text-xs text-[#736c63]">Completed task</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: TASK_TYPE_COLORS.overdue.bg, border: `1px solid ${TASK_TYPE_COLORS.overdue.border}` }} />
              <span className="text-xs text-[#736c63]">Past due, not done</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

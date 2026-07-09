'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react'
import { useInternalWork } from './InternalWorkContext'
import { fmtDate, isOverdue } from './utils'
import type { InternalTask } from './types'

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
        return task.title.toLowerCase().includes(query) || task.notes.toLowerCase().includes(query)
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }} className="max-lg:grid-cols-1">
      {/* Main Calendar Area */}
      <div style={{ backgroundColor: '#FBF9F4', border: '1px solid #D9D0BC', borderRadius: '3px', boxShadow: '0 1px 2px rgba(34,31,29,0.06), 0 6px 20px rgba(34,31,29,0.05)', overflow: 'hidden' }}>
        {/* Header Section */}
        <div style={{ padding: '22px 24px', borderBottom: '1px solid #D9D0BC' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8C2A2A', fontWeight: '600', marginBottom: '6px' }}>Calendar</div>
              <h2 style={{ fontSize: '28px', fontWeight: '600', margin: '0', color: '#221F1D' }}>Deadline calendar</h2>
              <p style={{ fontSize: '13.5px', color: '#4A4642', marginTop: '6px', maxWidth: '560px', lineHeight: '1.5' }}>
                Everything due, last cut by date. Client work and firm work side by side — click a day to see or assign what&apos;s due.
              </p>
            </div>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 16px', borderRadius: '3px', fontSize: '13px', fontWeight: '600', border: 'none', backgroundColor: '#8C2A2A', color: '#FBF3F1', cursor: 'pointer', flexShrink: 0 }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6E1F1F')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#8C2A2A')}>
              <Plus size={13} />
              New task
            </button>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', border: '1px solid #D9D0BC', borderRadius: '3px', overflow: 'hidden', flex: 'none' }}>
              {['All work', 'Client', 'Firm', 'Everyone'].map((label, idx) => (
                <button
                  key={label}
                  onClick={() => setFilterType(['all', 'client', 'firm', 'everyone'][idx] as any)}
                  style={{
                    padding: '7px 13px',
                    backgroundColor: filterType === ['all', 'client', 'firm', 'everyone'][idx] ? '#221F1D' : '#FBF9F4',
                    border: 'none',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    color: filterType === ['all', 'client', 'firm', 'everyone'][idx] ? '#F4F0E7' : '#4A4642',
                    borderRight: idx < 3 ? '1px solid #D9D0BC' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div style={{ flex: '1', minWidth: '190px', position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#4A4642', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  paddingTop: '7px',
                  paddingBottom: '7px',
                  border: '1px solid #D9D0BC',
                  borderRadius: '3px',
                  backgroundColor: '#FBF9F4',
                  color: '#221F1D',
                  fontSize: '12.5px',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #8C2A2A')}
                onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
              />
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div style={{ padding: '22px 24px', borderBottom: '1px solid #D9D0BC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0', color: '#221F1D', fontFamily: "'Source Serif 4', serif" }}>
            {MONTH_NAMES[month]} {year}
          </h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={goToPrevMonth} style={{ width: '28px', height: '28px', borderRadius: '3px', border: '1px solid #D9D0BC', backgroundColor: '#FBF9F4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A4642', cursor: 'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#4A4642')} onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#D9D0BC')}>
              <ChevronLeft size={13} />
            </button>
            <button onClick={goToToday} style={{ width: 'auto', padding: '0 12px', fontSize: '11.5px', fontWeight: '600', fontFamily: 'inherit', color: '#221F1D', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E3DBC9')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
              Today
            </button>
            <button onClick={goToNextMonth} style={{ width: '28px', height: '28px', borderRadius: '3px', border: '1px solid #D9D0BC', backgroundColor: '#FBF9F4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A4642', cursor: 'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#4A4642')} onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#D9D0BC')}>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div style={{ padding: '22px 24px' }}>
          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#E3DBC9', borderBottom: '1px solid #D9D0BC', marginBottom: '0' }}>
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
              <div key={day} style={{ padding: '9px 0', textAlign: 'center', fontSize: '10.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: '#4A4642' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                style={{
                  minHeight: '104px',
                  borderRight: idx % 7 !== 6 ? '1px solid #D9D0BC' : 'none',
                  borderBottom: '1px solid #D9D0BC',
                  padding: '6px 6px 8px',
                  position: 'relative',
                  cursor: 'pointer',
                  backgroundColor: day.isCurrentMonth ? '#FBF9F4' : '#F1EDE2',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
                onMouseEnter={(e) => {
                  if (e.currentTarget.style.backgroundColor !== '#E3DBC9') e.currentTarget.style.backgroundColor = '#EDE7DA'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = day.isCurrentMonth ? '#FBF9F4' : '#F1EDE2'
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    flexShrink: 0,
                    backgroundColor: day.isToday ? '#8C2A2A' : 'transparent',
                    color: day.isToday ? '#FBF3F1' : day.isCurrentMonth ? '#4A4642' : '#B8AF9C',
                  }}
                >
                  {day.date}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflow: 'hidden', flex: '1' }}>
                  {day.tasks.slice(0, 2).map((task, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: '10.5px',
                        padding: '2.5px 6px',
                        borderRadius: '9px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: '1.5',
                        borderLeft: '2.5px solid transparent',
                        fontWeight: '500',
                        backgroundColor: isOverdue(task.due, task.status)
                          ? '#F1DEDC'
                          : task.status === 'done'
                            ? '#E2E9DF'
                            : task.section === 'client'
                              ? '#F3E4E1'
                              : '#E1E7E9',
                        color: isOverdue(task.due, task.status)
                          ? '#8C3B3B'
                          : task.status === 'done'
                            ? '#4B6650'
                            : task.section === 'client'
                              ? '#6E1F1F'
                              : '#4C5F6B',
                        borderLeftColor: isOverdue(task.due, task.status)
                          ? '#8C3B3B'
                          : task.status === 'done'
                            ? '#4B6650'
                            : task.section === 'client'
                              ? '#8C2A2A'
                              : '#4C5F6B',
                      }}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                  {day.tasks.length > 2 && (
                    <div style={{ fontSize: '10px', color: '#4A4642', padding: '1px 6px' }}>
                      +{day.tasks.length - 2}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Month at a Glance */}
        <div style={{ backgroundColor: '#FBF9F4', border: '1px solid #D9D0BC', borderRadius: '3px', boxShadow: '0 1px 2px rgba(34,31,29,0.06), 0 6px 20px rgba(34,31,29,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '22px 24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px', color: '#221F1D' }}>Month at a glance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '12.5px', paddingBottom: '6px', borderBottom: '1px solid #D9D0BC' }}>
                <span style={{ color: '#4A4642' }}>Total due this month</span>
                <span style={{ fontFamily: "'Source Serif 4', serif", fontWeight: '600', fontSize: '16px', color: '#221F1D' }}>{monthStats.total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '12.5px', paddingBottom: '6px', color: '#8C2A2A' }}>
                <span>Client</span>
                <span style={{ fontFamily: "'Source Serif 4', serif", fontWeight: '600', fontSize: '16px' }}>{monthStats.client}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '12.5px', paddingBottom: '6px', borderBottom: '1px solid #D9D0BC', color: '#4C5F6B' }}>
                <span>Firm</span>
                <span style={{ fontFamily: "'Source Serif 4', serif", fontWeight: '600', fontSize: '16px' }}>{monthStats.firm}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '12.5px', paddingTop: '6px', color: '#4B6650' }}>
                <span>Completed</span>
                <span style={{ fontFamily: "'Source Serif 4', serif", fontWeight: '600', fontSize: '16px' }}>{monthStats.completed}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '12.5px', color: '#8C3B3B', fontWeight: '600' }}>
                <span>Overdue</span>
                <span style={{ fontFamily: "'Source Serif 4', serif", fontWeight: '600', fontSize: '16px' }}>{monthStats.overdue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today & Upcoming */}
        <div style={{ backgroundColor: '#FBF9F4', border: '1px solid #D9D0BC', borderRadius: '3px', boxShadow: '0 1px 2px rgba(34,31,29,0.06), 0 6px 20px rgba(34,31,29,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0', color: '#221F1D' }}>Today & upcoming</h3>
              <span style={{ fontSize: '11.5px', fontWeight: '600', color: '#4A4642' }}>Next 6</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {upcomingTasks.length === 0 ? (
                <p style={{ fontSize: '12.5px', color: '#4A4642', padding: '16px 0', textAlign: 'center' }}>No upcoming tasks</p>
              ) : (
                upcomingTasks.map((task) => (
                  <div key={task.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingBottom: '9px', borderBottom: '1px solid #D9D0BC', cursor: 'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
                    <div style={{ fontSize: '12.5px', fontWeight: '600', lineHeight: '1.35', color: '#221F1D', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                    <div style={{ fontSize: '11px', color: '#4A4642', display: 'flex', justifyContent: 'space-between' }}>{fmtDate(task.due)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ backgroundColor: '#FBF9F4', border: '1px solid #D9D0BC', borderRadius: '3px', boxShadow: '0 1px 2px rgba(34,31,29,0.06), 0 6px 20px rgba(34,31,29,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '22px 24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px', color: '#221F1D' }}>Legend</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#4A4642' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#8C2A2A', flexShrink: 0 }} />
                <span>Client · Matter-specific work</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#4C5F6B', flexShrink: 0 }} />
                <span>Firm · Practice & firm work</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#4B6650', flexShrink: 0 }} />
                <span>Completed task</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#8C3B3B', flexShrink: 0 }} />
                <span>Past due, not done</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

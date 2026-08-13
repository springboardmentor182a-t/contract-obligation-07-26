import { useState, useEffect } from "react";
import "./Calendar.css";
import { MONTH_NAMES, STATUS_COLORS, STATUS_LABELS } from "../data/constants";
import Checkbox from "../components/Form/Checkbox";
import FormSelect from "../components/Form/FormSelect";
import { PlusIcon, ChevLeftIcon, ChevRightSmIcon } from "../components/Icons";
import { getAuthHeaders } from "../utils/auth";

function pad2(n) { return n < 10 ? "0" + n : "" + n; }
function dateKey(y, m, d) { return y + "-" + pad2(m) + "-" + pad2(d); }
function daysInMonth(y, m) { return new Date(y, m, 0).getDate(); }
function formatSelectedDate(key) {
  const d = new Date(key + "T00:00:00");
  return MONTH_NAMES[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}
const TODAY = new Date();
const CAL_TYPES = ["due", "overdue", "ontrack", "renewal"];

export default function Calendar() {
  const [year, setYear] = useState(TODAY.getFullYear());
  const [month, setMonth] = useState(TODAY.getMonth() + 1);
  const [selected, setSelected] = useState(null);
  const [events, setEvents] = useState({});
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState(dateKey(TODAY.getFullYear(), TODAY.getMonth() + 1, TODAY.getDate()));
  const [taskType, setTaskType] = useState("due");
  const [nextId, setNextId] = useState(1);

  // Load upcoming renewals from backend and map them onto calendar
  useEffect(() => {
    async function loadRenewals() {
      try {
        const res = await fetch("/api/renewals/upcoming", {
          headers: getAuthHeaders(),
        });
        if (!res.ok) return;
        const data = await res.json();
        const mapped = {};
        data.forEach((r, idx) => {
          const d = new Date();
          d.setDate(d.getDate() + r.daysLeft);
          const key = dateKey(d.getFullYear(), d.getMonth() + 1, d.getDate());
          if (!mapped[key]) mapped[key] = [];
          mapped[key].push({
            id: 1000 + idx,
            title: `${r.code} — ${r.name}`,
            type: r.daysLeft <= 14 ? "due" : "renewal",
            completed: false,
          });
        });
        setEvents(prev => ({ ...prev, ...mapped }));
        // Start nextId after backend ids
        setNextId(1000 + data.length + 1);
      } catch (err) {
        console.warn("Calendar: renewals API unavailable", err);
      }
    }
    loadRenewals();
  }, []);

  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const totalDays = daysInMonth(year, month);
  const prevMonthDays = month === 1 ? daysInMonth(year - 1, 12) : daysInMonth(year, month - 1);

  let cells = [];
  for (let i = firstWeekday - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, other: true });
  for (let d = 1; d <= totalDays; d++) cells.push({ day: d, other: false, key: dateKey(year, month, d) });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - (firstWeekday + totalDays) + 1, other: true });

  function goPrev() { let m = month - 1, y = year; if (m < 1) { m = 12; y -= 1; } setMonth(m); setYear(y); setSelected(null); }
  function goNext() { let m = month + 1, y = year; if (m > 12) { m = 1; y += 1; } setMonth(m); setYear(y); setSelected(null); }
  function goToday() { setYear(TODAY.getFullYear()); setMonth(TODAY.getMonth() + 1); setSelected(null); }

  function addTask() {
    if (!taskTitle.trim() || !taskDate) return;
    setEvents((prev) => {
      const list = prev[taskDate] ? [...prev[taskDate]] : [];
      list.push({ id: nextId, title: taskTitle.trim(), type: taskType, completed: false });
      return { ...prev, [taskDate]: list };
    });
    setNextId((n) => n + 1);
    const [y, m] = taskDate.split("-").map(Number);
    setYear(y); setMonth(m); setSelected(taskDate);
    setTaskTitle("");
  }

  function toggleTask(key, id) {
    setEvents((prev) => ({
      ...prev,
      [key]: prev[key].map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  }

  const monthKeys = Object.keys(events).filter((k) => {
    const parts = k.split("-").map(Number);
    return parts[0] === year && parts[1] === month;
  });
  const allMonthTasks = monthKeys.flatMap((k) => events[k]);
  const incompleteMonthTasks = allMonthTasks.filter((e) => !e.completed);
  const monthStats = {
    total: allMonthTasks.length,
    overdue: incompleteMonthTasks.filter((e) => e.type === "overdue").length,
    due: incompleteMonthTasks.filter((e) => e.type === "due").length,
    renewal: incompleteMonthTasks.filter((e) => e.type === "renewal").length,
  };

  let upcoming = [];
  Object.keys(events).forEach((k) => {
    if (new Date(k) < TODAY) return;
    events[k].forEach((e) => upcoming.push({ ...e, dateKey: k }));
  });
  upcoming.sort((a, b) => (a.completed === b.completed ? a.dateKey.localeCompare(b.dateKey) : a.completed ? 1 : -1));
  upcoming = upcoming.slice(0, 8);

  const selectedTasks = selected ? events[selected] || [] : null;

  return (
    <div>
      <div className="page-title">Calendar</div>
      <div className="page-sub">Track obligations, renewals, and custom tasks in one place.</div>

      <div className="cal-stats">
        <div className="card cal-stat"><div className="val">{monthStats.total}</div><div className="lbl">Tasks this month</div></div>
        <div className="card cal-stat"><div className="val" style={{ color: "var(--danger)" }}>{monthStats.overdue}</div><div className="lbl">Overdue</div></div>
        <div className="card cal-stat"><div className="val" style={{ color: "var(--warning)" }}>{monthStats.due}</div><div className="lbl">Due soon</div></div>
        <div className="card cal-stat"><div className="val" style={{ color: "var(--info)" }}>{monthStats.renewal}</div><div className="lbl">Renewal windows</div></div>
      </div>

      <div className="cal-header">
        <div className="cal-nav">
          <button className="icon-btn" onClick={goPrev}><ChevLeftIcon /></button>
          <div className="cal-month-label">{MONTH_NAMES[month - 1]} {year}</div>
          <button className="icon-btn" onClick={goNext}><ChevRightSmIcon /></button>
        </div>
        <button className="btn-ghost" onClick={goToday}>Today</button>
        <div className="cal-legend">
          {CAL_TYPES.map((t) => (
            <div className="cal-legend-item" key={t}><span className="dot" style={{ background: STATUS_COLORS[t] }} />{STATUS_LABELS[t]}</div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="card" style={{ padding: 18 }}>
          <div className="cal-dow">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>
          <div className="cal-grid">
            {cells.map((c, idx) => {
              const isWeekend = idx % 7 === 0 || idx % 7 === 6;
              if (c.other) {
                return <div key={idx} className={"cal-day other-month" + (isWeekend ? " weekend" : "")}><span className="cal-daynum">{c.day}</span></div>;
              }
              const isToday = year === TODAY.getFullYear() && month === TODAY.getMonth() + 1 && c.day === TODAY.getDate();
              const isSelected = selected === c.key;
              const dayEvents = events[c.key] || [];
              const shown = dayEvents.slice(0, 4);
              return (
                <button
                  key={idx}
                  className={"cal-day" + (isWeekend ? " weekend" : "") + (isToday ? " today" : "") + (isSelected ? " selected" : "")}
                  onClick={() => setSelected(selected === c.key ? null : c.key)}
                >
                  <span className="cal-daynum">{c.day}{isToday && <em> Today</em>}</span>
                  {dayEvents.length > 0 && (
                    <div className="cal-day-dots">
                      {shown.map((e, i) => (
                        <span key={i} className="dot" style={{ background: e.completed ? "#94A3B8" : STATUS_COLORS[e.type] }} />
                      ))}
                      {dayEvents.length > 4 && <span className="cal-more">+{dayEvents.length - 4}</span>}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: 18, marginBottom: 16 }}>
            <div className="section-title"><PlusIcon size={16} /> Add Task</div>
            <div className="field"><input type="text" placeholder="Task title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} /></div>
            <div className="field-row">
              <div className="field"><input type="date" value={taskDate} onChange={(e) => setTaskDate(e.target.value)} /></div>
              <FormSelect
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                options={[
                  { value: "due", label: "Due Soon" },
                  { value: "overdue", label: "Overdue" },
                  { value: "ontrack", label: "On Track" },
                  { value: "renewal", label: "Renewal Window" },
                ]}
              />
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={addTask}>Add Task</button>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div className="section-title">Upcoming</div>
            {upcoming.length === 0 && <div className="muted" style={{ padding: "16px 0" }}>Nothing scheduled.</div>}
            {upcoming.map((t) => (
              <div className={"task-row" + (t.completed ? " done" : "")} key={t.dateKey + "-" + t.id}>
                <Checkbox variant="check" checked={t.completed} onChange={() => toggleTask(t.dateKey, t.id)} />
                <div className="task-info">
                  <strong>{t.title}</strong>
                  <span>
                    <span className="dot" style={{ background: STATUS_COLORS[t.type] }} />
                    {MONTH_NAMES[new Date(t.dateKey + "T00:00:00").getMonth()].slice(0, 3)} {new Date(t.dateKey + "T00:00:00").getDate()} · {STATUS_LABELS[t.type]}
                  </span>
                </div>
              </div>
            ))}
            {selectedTasks && (
              <>
                <div className="section-title" style={{ marginTop: 20 }}>{formatSelectedDate(selected)}</div>
                {selectedTasks.length === 0 && <div className="muted" style={{ padding: "16px 0" }}>No tasks scheduled this day.</div>}
                {selectedTasks.map((t) => (
                  <div className={"task-row" + (t.completed ? " done" : "")} key={t.id}>
                    <Checkbox variant="check" checked={t.completed} onChange={() => toggleTask(selected, t.id)} />
                    <div className="task-info">
                      <strong>{t.title}</strong>
                      <span><span className="dot" style={{ background: STATUS_COLORS[t.type] }} />{STATUS_LABELS[t.type]}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

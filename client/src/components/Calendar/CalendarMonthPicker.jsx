import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import { getMonthKey } from "../../utils/calendar";

function CalendarMonthPicker({
  activeKey,
  activeLabel,
  onPrev,
  onNext,
  onToday,
  availableMonths = [],
  onSelectMonth,
}) {
  const isCurrentMonth = activeKey === getMonthKey(new Date());

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous month"
          className="grid h-11 w-11 place-items-center border border-black/15 bg-transparent text-black transition hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808] focus-visible:ring-offset-2"
        >
          <FiChevronLeft size={18} aria-hidden="true" />
        </button>
        <h2 className="text-3xl font-black tracking-[-0.045em] sm:text-4xl">
          {activeLabel}
        </h2>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next month"
          className="grid h-11 w-11 place-items-center border border-black/15 bg-transparent text-black transition hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808] focus-visible:ring-offset-2"
        >
          <FiChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 border border-black/15 px-3 py-2 text-xs font-bold uppercase tracking-wide text-black/60">
          <FiCalendar size={13} aria-hidden="true" />
          <span className="sr-only">Jump to month</span>
          <select
            value={activeKey}
            onChange={(event) => onSelectMonth(event.target.value)}
            className="bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
          >
            {availableMonths.map((month) => (
              <option key={month.key} value={month.key}>
                {month.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={onToday}
          disabled={isCurrentMonth}
          className="border border-black/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
        >
          Jump to today
        </button>
      </div>
    </div>
  );
}

export default CalendarMonthPicker;

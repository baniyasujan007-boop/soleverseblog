import { useMemo, useState } from "react";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import CalendarCard from "./CalendarCard";
import CalendarFilters from "./CalendarFilters";
import CalendarMonthPicker from "./CalendarMonthPicker";
import CalendarReleaseChip from "./CalendarReleaseChip";
import {
  CalendarGridSkeleton,
  CalendarMonthSkeleton,
} from "../common/Skeleton/Skeleton";
import {
  WEEKDAYS,
  compareReleaseDate,
  getAvailableCalendarMonths,
  getCalendarBrands,
  getCalendarMonthGrid,
  getCalendarRegions,
  getMonthKey,
  groupCalendarByMonth,
  resolveActiveCalendarMonth,
  shiftCalendarMonth,
} from "../../utils/calendar";

const EMPTY = "";

const FILTER_KEYS = [
  "search",
  "brand",
  "category",
  "type",
  "region",
  "availability",
  "sort",
];

const applyFilters = (releases, filters) => {
  const term = filters.search.trim().toLowerCase();
  return releases.filter((item) => {
    if (filters.brand && item.brand !== filters.brand) return false;
    if (filters.category && item.category !== filters.category) return false;
    if (filters.type && item.releaseType !== filters.type) return false;
    if (filters.region && item.region !== filters.region) return false;
    if (filters.availability && item.availability !== filters.availability) {
      return false;
    }
    if (
      term &&
      ![item.name, item.brand, item.model, item.colorway, item.category, item.region, item.sku, item.releaseType]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    ) {
      return false;
    }
    return true;
  });
};

const sortFiltered = (releases, sort) => {
  const list = [...releases];
  if (sort === "Soonest release") {
    list.sort(compareReleaseDate);
  } else if (sort === "Latest release") {
    list.sort((a, b) => (b.releaseDate ? b.releaseDate.getTime() : -1) - (a.releaseDate ? a.releaseDate.getTime() : -1));
  } else if (sort === "Price: low to high") {
    list.sort((a, b) => (a.retailPrice ?? Number.POSITIVE_INFINITY) - (b.retailPrice ?? Number.POSITIVE_INFINITY));
  } else if (sort === "Price: high to low") {
    list.sort((a, b) => (b.retailPrice ?? -1) - (a.retailPrice ?? -1));
  } else {
    list.sort((a, b) => Number(b.featured) - Number(a.featured) || compareReleaseDate(a, b));
  }
  return list;
};

function CalendarIndex({ releases = [], loading = false, error = "", onRetry }) {
  const [view, setView] = useState("collection");
  const [filters, setFilters] = useState({
    search: EMPTY,
    brand: EMPTY,
    category: EMPTY,
    type: EMPTY,
    region: EMPTY,
    availability: EMPTY,
    sort: EMPTY,
  });
  const [activeKey, setActiveKey] = useState(getMonthKey(new Date()));

  const brands = useMemo(() => getCalendarBrands(releases), [releases]);
  const regions = useMemo(() => getCalendarRegions(releases), [releases]);
  const categories = useMemo(
    () => [...new Set(releases.map((item) => item.category).filter(Boolean))],
    [releases],
  );
  const types = useMemo(
    () => [...new Set(releases.map((item) => item.releaseType).filter(Boolean))],
    [releases],
  );

  const filtered = useMemo(
    () => sortFiltered(applyFilters(releases, filters), filters.sort),
    [releases, filters],
  );

  const availableMonths = useMemo(
    () => getAvailableCalendarMonths(filtered),
    [filtered],
  );

  const resolvedKey = useMemo(
    () => resolveActiveCalendarMonth(activeKey, availableMonths),
    [activeKey, availableMonths],
  );

  const grouped = useMemo(() => groupCalendarByMonth(filtered), [filtered]);

  const gridMonth = useMemo(() => {
    const [year, month] = resolvedKey.split("-").map(Number);
    return getCalendarMonthGrid(year, month - 1);
  }, [resolvedKey]);

  const dayMap = useMemo(() => {
    const map = new Map();
    filtered.forEach((item) => {
      if (!item.releaseDate || item.monthKey !== resolvedKey) return;
      const day = item.releaseDate.getDate();
      if (!map.has(day)) map.set(day, []);
      map.get(day).push(item);
    });
    return map;
  }, [filtered, resolvedKey]);

  const monthItems = useMemo(
    () => filtered.filter((item) => item.monthKey === resolvedKey),
    [filtered, resolvedKey],
  );

  const cells = useMemo(() => {
    const list = [];
    for (let i = 0; i < gridMonth.firstDayOffset; i += 1) list.push(null);
    for (let day = 1; day <= gridMonth.daysInMonth; day += 1) list.push(day);
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [gridMonth]);

  const hasFilters = FILTER_KEYS.some((key) => filters[key] !== EMPTY);

  const changeFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: EMPTY,
      brand: EMPTY,
      category: EMPTY,
      type: EMPTY,
      region: EMPTY,
      availability: EMPTY,
      sort: EMPTY,
    });
  };

  const nextMonthWithReleases = availableMonths.find(
    (month) => month.key > resolvedKey,
  );

  return (
    <div>
      <CalendarFilters
        filters={filters}
        onChange={changeFilter}
        onClear={clearFilters}
        brands={brands}
        categories={categories}
        types={types}
        regions={regions}
        resultCount={filtered.length}
        view={view}
        onViewChange={setView}
        hasFilters={hasFilters}
      />

      <div aria-busy={loading} className="mt-10">
        <p className="sr-only" role="status">
          {loading
            ? "Loading release calendar"
            : error
              ? "Unable to load release calendar"
              : `${filtered.length} releases shown`}
        </p>

        {error ? (
          <div
            role="alert"
            className="border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-xs font-black uppercase tracking-wide text-red-900 underline underline-offset-2 transition hover:opacity-55"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          view === "grid" ? (
            <div className="space-y-6">
              <CalendarMonthSkeleton />
              <CalendarGridSkeleton count={3} />
            </div>
          ) : (
            <CalendarGridSkeleton count={6} />
          )
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <FiCalendar className="mx-auto text-3xl text-black/25" aria-hidden="true" />
            <p className="mt-4 text-lg font-black">
              {hasFilters
                ? "No releases match your filters."
                : "No releases scheduled yet."}
            </p>
            <p className="mt-2 text-sm text-black/55">
              {hasFilters
                ? "Try a different search term or clear the filters."
                : "Upcoming releases will appear here as they are scheduled."}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : view === "grid" ? (
          <div className="space-y-6">
            <CalendarMonthPicker
              activeKey={resolvedKey}
              activeLabel={gridMonth.label}
              onPrev={() => setActiveKey(shiftCalendarMonth(resolvedKey, -1))}
              onNext={() => setActiveKey(shiftCalendarMonth(resolvedKey, 1))}
              onToday={() => setActiveKey(getMonthKey(new Date()))}
              availableMonths={availableMonths}
              onSelectMonth={setActiveKey}
            />
            <div className="overflow-x-auto border border-black/10 bg-white">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">
                  {gridMonth.label} release calendar
                </caption>
                <thead>
                  <tr>
                    {WEEKDAYS.map((day) => (
                      <th
                        key={day}
                        scope="col"
                        className="border-b border-black/10 px-3 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-black/50"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from(
                    { length: cells.length / 7 },
                    (_, rowIndex) => (
                      <tr key={rowIndex}>
                        {cells.slice(rowIndex * 7, rowIndex * 7 + 7).map((day, columnIndex) => {
                          if (day === null) {
                            return (
                              <td
                                key={`empty-${rowIndex}-${columnIndex}`}
                                className="border-b border-r border-black/5 bg-[#fafaf8] p-2"
                              />
                            );
                          }
                          const items = dayMap.get(day) || [];
                          const isToday =
                            gridMonth.year === new Date().getFullYear() &&
                            gridMonth.monthIndex === new Date().getMonth() &&
                            day === new Date().getDate();
                          return (
                            <td
                              key={day}
                              className={`align-top border-b border-r border-black/10 p-2 ${
                                isToday ? "bg-[#eee0c9]/25" : ""
                              }`}
                            >
                              <p
                                className={`text-[11px] font-black tabular-nums ${
                                  items.length > 0
                                    ? "text-black"
                                    : isToday
                                      ? "text-black/60"
                                      : "text-black/25"
                                }`}
                              >
                                {day}
                              </p>
                              <div className="mt-1 space-y-1">
                                {items.slice(0, 3).map((item) => (
                                  <CalendarReleaseChip key={item.id} release={item} />
                                ))}
                                {items.length > 3 && (
                                  <p className="px-1 text-[9px] font-bold uppercase tracking-wide text-black/45">
                                    +{items.length - 3} more
                                  </p>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            {monthItems.length === 0 && (
              <div className="border border-black/10 bg-white px-6 py-10 text-center">
                <p className="text-lg font-black">No releases in {gridMonth.label}.</p>
                {nextMonthWithReleases ? (
                  <>
                    <p className="mt-2 text-sm text-black/55">
                      The next scheduled release month is {nextMonthWithReleases.label}.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveKey(nextMonthWithReleases.key)}
                      className="mt-6 inline-flex items-center gap-2 bg-black px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#eee0c9] hover:text-black"
                    >
                      Jump to {nextMonthWithReleases.label} <FiArrowRight size={14} aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-black/55">
                    No releases match the current filters for this month.
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            {grouped.map((month) => (
              <section key={month.key} aria-labelledby={`month-${month.key}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-black/15 pt-6">
                  <h3
                    id={`month-${month.key}`}
                    className="text-3xl font-black tracking-[-0.045em] sm:text-4xl"
                  >
                    {month.label}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/45">
                    {month.items.length} {month.items.length === 1 ? "release" : "releases"}
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {month.items.map((item) => (
                    <CalendarCard key={item.id} release={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarIndex;

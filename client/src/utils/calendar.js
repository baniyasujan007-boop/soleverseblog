export const CALENDAR_META_FIELDS = {
  brand: "brand",
  model: "model",
  colorway: "colorway",
  category: "category",
  releaseType: "releaseType",
  releaseDate: "releaseDate",
  retailPrice: "retailPrice",
  currency: "currency",
  region: "region",
  sku: "sku",
  availability: "availability",
  description: "description",
  metaTitle: "metaTitle",
  metaDescription: "metaDescription",
};

export const CALENDAR_CATEGORIES = [
  "Lifestyle",
  "Running",
  "Basketball",
  "Skateboarding",
  "Trail / Outdoor",
];

export const RELEASE_TYPES = [
  "General Release",
  "Limited",
  "Exclusive",
  "Restock",
];

export const CALENDAR_REGIONS = [
  "Worldwide",
  "United States",
  "Europe",
  "Asia",
  "Japan",
  "India",
];

export const CALENDAR_AVAILABILITY = ["Upcoming", "Available"];

const CURRENCY_SYMBOLS = { USD: "$", EUR: "€", GBP: "£", JPY: "¥", INR: "₹" };

export const formatCalendarPrice = (value, currency = "USD") => {
  if (value === undefined || value === null || value === "") return "";
  const symbol = CURRENCY_SYMBOLS[currency] || "$";
  const amount = Number.isInteger(value)
    ? value.toLocaleString("en-US")
    : value.toFixed(2);
  return `${symbol}${amount}`;
};

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const parseCalendarDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const pad = (number) => String(number).padStart(2, "0");

export const getMonthKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;

export const getMonthLabel = (date) =>
  date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

export const getShortMonthLabel = (date) =>
  date.toLocaleDateString("en-US", { month: "short" });

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const YEAR_MONTH_PATTERN = /^(\d{4})-(\d{2})$/;

export const getCalendarMonth = (year, monthIndex) => {
  const date = new Date(year, monthIndex, 1);
  return {
    key: getMonthKey(date),
    label: getMonthLabel(date),
    shortLabel: getShortMonthLabel(date),
    year,
    monthIndex,
  };
};

export const shiftCalendarMonth = (key, delta) => {
  const match = String(key).match(YEAR_MONTH_PATTERN);
  if (!match) return key;
  const year = Number(match[1]);
  const month = Number(match[2]);
  return getMonthKey(new Date(year, month - 1 + delta, 1));
};

export const getCalendarMonthGrid = (year, monthIndex) => {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOffset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  return { daysInMonth, firstDayOffset, ...getCalendarMonth(year, monthIndex) };
};

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export const isUpcomingRelease = (date, now = new Date()) =>
  Boolean(date) && date.getTime() >= startOfDay(now);

export const isTodayRelease = (date, now = new Date()) =>
  Boolean(date) && startOfDay(date) === startOfDay(now);

export const compareReleaseDate = (a, b) => {
  const timeA = a.releaseDate ? a.releaseDate.getTime() : Number.POSITIVE_INFINITY;
  const timeB = b.releaseDate ? b.releaseDate.getTime() : Number.POSITIVE_INFINITY;
  return timeA - timeB;
};

export const normalizeCalendar = (item = {}) => {
  const metadata = item.metadata || {};
  const retailPrice = toNumber(metadata[CALENDAR_META_FIELDS.retailPrice]);
  const currency = metadata[CALENDAR_META_FIELDS.currency] || "USD";
  const releaseDate = parseCalendarDate(
    metadata[CALENDAR_META_FIELDS.releaseDate],
  );
  return {
    id: item._id,
    slug: item.slug,
    name: item.title,
    summary: item.summary,
    content: item.content,
    image: item.image,
    featured: Boolean(item.featured),
    brand:
      metadata[CALENDAR_META_FIELDS.brand] || item.category || "SoleVerse",
    model: metadata[CALENDAR_META_FIELDS.model],
    colorway: metadata[CALENDAR_META_FIELDS.colorway],
    category: metadata[CALENDAR_META_FIELDS.category] || "Release",
    releaseType: metadata[CALENDAR_META_FIELDS.releaseType],
    releaseDate,
    releaseDateISO: releaseDate ? releaseDate.toISOString() : null,
    monthKey: releaseDate ? getMonthKey(releaseDate) : null,
    monthLabel: releaseDate ? getMonthLabel(releaseDate) : null,
    monthShortLabel: releaseDate ? getShortMonthLabel(releaseDate) : null,
    retailPrice,
    price:
      retailPrice !== null ? formatCalendarPrice(retailPrice, currency) : "",
    currency,
    region: metadata[CALENDAR_META_FIELDS.region],
    sku: metadata[CALENDAR_META_FIELDS.sku],
    availability: metadata[CALENDAR_META_FIELDS.availability],
    description: metadata[CALENDAR_META_FIELDS.description],
    upcoming: isUpcomingRelease(releaseDate),
    today: isTodayRelease(releaseDate),
    metaTitle: metadata[CALENDAR_META_FIELDS.metaTitle],
    metaDescription: metadata[CALENDAR_META_FIELDS.metaDescription],
  };
};

export const getCalendarBrands = (items = []) =>
  [...new Set(items.map((item) => item.brand).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );

export const getCalendarRegions = (items = []) =>
  [...new Set(items.map((item) => item.region).filter(Boolean))];

export const getAvailableCalendarMonths = (items = []) => {
  const seen = new Map();
  items.forEach((item) => {
    if (!item.releaseDate) return;
    if (!seen.has(item.monthKey)) {
      seen.set(item.monthKey, {
        key: item.monthKey,
        label: item.monthLabel,
      });
    }
  });
  return [...seen.values()].sort((a, b) => a.key.localeCompare(b.key));
};

export const groupCalendarByMonth = (items = []) => {
  const sorted = [...items].filter((item) => item.releaseDate).sort(compareReleaseDate);
  const groups = [];
  const map = new Map();
  sorted.forEach((item) => {
    let group = map.get(item.monthKey);
    if (!group) {
      group = {
        key: item.monthKey,
        label: item.monthLabel,
        shortLabel: item.monthShortLabel,
        year: item.releaseDate.getFullYear(),
        items: [],
      };
      map.set(item.monthKey, group);
      groups.push(group);
    }
    group.items.push(item);
  });
  return groups;
};

export const resolveActiveCalendarMonth = (
  activeKey,
  availableMonths,
  today = new Date(),
) => {
  const todayKey = getMonthKey(today);
  const keys = availableMonths.map((month) => month.key).sort();
  if (activeKey && keys.includes(activeKey)) return activeKey;
  if (keys.length === 0) return todayKey;
  const nextIndex = keys.findIndex((key) => key >= todayKey);
  return keys[Math.max(0, nextIndex === -1 ? keys.length - 1 : nextIndex)];
};

export const getSpotlightRelease = (items = [], now = new Date()) => {
  const upcoming = items
    .filter((item) => item.releaseDate && isUpcomingRelease(item.releaseDate, now))
    .sort(compareReleaseDate);
  if (upcoming.length > 0) return upcoming[0];
  const withDate = items.filter((item) => item.releaseDate).sort(compareReleaseDate);
  return withDate[0] || null;
};

import CalendarCard from "../Calendar/CalendarCard";
import EditorialSection from "../common/EditorialSection/EditorialSection";
import { CalendarGridSkeleton } from "../common/Skeleton/Skeleton";
import { normalizeCalendar } from "../../utils/calendar";

const DEFAULT_COUNT = 3;

function ReleaseCalendar({ releases = [], settings = {}, loading = false }) {
  const count = Number(settings.limit) || DEFAULT_COUNT;
  const items = releases
    .map(normalizeCalendar)
    .filter((release) => release.upcoming)
    .sort(
      (a, b) =>
        (a.releaseDate?.getTime() || 0) - (b.releaseDate?.getTime() || 0),
    )
    .slice(0, count);

  if (loading) {
    return (
      <EditorialSection
        size="tight"
        kicker="Mark your calendar"
        title={settings.title || "Release Calendar"}
        action={settings.buttonText || "Full calendar →"}
        to={settings.buttonUrl || "/calendar"}
      >
        <CalendarGridSkeleton count={count} />
      </EditorialSection>
    );
  }
  if (!items.length) return null;

  return (
    <EditorialSection
      size="tight"
      kicker="Mark your calendar"
      title={settings.title || "Release Calendar"}
      action={settings.buttonText || "Full calendar →"}
      to={settings.buttonUrl || "/calendar"}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((release) => (
          <CalendarCard key={release.id} release={release} />
        ))}
      </div>
    </EditorialSection>
  );
}

export default ReleaseCalendar;

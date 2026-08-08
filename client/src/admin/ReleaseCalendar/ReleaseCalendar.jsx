import ContentManager from "../components/ContentManager";
import { calendarContentSchema } from "./calendarContentSchema";

export default function ReleaseCalendar() {
  return (
    <ContentManager
      type="calendar"
      title="Calendar Events"
      description="Schedule upcoming releases and events."
      contentSchema={calendarContentSchema}
    />
  );
}

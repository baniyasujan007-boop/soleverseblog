import ContentManager from "../components/ContentManager";
import { reviewContentSchema } from "./reviewContentSchema";

export default function Reviews() {
  return (
    <ContentManager
      type="review"
      title="Reviews"
      description="Manage editorial and performance reviews."
      contentSchema={reviewContentSchema}
    />
  );
}

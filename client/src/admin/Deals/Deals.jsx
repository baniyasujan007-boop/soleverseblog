import ContentManager from "../components/ContentManager";
import { dealContentSchema } from "./dealContentSchema";

export default function Deals() {
  return (
    <ContentManager
      type="deal"
      title="Deals"
      description="Publish curated sneaker deals and offers."
      contentSchema={dealContentSchema}
    />
  );
}

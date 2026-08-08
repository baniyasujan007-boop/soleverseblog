import ContentManager from "../components/ContentManager";
import { guideContentSchema } from "./guideContentSchema";

export default function BuyingGuides() {
  return (
    <ContentManager
      type="guide"
      title="Guides"
      description="Create buying guides and sneaker education content."
      contentSchema={guideContentSchema}
    />
  );
}

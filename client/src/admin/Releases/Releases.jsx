import ContentManager from "../components/ContentManager";
import { releaseContentSchema } from "./releaseFormConfig";

export default function Releases() {
  return (
    <ContentManager
      type="release"
      title="Releases"
      description="Publish and schedule sneaker releases."
      contentSchema={releaseContentSchema}
    />
  );
}

import ContentManager from "../components/ContentManager";
import { brandContentSchema } from "./brandContentSchema";

export default function Brands() {
  return (
    <ContentManager
      type="brand"
      title="Brands"
      description="Maintain your sneaker brand directory."
      contentSchema={brandContentSchema}
    />
  );
}

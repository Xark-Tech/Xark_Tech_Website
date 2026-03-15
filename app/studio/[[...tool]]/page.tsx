import { metadata, viewport } from "next-sanity/studio";
import StudioClient from "./StudioClient";

export const dynamic = "force-static";
export { metadata };
export { viewport };

export default function StudioPage() {
  return <StudioClient />;
}

import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/layout/placeholder-page";

export const generateMetadata = () => placeholderMetadata("future");

export default function FuturePage() {
  return <PlaceholderPage section="future" />;
}

import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/layout/placeholder-page";

export const generateMetadata = () => placeholderMetadata("engineering");

export default function EngineeringPage() {
  return <PlaceholderPage section="engineering" />;
}

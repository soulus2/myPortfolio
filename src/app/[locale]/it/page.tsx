import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/layout/placeholder-page";

export const generateMetadata = () => placeholderMetadata("it");

export default function ItPage() {
  return <PlaceholderPage section="it" />;
}

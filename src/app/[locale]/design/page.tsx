import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/layout/placeholder-page";

export const generateMetadata = () => placeholderMetadata("design");

export default function DesignPage() {
  return <PlaceholderPage section="design" />;
}

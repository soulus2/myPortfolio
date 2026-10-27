import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/layout/placeholder-page";

export const generateMetadata = () => placeholderMetadata("about");

export default function AboutPage() {
  return <PlaceholderPage section="about" />;
}

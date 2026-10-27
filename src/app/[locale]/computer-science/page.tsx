import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/layout/placeholder-page";

export const generateMetadata = () => placeholderMetadata("computerScience");

export default function ComputerSciencePage() {
  return <PlaceholderPage section="computerScience" />;
}

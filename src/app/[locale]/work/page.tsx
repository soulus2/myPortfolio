import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/layout/placeholder-page";

export const generateMetadata = () => placeholderMetadata("work");

export default function WorkPage() {
  return <PlaceholderPage section="work" />;
}

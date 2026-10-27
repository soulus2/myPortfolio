import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/layout/placeholder-page";

export const generateMetadata = () => placeholderMetadata("threeD");

export default function ThreeDPage() {
  return <PlaceholderPage section="threeD" />;
}

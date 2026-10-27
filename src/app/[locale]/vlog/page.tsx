import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/layout/placeholder-page";

export const generateMetadata = () => placeholderMetadata("vlog");

export default function VlogPage() {
  return <PlaceholderPage section="vlog" />;
}

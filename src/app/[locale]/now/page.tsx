import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/layout/placeholder-page";

export const generateMetadata = () => placeholderMetadata("now");

export default function NowPage() {
  return <PlaceholderPage section="now" />;
}

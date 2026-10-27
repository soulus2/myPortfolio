import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/layout/placeholder-page";

export const generateMetadata = () => placeholderMetadata("startups");

export default function StartupsPage() {
  return <PlaceholderPage section="startups" />;
}

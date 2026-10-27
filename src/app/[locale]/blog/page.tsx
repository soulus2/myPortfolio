import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/layout/placeholder-page";

export const generateMetadata = () => placeholderMetadata("blog");

export default function BlogPage() {
  return <PlaceholderPage section="blog" />;
}

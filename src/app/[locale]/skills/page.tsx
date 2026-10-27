import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/layout/placeholder-page";

export const generateMetadata = () => placeholderMetadata("skills");

export default function SkillsPage() {
  return <PlaceholderPage section="skills" />;
}

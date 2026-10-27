import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/layout/placeholder-page";

export const generateMetadata = () => placeholderMetadata("contact");

export default function ContactPage() {
  return <PlaceholderPage section="contact" />;
}

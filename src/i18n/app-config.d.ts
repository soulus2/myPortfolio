import type messages from "../messages/en.json";
import type { routing } from "./routing";

// Types next-intl's APIs: locale values and message keys are checked at
// compile time against the English messages file.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}

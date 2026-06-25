import type { Metadata } from "next";
import { PrivacyPage, makeLegalMetadata } from "../_legal-template";

export function generateMetadata(): Metadata {
  return makeLegalMetadata("privacy");
}

export default PrivacyPage;

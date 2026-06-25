import type { Metadata } from "next";
import { TermsPage, makeLegalMetadata } from "../_legal-template";

export function generateMetadata(): Metadata {
  return makeLegalMetadata("terms");
}

export default TermsPage;

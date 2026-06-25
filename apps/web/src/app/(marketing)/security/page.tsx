import type { Metadata } from "next";
import { SecurityPage, makeLegalMetadata } from "../_legal-template";

export function generateMetadata(): Metadata {
  return makeLegalMetadata("security");
}

export default SecurityPage;

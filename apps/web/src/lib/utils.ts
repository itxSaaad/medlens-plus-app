import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { getSiteUrl, getBrandName, getContactEmail, getGithubUrl } from "@/lib/site/env";

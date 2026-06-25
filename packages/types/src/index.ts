export * from "./marketing";

export type ProcessingStatus = "queued" | "processing" | "completed" | "failed";

export interface ReportUpload {
  id: string;
  userId: string;
  fileName: string;
  status: ProcessingStatus;
  createdAt: string;
}

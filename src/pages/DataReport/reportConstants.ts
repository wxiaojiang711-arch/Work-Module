export type Urgency = "normal" | "urgent" | "very_urgent";
export type PendingStatus = "pending" | "urging" | "rejected" | "cancelled";
export type ReviewStatus = "pending_review" | "approved" | "rejected";

export const urgencyMap: Record<Urgency, { label: string; color: string; order: number }> = {
  normal: { label: "普通", color: "default", order: 1 },
  urgent: { label: "紧急", color: "orange", order: 2 },
  very_urgent: { label: "特急", color: "red", order: 3 },
};

export const pendingStatusMap: Record<PendingStatus, { label: string; color: string }> = {
  pending: { label: "待上报", color: "blue" },
  urging: { label: "催办中", color: "red" },
  rejected: { label: "已退回", color: "orange" },
  cancelled: { label: "已撤销", color: "default" },
};

export const reviewStatusMap: Record<ReviewStatus, { label: string; color: string }> = {
  pending_review: { label: "待审核", color: "blue" },
  approved: { label: "已通过", color: "green" },
  rejected: { label: "已退回", color: "red" },
};

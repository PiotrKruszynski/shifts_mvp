import { CheckCircle, Clock, XCircle } from "lucide-react";
import type { LeaveRequestStatus } from "../../../../domain/types";

export const leaveStatusColors: Record<LeaveRequestStatus, string> = {
  SUBMITTED: "bg-amber-100 text-amber-800 border-amber-300",
  APPROVED: "bg-green-100 text-green-800 border-green-300",
  REJECTED: "bg-red-100 text-red-800 border-red-300",
  CANCELLED: "bg-gray-100 text-gray-800 border-gray-300",
};

export const leaveStatusLabels: Record<LeaveRequestStatus, string> = {
  SUBMITTED: "Oczekuje",
  APPROVED: "Zaakceptowany",
  REJECTED: "Odrzucony",
  CANCELLED: "Anulowany",
};

export function leaveStatusIcon(status: LeaveRequestStatus) {
  if (status === "SUBMITTED") return <Clock className="w-5 h-5 text-amber-600" />;
  if (status === "APPROVED") return <CheckCircle className="w-5 h-5 text-green-600" />;
  return <XCircle className="w-5 h-5 text-red-600" />;
}

export function leaveRequestDayCount(dateFrom: string, dateTo: string) {
  return (
    Math.ceil(
      (new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / (1000 * 60 * 60 * 24),
    ) + 1
  );
}

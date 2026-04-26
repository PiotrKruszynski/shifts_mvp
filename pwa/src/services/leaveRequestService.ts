import type { LeaveRequestStatus } from "../domain/types";
import type { LeaveRequestFixture } from "../fixtures/leave-requests.fixture";
import { mockSeed } from "../mocks/seed";
import { mockMutate, mockResolve } from "./mockTransport";

export type LeaveRequestListItem = LeaveRequestFixture;
export type LeaveRequestDecision = "approve" | "reject";

export interface CreateDoctorLeaveRequestInput {
  startDate: string;
  endDate: string;
  typeLabel: string;
  comment: string;
}

export const leaveRequestService = {
  listCoordinatorLeaveRequests(): Promise<LeaveRequestListItem[]> {
    return mockResolve(mockSeed.leaveRequests);
  },

  listDoctorLeaveRequests(): Promise<LeaveRequestListItem[]> {
    return mockResolve(mockSeed.myLeaveRequests);
  },

  createDoctorLeaveRequest(input: CreateDoctorLeaveRequestInput): Promise<LeaveRequestListItem> {
    return mockMutate(() => ({
      request: {
        id: `leave-my-${input.startDate}`,
        scheduleId: mockSeed.doctorCurrentSchedule.id,
        doctorProfileId: "doctor-anna",
        dateFrom: input.startDate,
        dateTo: input.endDate,
        status: "SUBMITTED",
        reason: input.comment,
      },
      doctorName: "Dr Anna Kowalska",
      typeLabel: input.typeLabel,
      submittedAt: "2026-04-26",
    }));
  },

  decideLeaveRequest(
    requests: LeaveRequestListItem[],
    requestId: string,
    decision: LeaveRequestDecision,
    rejectionReason?: string,
  ): Promise<LeaveRequestListItem[]> {
    return mockMutate(() => {
      const nextStatus: LeaveRequestStatus = decision === "approve" ? "APPROVED" : "REJECTED";

      return requests.map((item) =>
        item.request.id === requestId
          ? {
              ...item,
              request: {
                ...item.request,
                status: nextStatus,
                reviewedByUserId: "user-coordinator-jan",
                reviewedAt: "2026-04-26T10:00:00+02:00",
              },
              rejectionReason: decision === "reject" ? rejectionReason : item.rejectionReason,
            }
          : item,
      );
    });
  },
};

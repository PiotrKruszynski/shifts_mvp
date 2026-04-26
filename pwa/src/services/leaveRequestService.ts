import { apiRequest } from "../api/client";
import { shouldUseMockApi } from "../api/config";
import { doctorService } from "./doctorService";
import type { LeaveRequestStatus } from "../domain/types";
import type { LeaveRequestFixture } from "../fixtures/leave-requests.fixture";
import { mockSeed } from "../mocks/seed";
import { mockMutate, mockResolve } from "./mockTransport";

export type LeaveRequestListItem = LeaveRequestFixture;
export type LeaveRequestDecision = "approve" | "reject";
type ApiLeaveRequest = LeaveRequestListItem["request"] & { submittedAt?: string };

export interface CreateDoctorLeaveRequestInput {
  startDate: string;
  endDate: string;
  typeLabel: string;
  comment: string;
}

export const leaveRequestService = {
  async listCoordinatorLeaveRequests(): Promise<LeaveRequestListItem[]> {
    if (!shouldUseMockApi()) {
      const schedule = await apiRequest<{ id: string }>("/schedules/current");
      return apiRequest<{ data: LeaveRequestListItem[] }>(`/schedules/${schedule.id}/leave-requests`).then(
        (response) => response.data,
      );
    }

    return mockResolve(mockSeed.leaveRequests);
  },

  async listDoctorLeaveRequests(): Promise<LeaveRequestListItem[]> {
    if (!shouldUseMockApi()) {
      const [schedule, doctor] = await Promise.all([
        apiRequest<{ id: string }>("/schedules/current"),
        doctorService.getCurrentDoctorContext(),
      ]);
      return apiRequest<{ data: LeaveRequestListItem[] }>(
        `/schedules/${schedule.id}/leave-requests?doctorProfileId=${doctor.doctorProfileId}`,
      ).then((response) => response.data);
    }

    return mockResolve(mockSeed.myLeaveRequests);
  },

  async createDoctorLeaveRequest(input: CreateDoctorLeaveRequestInput): Promise<LeaveRequestListItem> {
    if (!shouldUseMockApi()) {
      const schedule = await apiRequest<{ id: string }>("/schedules/current");
      const request = await apiRequest<ApiLeaveRequest>(`/schedules/${schedule.id}/leave-requests`, {
        method: "POST",
        body: {
          dateFrom: input.startDate,
          dateTo: input.endDate,
          typeLabel: input.typeLabel,
          reason: input.comment,
        },
      });
      return {
        request,
        doctorName: "Ja",
        typeLabel: input.typeLabel,
        submittedAt: request.submittedAt ?? new Date().toISOString().slice(0, 10),
      } as LeaveRequestListItem;
    }

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
    if (!shouldUseMockApi()) {
      const path = decision === "approve" ? "approve" : "reject";
      return apiRequest<LeaveRequestListItem["request"]>(`/leave-requests/${requestId}/${path}`, {
        method: "POST",
        body: { comment: rejectionReason },
      }).then((updated) =>
        requests.map((item) =>
          item.request.id === requestId
            ? {
                ...item,
                request: updated,
                rejectionReason: decision === "reject" ? rejectionReason : item.rejectionReason,
              }
            : item,
        ),
      );
    }

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

import { apiRequest } from "../api/client";
import { shouldUseMockApi } from "../api/config";
import type { SwapRequest } from "../domain/types";
import type { SwapDoctorOptionFixture, SwapShiftOptionFixture } from "../fixtures/swaps.fixture";
import { mockSeed } from "../mocks/seed";
import { mockMutate, mockResolve } from "./mockTransport";

export type SwapShiftOption = SwapShiftOptionFixture;
export type SwapDoctorOption = SwapDoctorOptionFixture;

export interface DoctorSwapFormData {
  enabled: boolean;
  scheduleStatus: "PUBLISHED";
  myShifts: SwapShiftOption[];
  doctors: SwapDoctorOption[];
}

export interface DoctorSwapApprovalData {
  id: string;
  fromDoctor: string;
  myShift: {
    date: string;
    day: string;
    category: string;
  };
  theirShift: {
    date: string;
    day: string;
    category: string;
  };
  requestedAt: string;
  valid: boolean;
  issues: string[];
}

export interface CoordinatorSwapApprovalItem {
  id: string;
  doctorA: string;
  doctorB: string;
  shiftA: string;
  shiftB: string;
  status: "Pending" | "Approved" | "Rejected";
  valid: boolean;
  issues: string[];
  requestedAt: string;
}

export type SwapDecision = "approve" | "reject";

const coordinatorSwapApprovals: CoordinatorSwapApprovalItem[] = [
  {
    id: "swap-approval-1",
    doctorA: "Dr Anna Kowalska",
    doctorB: "Dr Jan Nowak",
    shiftA: "15.05.2026 (Środa)",
    shiftB: "18.05.2026 (Sobota)",
    status: "Pending",
    valid: true,
    issues: [],
    requestedAt: "2026-04-23",
  },
  {
    id: "swap-approval-2",
    doctorA: "Dr Maria Wiśniewska",
    doctorB: "Dr Piotr Zieliński",
    shiftA: "10.05.2026 (Piątek)",
    shiftB: "12.05.2026 (Niedziela)",
    status: "Pending",
    valid: false,
    issues: ["Naruszenie odpoczynku 11h dla Dr Piotr Zieliński"],
    requestedAt: "2026-04-22",
  },
  {
    id: "swap-approval-3",
    doctorA: "Dr Katarzyna Lewandowska",
    doctorB: "Dr Tomasz Kamiński",
    shiftA: "20.05.2026 (Poniedziałek)",
    shiftB: "22.05.2026 (Środa)",
    status: "Pending",
    valid: true,
    issues: [],
    requestedAt: "2026-04-21",
  },
];

const doctorSwapApprovalData: DoctorSwapApprovalData = {
  id: mockSeed.pendingSwap.id,
  fromDoctor: "Dr Jan Nowak",
  myShift: {
    date: "2026-05-01",
    day: "Czwartek",
    category: "Święto Pracy",
  },
  theirShift: {
    date: "2026-05-02",
    day: "Piątek",
    category: "Dzień powszedni",
  },
  requestedAt: "2026-04-25",
  valid: true,
  issues: [],
};

export const swapRequestService = {
  listSwapRequests(): Promise<SwapRequest[]> {
    if (!shouldUseMockApi()) {
      return apiRequest<{ id: string }>("/schedules/current").then((schedule) =>
        apiRequest<{ data: SwapRequest[] }>(`/schedules/${schedule.id}/swap-requests`).then((response) => response.data),
      );
    }

    return mockResolve([mockSeed.pendingSwap]);
  },

  getDoctorSwapFormData(): Promise<DoctorSwapFormData> {
    if (!shouldUseMockApi()) {
      return apiRequest<{ id: string }>("/schedules/current").then((schedule) =>
        apiRequest<DoctorSwapFormData>(`/schedules/${schedule.id}/swap-options`),
      );
    }

    return mockResolve({
      enabled: mockSeed.doctorCurrentSchedule.status === "PUBLISHED",
      scheduleStatus: "PUBLISHED",
      myShifts: mockSeed.mySwapShiftOptions,
      doctors: mockSeed.swapDoctorOptions,
    });
  },

  async createSwapRequest(sourceAssignmentId?: string, targetDoctorId?: string, targetAssignmentId?: string): Promise<SwapRequest> {
    if (!shouldUseMockApi()) {
      const schedule = await apiRequest<{ id: string }>("/schedules/current");
      const options = await apiRequest<DoctorSwapFormData>(`/schedules/${schedule.id}/swap-options`);
      const source = sourceAssignmentId ?? options.myShifts[0]?.assignment.id;
      const targetDoctor = targetDoctorId ?? options.doctors[0]?.id;
      const targetAssignment = targetAssignmentId ?? options.doctors[0]?.shifts[0]?.assignment.id;
      return apiRequest(`/schedules/${schedule.id}/swap-requests`, {
        method: "POST",
        body: {
          sourceAssignmentId: source,
          targetAssignmentId: targetAssignment,
          candidates: [{ doctorProfileId: targetDoctor, assignmentId: targetAssignment }],
        },
      });
    }

    return mockMutate(() => mockSeed.pendingSwap);
  },

  getDoctorSwapApproval(swapRequestId?: string): Promise<DoctorSwapApprovalData | null> {
    if (!shouldUseMockApi()) {
      if (!swapRequestId) {
        return Promise.resolve(null);
      }
      return apiRequest<DoctorSwapApprovalData>(`/swap-requests/${swapRequestId}/doctor-approval-view`).catch(() => null);
    }

    return mockResolve(swapRequestId === mockSeed.pendingSwap.id ? doctorSwapApprovalData : null);
  },

  answerDoctorSwapRequest(swapRequestId: string, decision: SwapDecision): Promise<SwapRequest> {
    if (!shouldUseMockApi()) {
      return apiRequest(`/swap-requests/${swapRequestId}/respond`, {
        method: "POST",
        body: { decision: decision === "approve" ? "ACCEPT" : "REJECT" },
      });
    }

    return mockMutate(() => mockSeed.pendingSwap);
  },

  listCoordinatorSwapApprovals(): Promise<CoordinatorSwapApprovalItem[]> {
    if (!shouldUseMockApi()) {
      return apiRequest<{ id: string }>("/schedules/current").then((schedule) =>
        apiRequest<{ data: CoordinatorSwapApprovalItem[] }>(`/schedules/${schedule.id}/swap-approval-view`).then(
          (response) => response.data,
        ),
      );
    }

    return mockResolve(coordinatorSwapApprovals);
  },

  decideCoordinatorSwap(
    requests: CoordinatorSwapApprovalItem[],
    requestId: string,
    decision: SwapDecision,
  ): Promise<CoordinatorSwapApprovalItem[]> {
    if (!shouldUseMockApi()) {
      const path = decision === "approve" ? "approve" : "reject";
      return apiRequest<SwapRequest>(`/swap-requests/${requestId}/${path}`, {
        method: "POST",
        body: {},
      }).then(() =>
        requests.map((request) =>
          request.id === requestId
            ? { ...request, status: decision === "approve" ? "Approved" : "Rejected" }
            : request,
        ),
      );
    }

    return mockMutate(() =>
      requests.map((request) =>
        request.id === requestId
          ? { ...request, status: decision === "approve" ? "Approved" : "Rejected" }
          : request,
      ),
    );
  },
};

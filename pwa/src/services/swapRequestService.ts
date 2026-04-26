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
    return mockResolve([mockSeed.pendingSwap]);
  },

  getDoctorSwapFormData(): Promise<DoctorSwapFormData> {
    return mockResolve({
      enabled: mockSeed.doctorCurrentSchedule.status === "PUBLISHED",
      scheduleStatus: "PUBLISHED",
      myShifts: mockSeed.mySwapShiftOptions,
      doctors: mockSeed.swapDoctorOptions,
    });
  },

  createSwapRequest(): Promise<SwapRequest> {
    return mockMutate(() => mockSeed.pendingSwap);
  },

  getDoctorSwapApproval(swapRequestId?: string): Promise<DoctorSwapApprovalData | null> {
    return mockResolve(swapRequestId === mockSeed.pendingSwap.id ? doctorSwapApprovalData : null);
  },

  answerDoctorSwapRequest(_swapRequestId: string, _decision: SwapDecision): Promise<SwapRequest> {
    return mockMutate(() => mockSeed.pendingSwap);
  },

  listCoordinatorSwapApprovals(): Promise<CoordinatorSwapApprovalItem[]> {
    return mockResolve(coordinatorSwapApprovals);
  },

  decideCoordinatorSwap(
    requests: CoordinatorSwapApprovalItem[],
    requestId: string,
    decision: SwapDecision,
  ): Promise<CoordinatorSwapApprovalItem[]> {
    return mockMutate(() =>
      requests.map((request) =>
        request.id === requestId
          ? { ...request, status: decision === "approve" ? "Approved" : "Rejected" }
          : request,
      ),
    );
  },
};

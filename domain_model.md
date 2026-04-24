# Domain model — aplikacja do zarządzania dyżurami lekarzy

Źródło: `2026-04-24 project_asumptions.md`.

## Założenie modelu

Model rozdziela `Shift` od `Assignment`, ponieważ dyżur jest trwałą jednostką planowania, a przydział lekarza jest zmianą historyczną i audytowalną. Dzięki temu system może obsługiwać nieobsadzone dyżury, konflikty, zamiany po publikacji oraz historię źródeł przydziału bez nadpisywania faktów domenowych.

---

## 1. Użytkownicy, role i organizacja

| Encja | Opis | Kluczowe pola | Relacje |
|---|---|---|---|
| **User** | Konto użytkownika systemu. | `id`, `email`, `firstName`, `lastName`, `status`, `createdAt`, `lastLoginAt` | Ma jedną lub więcej ról przez `UserRole`. |
| **Role** | Rola systemowa. | `id`, `code`, `name` | `ADMIN`, `COORDINATOR`, `DOCTOR`. |
| **UserRole** | Powiązanie użytkownika z rolą. | `id`, `userId`, `roleId`, `scope`, `assignedAt` | Łączy `User` i `Role`. |
| **Department** | Oddział lub jednostka, dla której tworzony jest grafik. | `id`, `name`, `hospitalName`, `timezone`, `active` | Ma grafiki i aktywnego Koordynatora. |
| **CoordinatorAssignment** | Przypisanie Koordynatora do oddziału. | `id`, `coordinatorUserId`, `departmentId`, `validFrom`, `validTo`, `active` | Jeden aktywny Koordynator dla grafiku oddziału. |
| **DoctorProfile** | Profil lekarza uczestniczącego w grafikach. | `id`, `userId`, `licenseNumber`, `employmentType`, `optOutSigned`, `weeklyHourLimit`, `active` | Należy do `User`; ma kwalifikacje, dostępności i przydziały. |
| **DoctorInvitation** | Zaproszenie lekarza spoza systemu. | `id`, `email`, `departmentId`, `invitedByUserId`, `tokenHash`, `status`, `expiresAt` | Tworzone przez Koordynatora; po akceptacji zakłada `User` / `DoctorProfile`. |
| **Qualification** | Kwalifikacja lub specjalizacja wymagana do obsady dyżuru. | `id`, `code`, `name`, `validityRequired` | Powiązana z lekarzami i dyżurami. |
| **DoctorQualification** | Uprawnienie konkretnego lekarza. | `id`, `doctorProfileId`, `qualificationId`, `validFrom`, `validTo`, `status` | Walidowane podczas generowania, korekt i zamian. |

---

## 2. Grafik i dyżury

| Encja | Opis | Kluczowe pola | Relacje |
|---|---|---|---|
| **Schedule** | Grafik dyżurów dla oddziału i okresu planowania. | `id`, `departmentId`, `coordinatorUserId`, `periodStart`, `periodEnd`, `availabilityDeadline`, `status`, `publishedAt`, `archivedAt` | Ma wiele `Shift`, `Assignment`, `AvailabilityDeclaration`, `GenerationRun`. |
| **ScheduleStatus** | Cykl życia grafiku. | `DRAFT`, `GENERATED`, `PUBLISHED`, `ARCHIVED` | Używany przez `Schedule`. |
| **Shift** | 24-godzinny dyżur w konkretnym dniu. | `id`, `scheduleId`, `date`, `startsAt`, `endsAt`, `requiredQualificationId`, `status` | Należy do `Schedule`; ma maksymalnie jeden aktywny `Assignment`. |
| **ShiftStatus** | Status obsady dyżuru. | `UNASSIGNED`, `ASSIGNED`, `CONFLICTED` | Używany przez `Shift`. |
| **Assignment** | Przydział lekarza do dyżuru. | `id`, `scheduleId`, `shiftId`, `doctorProfileId`, `status`, `source`, `createdAt`, `confirmedAt` | Łączy `DoctorProfile` i `Shift`. |
| **AssignmentStatus** | Status przydziału. | `PROPOSED`, `CONFIRMED`, `REPLACED`, `CANCELLED` | Używany przez `Assignment`. |
| **AssignmentSource** | Źródło przydziału. | `GENERATED`, `MANUAL`, `SWAP` | Używany przez `Assignment`. |

---

## 3. Dostępność, preferencje i urlopy

| Encja | Opis | Kluczowe pola | Relacje |
|---|---|---|---|
| **AvailabilityDeclaration** | Deklaracja dostępności lekarza w ramach danego grafiku. | `id`, `scheduleId`, `doctorProfileId`, `submittedAt`, `lockedAt`, `status` | Ma wiele `AvailabilityDay`. |
| **AvailabilityDay** | Dostępność lekarza dla konkretnej daty. | `id`, `availabilityDeclarationId`, `date`, `availabilityType`, `preferenceCategoryId`, `comment` | Należy do `AvailabilityDeclaration`. |
| **AvailabilityType** | Typ dostępności. | `AVAILABLE`, `UNAVAILABLE`, `PREFERRED`, `NOT_PREFERRED` | Używany przez `AvailabilityDay`. |
| **PreferenceCategory** | Kategoria preferencji dni. | `id`, `code`, `name`, `priority`, `description` | Kategorie I–III. |
| **PreferenceCalendarDay** | Konfiguracja dni należących do kategorii I–III. | `id`, `date`, `categoryId`, `label`, `recurrenceRule` | Używana przez generator. |
| **LeaveRequest** | Wniosek urlopowy lekarza. | `id`, `doctorProfileId`, `scheduleId`, `dateFrom`, `dateTo`, `status`, `reason`, `reviewedByUserId`, `reviewedAt` | Wpływa na dostępność i kwalifikowalność przydziału. |
| **LeaveRequestStatus** | Status urlopu. | `SUBMITTED`, `APPROVED`, `REJECTED`, `CANCELLED` | Używany przez `LeaveRequest`. |

---

## 4. Reguły, walidacja i konflikty

| Encja | Opis | Kluczowe pola | Relacje |
|---|---|---|---|
| **ConstraintRule** | Reguła twarda lub miękka. | `id`, `code`, `name`, `type`, `severity`, `active`, `description` | Używana przez generator i walidator. |
| **ConstraintType** | Typ reguły. | `HARD`, `SOFT` | Używany przez `ConstraintRule`. |
| **ValidationResult** | Wynik walidacji grafiku, korekty lub zamiany. | `id`, `targetType`, `targetId`, `isCompliant`, `validatedAt` | Ma wiele `ConstraintViolation`. |
| **ConstraintViolation** | Konkretne naruszenie reguły. | `id`, `validationResultId`, `constraintRuleId`, `severity`, `message`, `doctorProfileId`, `shiftId` | Wskazuje naruszoną regułę i kontekst. |
| **ConflictReport** | Raport konfliktów po nieudanym generowaniu. | `id`, `scheduleId`, `generationRunId`, `createdAt`, `summary` | Ma wiele `ConflictItem`. |
| **ConflictItem** | Pojedynczy konflikt, np. brak obsady dyżuru. | `id`, `conflictReportId`, `shiftId`, `reasonCode`, `description` | Powiązany z `Shift`, opcjonalnie z lekarzami. |
| **GenerationRun** | Próba wygenerowania grafiku. | `id`, `scheduleId`, `startedByUserId`, `startedAt`, `finishedAt`, `status`, `algorithmVersion` | Tworzy przydziały albo `ConflictReport`. |

---

## 5. Zamiany dyżurów

| Encja | Opis | Kluczowe pola | Relacje |
|---|---|---|---|
| **SwapRequest** | Wniosek o zamianę dyżuru po publikacji grafiku. | `id`, `scheduleId`, `requestingDoctorId`, `sourceAssignmentId`, `targetDoctorId`, `targetAssignmentId`, `status`, `createdAt` | Ma odpowiedzi lekarzy, walidację i decyzję Koordynatora. |
| **SwapRequestStatus** | Status zamiany. | `PENDING_DOCTOR_ACCEPTANCE`, `REJECTED_BY_DOCTOR`, `ACCEPTED_BY_DOCTORS`, `REJECTED_BY_SYSTEM`, `PENDING_COORDINATOR_APPROVAL`, `APPROVED`, `REJECTED_BY_COORDINATOR` | Używany przez `SwapRequest`. |
| **SwapCandidate** | Kandydat do przejęcia lub wymiany dyżuru. | `id`, `swapRequestId`, `doctorProfileId`, `assignmentId`, `responseStatus`, `respondedAt` | Obsługuje wariant „jeden lub kilku, kto pierwszy ten lepszy”. |
| **SwapApproval** | Decyzja Koordynatora dla zamiany. | `id`, `swapRequestId`, `coordinatorUserId`, `decision`, `comment`, `decidedAt` | Finalizuje albo odrzuca zamianę. |

---

## 6. Audyt, powiadomienia i eksport

| Encja | Opis | Kluczowe pola | Relacje |
|---|---|---|---|
| **AuditLogEntry** | Niezmienny zapis operacji. | `id`, `actorUserId`, `actionType`, `entityType`, `entityId`, `timestamp`, `payloadBefore`, `payloadAfter`, `reason` | Dotyczy wszystkich istotnych zmian. |
| **Notification** | Powiadomienie e-mail/push. | `id`, `recipientUserId`, `channel`, `type`, `title`, `body`, `status`, `sentAt` | Tworzone po deadline, publikacji, zamianach i alertach. |
| **CalendarExport** | Eksport/synchronizacja ICS. | `id`, `doctorProfileId`, `scheduleId`, `icsTokenHash`, `enabled`, `lastSyncedAt` | Udostępnia prywatny grafik lekarza. |
| **DashboardMetricSnapshot** | Snapshot metryk dla Koordynatora. | `id`, `scheduleId`, `createdAt`, `metricType`, `value`, `doctorProfileId` | Używany w pulpicie monitoringu. |
| **SystemSetting** | Konfiguracja globalna lub oddziałowa. | `id`, `scope`, `key`, `value`, `updatedByUserId`, `updatedAt` | Zarządzana przez Admina. |

---

## Minimalne kardynalności

```text
Department 1 ── * Schedule
Department 1 ── 1 active CoordinatorAssignment
User 1 ── 0..1 DoctorProfile
User * ── * Role przez UserRole
DoctorProfile * ── * Qualification przez DoctorQualification
Schedule 1 ── * Shift
Schedule 1 ── * Assignment
Shift 1 ── 0..1 active Assignment
DoctorProfile 1 ── * Assignment
DoctorProfile 1 ── * AvailabilityDeclaration
AvailabilityDeclaration 1 ── * AvailabilityDay
Schedule 1 ── * GenerationRun
GenerationRun 0..1 ── 1 ConflictReport
Schedule 1 ── * SwapRequest
SwapRequest 1 ── * SwapCandidate
SwapRequest 0..1 ── 1 SwapApproval
User 1 ── * AuditLogEntry jako actor
```

## Decyzje modelowe

1. `Schedule.status` jest głównym strażnikiem uprawnień i dostępnych akcji.
2. `Shift` reprezentuje obowiązek obsady konkretnego dnia, a `Assignment` reprezentuje historię przypisań.
3. `ConstraintRule`, `ValidationResult` i `ConstraintViolation` powinny być wspólne dla generowania, ręcznej korekty i zamiany.
4. Zamiana po publikacji nie powinna nadpisywać przydziałów bez śladu; stary `Assignment` przechodzi do `REPLACED`, a nowy powstaje ze źródłem `SWAP`.
5. Log audytowy jest append-only i nie powinien mieć operacji biznesowego usuwania.

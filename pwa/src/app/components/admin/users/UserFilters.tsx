import { Search } from "lucide-react";
import type { Role, UserStatus } from "../../../../domain/types";

export type UserRoleFilter = Role | "all";
export type UserStatusFilter = UserStatus | "all";

interface UserFiltersProps {
  filterRole: UserRoleFilter;
  filterStatus: UserStatusFilter;
  onRoleChange: (role: UserRoleFilter) => void;
  onStatusChange: (status: UserStatusFilter) => void;
}

export function UserFilters({
  filterRole,
  filterStatus,
  onRoleChange,
  onStatusChange,
}: UserFiltersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6 p-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj użytkownika..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <select
          value={filterRole}
          onChange={(event) => onRoleChange(event.target.value as UserRoleFilter)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Wszystkie role</option>
          <option value="ADMIN">Admin</option>
          <option value="COORDINATOR">Koordynator</option>
          <option value="DOCTOR">Lekarz</option>
        </select>

        <select
          value={filterStatus}
          onChange={(event) => onStatusChange(event.target.value as UserStatusFilter)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Wszystkie statusy</option>
          <option value="ACTIVE">Aktywny</option>
          <option value="INVITED">Zaproszony</option>
          <option value="DEACTIVATED">Nieaktywny</option>
          <option value="SUSPENDED">Zawieszony</option>
        </select>
      </div>
    </div>
  );
}

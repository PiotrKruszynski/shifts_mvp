import { Search } from "lucide-react";
import type { Role, UserStatus } from "../../../../domain/types";

export type UserRoleFilter = Role | "all";
export type UserStatusFilter = UserStatus | "all";

interface UserFiltersProps {
  searchQuery: string;
  filterRole: UserRoleFilter;
  filterStatus: UserStatusFilter;
  onSearchChange: (query: string) => void;
  onRoleChange: (role: UserRoleFilter) => void;
  onStatusChange: (status: UserStatusFilter) => void;
}

export function UserFilters({
  searchQuery,
  filterRole,
  filterStatus,
  onSearchChange,
  onRoleChange,
  onStatusChange,
}: UserFiltersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6 p-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="user-search" className="mb-2 block text-sm font-medium text-gray-700">
            Szukaj użytkownika
          </label>
          <div className="relative">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="user-search"
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Szukaj użytkownika..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="min-w-[180px]">
          <label htmlFor="user-role-filter" className="mb-2 block text-sm font-medium text-gray-700">
            Rola
          </label>
          <select
            id="user-role-filter"
            value={filterRole}
            onChange={(event) => onRoleChange(event.target.value as UserRoleFilter)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Wszystkie role</option>
            <option value="ADMIN">Admin</option>
            <option value="COORDINATOR">Koordynator</option>
            <option value="DOCTOR">Lekarz</option>
          </select>
        </div>

        <div className="min-w-[180px]">
          <label htmlFor="user-status-filter" className="mb-2 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="user-status-filter"
            value={filterStatus}
            onChange={(event) => onStatusChange(event.target.value as UserStatusFilter)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Wszystkie statusy</option>
            <option value="ACTIVE">Aktywny</option>
            <option value="INVITED">Zaproszony</option>
            <option value="DEACTIVATED">Nieaktywny</option>
            <option value="SUSPENDED">Zawieszony</option>
          </select>
        </div>
      </div>
    </div>
  );
}

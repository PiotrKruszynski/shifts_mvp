import { useState } from "react";
import { UserPlus } from "lucide-react";
import { adminUsersFixture } from "../../../fixtures/users.fixture";
import { AddUserDialog } from "./users/AddUserDialog";
import { UserFilters, type UserRoleFilter, type UserStatusFilter } from "./users/UserFilters";
import { UserStats } from "./users/UserStats";
import { UserTable } from "./users/UserTable";

export function Users() {
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<UserRoleFilter>("all");
  const [filterStatus, setFilterStatus] = useState<UserStatusFilter>("all");

  const filteredUsers = adminUsersFixture.filter(({ user, primaryRole }) => {
    if (filterRole !== "all" && primaryRole !== filterRole) return false;
    if (filterStatus !== "all" && user.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const normalizedFullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const normalizedEmail = user.email.toLowerCase();

      if (!normalizedFullName.includes(normalizedQuery) && !normalizedEmail.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Użytkownicy</h1>
          <p className="text-gray-600 mt-2">Zarządzaj kontami użytkowników systemu</p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
        >
          <UserPlus className="w-5 h-5" />
          Dodaj użytkownika
        </button>
      </div>

      <UserStats users={adminUsersFixture} />
      <UserFilters
        searchQuery={searchQuery}
        filterRole={filterRole}
        filterStatus={filterStatus}
        onSearchChange={setSearchQuery}
        onRoleChange={setFilterRole}
        onStatusChange={setFilterStatus}
      />
      <UserTable users={filteredUsers} />

      {showAddUser && <AddUserDialog onClose={() => setShowAddUser(false)} />}
    </div>
  );
}

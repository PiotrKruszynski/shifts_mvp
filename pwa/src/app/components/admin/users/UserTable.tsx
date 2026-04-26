import { CheckCircle, Mail, XCircle } from "lucide-react";
import type { Role, UserStatus } from "../../../../domain/types";
import type { AdminUserListItem } from "../../../../services/userService";

const roleColors: Record<Role, string> = {
  ADMIN: "bg-purple-100 text-purple-800 border-purple-300",
  COORDINATOR: "bg-blue-100 text-blue-800 border-blue-300",
  DOCTOR: "bg-green-100 text-green-800 border-green-300",
};

const roleLabels: Record<Role, string> = {
  ADMIN: "Admin",
  COORDINATOR: "Koordynator",
  DOCTOR: "Lekarz",
};

const statusLabels: Record<UserStatus, string> = {
  ACTIVE: "Aktywny",
  INVITED: "Zaproszony",
  SUSPENDED: "Zawieszony",
  DEACTIVATED: "Nieaktywny",
};

function statusIcon(status: UserStatus) {
  if (status === "ACTIVE") {
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  }

  if (status === "INVITED") {
    return <Mail className="w-4 h-4 text-amber-600" />;
  }

  return <XCircle className="w-4 h-4 text-red-600" />;
}

interface UserTableProps {
  users: AdminUserListItem[];
}

export function UserTable({ users }: UserTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Użytkownik
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Rola
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Oddział
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Data utworzenia
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Brak użytkowników</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Zmień filtry albo wyszukiwane hasło, aby zobaczyć dopasowane konta.
                  </p>
                </td>
              </tr>
            )}
            {users.map(({ user, primaryRole, departmentName }) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      roleColors[primaryRole]
                    }`}
                  >
                    {roleLabels[primaryRole]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {departmentName || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {statusIcon(user.status)}
                    <span className="text-sm text-gray-900">{statusLabels[user.status]}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.createdAt.slice(0, 10)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    type="button"
                    aria-label={`Edytuj użytkownika ${user.firstName} ${user.lastName}`}
                    className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                  >
                    Edytuj
                  </button>
                  {user.status === "ACTIVE" ? (
                    <button
                      type="button"
                      aria-label={`Dezaktywuj użytkownika ${user.firstName} ${user.lastName}`}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Dezaktywuj
                    </button>
                  ) : (
                    <button
                      type="button"
                      aria-label={`Aktywuj użytkownika ${user.firstName} ${user.lastName}`}
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      Aktywuj
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

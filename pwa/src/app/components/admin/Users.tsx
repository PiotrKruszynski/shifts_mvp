import { useState } from "react";
import { UserPlus, Search, Filter, CheckCircle, XCircle, Mail } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Koordynator" | "Lekarz";
  status: "Active" | "Inactive" | "Invited";
  department?: string;
  createdAt: string;
}

export function Users() {
  const [showAddUser, setShowAddUser] = useState(false);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const users: User[] = [
    {
      id: "1",
      name: "Jan Kowalski",
      email: "j.kowalski@hospital.pl",
      role: "Koordynator",
      status: "Active",
      department: "Oddział Chirurgii",
      createdAt: "2026-01-15",
    },
    {
      id: "2",
      name: "Dr Anna Nowak",
      email: "a.nowak@hospital.pl",
      role: "Lekarz",
      status: "Active",
      department: "Oddział Chirurgii",
      createdAt: "2026-02-10",
    },
    {
      id: "3",
      name: "Dr Maria Wiśniewska",
      email: "m.wisniewska@hospital.pl",
      role: "Lekarz",
      status: "Invited",
      department: "Oddział Chirurgii",
      createdAt: "2026-04-20",
    },
    {
      id: "4",
      name: "Piotr Admin",
      email: "p.admin@hospital.pl",
      role: "Admin",
      status: "Active",
      createdAt: "2025-12-01",
    },
  ];

  const roleColors = {
    Admin: "bg-purple-100 text-purple-800 border-purple-300",
    Koordynator: "bg-blue-100 text-blue-800 border-blue-300",
    Lekarz: "bg-green-100 text-green-800 border-green-300",
  };

  const statusIcons = {
    Active: <CheckCircle className="w-4 h-4 text-green-600" />,
    Inactive: <XCircle className="w-4 h-4 text-red-600" />,
    Invited: <Mail className="w-4 h-4 text-amber-600" />,
  };

  const filteredUsers = users.filter((user) => {
    if (filterRole !== "all" && user.role !== filterRole) return false;
    if (filterStatus !== "all" && user.status !== filterStatus) return false;
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Wszyscy</h3>
            <CheckCircle className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{users.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Aktywni</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {users.filter((u) => u.status === "Active").length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Zaproszeni</h3>
            <Mail className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {users.filter((u) => u.status === "Invited").length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Nieaktywni</h3>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {users.filter((u) => u.status === "Inactive").length}
          </p>
        </div>
      </div>

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
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Wszystkie role</option>
            <option value="Admin">Admin</option>
            <option value="Koordynator">Koordynator</option>
            <option value="Lekarz">Lekarz</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Wszystkie statusy</option>
            <option value="Active">Aktywny</option>
            <option value="Invited">Zaproszony</option>
            <option value="Inactive">Nieaktywny</option>
          </select>
        </div>
      </div>

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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        roleColors[user.role]
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.department || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {statusIcons[user.status]}
                      <span className="text-sm text-gray-900">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">
                      Edytuj
                    </button>
                    {user.status === "Active" ? (
                      <button className="text-red-600 hover:text-red-800 font-medium">
                        Dezaktywuj
                      </button>
                    ) : (
                      <button className="text-green-600 hover:text-green-800 font-medium">
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

      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dodaj użytkownika</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imię i nazwisko
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Jan Kowalski"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="j.kowalski@hospital.pl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rola</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Wybierz rolę</option>
                  <option value="Admin">Admin</option>
                  <option value="Koordynator">Koordynator</option>
                  <option value="Lekarz">Lekarz</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Dodaj użytkownika
              </button>
              <button
                onClick={() => setShowAddUser(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

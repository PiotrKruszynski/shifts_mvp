import { useState } from "react";
import { Users, Mail, UserPlus, UserMinus, CheckCircle, Clock, XCircle } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Invited" | "Inactive";
  qualifications: string[];
  shiftsThisMonth: number;
  availabilitySubmitted: boolean;
}

export function Doctors() {
  const [showAddModal, setShowAddModal] = useState(false);

  const doctors: Doctor[] = [
    {
      id: "1",
      name: "Dr Anna Kowalska",
      email: "a.kowalska@hospital.pl",
      status: "Active",
      qualifications: ["Chirurgia ogólna", "Chirurgia naczyniowa"],
      shiftsThisMonth: 8,
      availabilitySubmitted: true,
    },
    {
      id: "2",
      name: "Dr Jan Nowak",
      email: "j.nowak@hospital.pl",
      status: "Active",
      qualifications: ["Chirurgia ogólna"],
      shiftsThisMonth: 7,
      availabilitySubmitted: true,
    },
    {
      id: "3",
      name: "Dr Maria Wiśniewska",
      email: "m.wisniewska@hospital.pl",
      status: "Invited",
      qualifications: ["Chirurgia ogólna", "Traumatologia"],
      shiftsThisMonth: 0,
      availabilitySubmitted: false,
    },
    {
      id: "4",
      name: "Dr Piotr Zieliński",
      email: "p.zielinski@hospital.pl",
      status: "Active",
      qualifications: ["Chirurgia ogólna"],
      shiftsThisMonth: 9,
      availabilitySubmitted: false,
    },
  ];

  const activeCount = doctors.filter((d) => d.status === "Active").length;
  const invitedCount = doctors.filter((d) => d.status === "Invited").length;
  const submittedCount = doctors.filter((d) => d.availabilitySubmitted).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Lekarze</h1>
          <p className="text-gray-600 mt-2">Zarządzaj lekarzami w oddziale</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <UserPlus className="w-5 h-5" />
          Dodaj lekarza
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Wszyscy lekarze</h3>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{doctors.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Aktywni</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{activeCount}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Zaproszeni</h3>
            <Mail className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{invitedCount}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Dostępność</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {submittedCount}/{doctors.length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Lekarz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Kwalifikacje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Dyżury w maju
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Dostępność
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{doctor.name}</p>
                      <p className="text-sm text-gray-600">{doctor.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doctor.status === "Active" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                        <CheckCircle className="w-3 h-3" />
                        Aktywny
                      </span>
                    )}
                    {doctor.status === "Invited" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
                        <Mail className="w-3 h-3" />
                        Zaproszony
                      </span>
                    )}
                    {doctor.status === "Inactive" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                        <XCircle className="w-3 h-3" />
                        Nieaktywny
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {doctor.qualifications.map((qual, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded"
                        >
                          {qual}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor.shiftsThisMonth}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doctor.availabilitySubmitted ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-600" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">
                      Edytuj
                    </button>
                    {doctor.status === "Invited" && (
                      <button className="text-gray-600 hover:text-gray-800 font-medium">
                        Wyślij ponownie
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dodaj lekarza</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imię i nazwisko
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dr Jan Kowalski"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="j.kowalski@hospital.pl"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Dodaj i wyślij zaproszenie
              </button>
              <button
                onClick={() => setShowAddModal(false)}
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

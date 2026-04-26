import { CheckCircle, Clock, Mail, XCircle } from "lucide-react";
import type { DoctorDirectoryEntry } from "../../../../services/doctorService";

interface DoctorTableProps {
  doctors: DoctorDirectoryEntry[];
}

export function DoctorTable({ doctors }: DoctorTableProps) {
  return (
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
              <tr key={doctor.profile.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      Dr {doctor.user.firstName} {doctor.user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{doctor.user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {doctor.user.status === "ACTIVE" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                      <CheckCircle className="w-3 h-3" />
                      Aktywny
                    </span>
                  )}
                  {doctor.user.status === "INVITED" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
                      <Mail className="w-3 h-3" />
                      Zaproszony
                    </span>
                  )}
                  {(doctor.user.status === "SUSPENDED" || doctor.user.status === "DEACTIVATED") && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                      <XCircle className="w-3 h-3" />
                      Nieaktywny
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {doctor.qualificationNames.map((qualification) => (
                      <span
                        key={qualification}
                        className="whitespace-nowrap px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {qualification}
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
                  {doctor.user.status === "INVITED" && (
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
  );
}

import { CheckCircle, Mail, Users } from "lucide-react";
import type { DoctorDirectoryEntry } from "../../../../services/doctorService";

interface DoctorStatsProps {
  doctors: DoctorDirectoryEntry[];
}

export function DoctorStats({ doctors }: DoctorStatsProps) {
  const activeCount = doctors.filter(({ user }) => user.status === "ACTIVE").length;
  const invitedCount = doctors.filter(({ user }) => user.status === "INVITED").length;
  const submittedCount = doctors.filter((doctor) => doctor.availabilitySubmitted).length;

  return (
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
  );
}

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { doctorService } from "../../../services/doctorService";
import { AddDoctorDialog } from "./doctors/AddDoctorDialog";
import { DoctorStats } from "./doctors/DoctorStats";
import { DoctorTable } from "./doctors/DoctorTable";

export function Doctors() {
  const [showAddModal, setShowAddModal] = useState(false);
  const doctorsState = useAsyncResource(() => doctorService.listDoctorDirectory(), []);

  if (doctorsState.status === "loading") {
    return <div className="p-8 text-gray-600">Ładowanie lekarzy...</div>;
  }

  if (doctorsState.status === "error") {
    return <div className="p-8 text-red-700">{doctorsState.error}</div>;
  }

  const doctors = doctorsState.data;

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

      <DoctorStats doctors={doctors} />
      <DoctorTable doctors={doctors} />

      {showAddModal && <AddDoctorDialog onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

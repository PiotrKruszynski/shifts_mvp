import { useState } from "react";
import { useNavigate } from "react-router";
import { RefreshCw, Calendar, User, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface Shift {
  id: string;
  date: string;
  day: string;
  category: string;
}

interface Doctor {
  id: string;
  name: string;
  shifts: Shift[];
}

export function SwapRequest() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedMyShift, setSelectedMyShift] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedTheirShift, setSelectedTheirShift] = useState<string | null>(null);

  const myShifts: Shift[] = [
    { id: "1", date: "2026-05-01", day: "Czwartek", category: "Święto Pracy" },
    { id: "2", date: "2026-05-08", day: "Piątek", category: "Dzień powszedni" },
    { id: "3", date: "2026-05-16", day: "Sobota", category: "Weekend" },
  ];

  const doctors: Doctor[] = [
    {
      id: "1",
      name: "Dr Jan Nowak",
      shifts: [
        { id: "d1-1", date: "2026-05-02", day: "Piątek", category: "Dzień powszedni" },
        { id: "d1-2", date: "2026-05-18", day: "Niedziela", category: "Weekend" },
      ],
    },
    {
      id: "2",
      name: "Dr Maria Wiśniewska",
      shifts: [
        { id: "d2-1", date: "2026-05-05", day: "Poniedziałek", category: "Dzień powszedni" },
        { id: "d2-2", date: "2026-05-12", day: "Poniedziałek", category: "Dzień powszedni" },
      ],
    },
  ];

  const handleSubmit = () => {
    navigate("/doctor");
  };

  const myShift = myShifts.find((s) => s.id === selectedMyShift);
  const doctor = doctors.find((d) => d.id === selectedDoctor);
  const theirShift = doctor?.shifts.find((s) => s.id === selectedTheirShift);

  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Zamiana dyżuru</h2>
        <p className="text-gray-600 mt-1">Zaproponuj zamianę z innym lekarzem</p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`flex-1 h-1 mx-2 ${step > s ? "bg-blue-600" : "bg-gray-200"}`}></div>
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Krok 1: Wybierz swój dyżur do zamiany</h3>

          <div className="space-y-3">
            {myShifts.map((shift) => (
              <button
                key={shift.id}
                onClick={() => setSelectedMyShift(shift.id)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedMyShift === shift.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{shift.day}</h4>
                    <p className="text-sm text-gray-600 mt-1">{shift.date}</p>
                    <p className="text-sm text-gray-600">{shift.category}</p>
                  </div>
                  {selectedMyShift === shift.id && (
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => navigate("/doctor")}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Wstecz
            </button>
            <button
              disabled={!selectedMyShift}
              onClick={() => setStep(2)}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Dalej
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Krok 2: Wybierz lekarza i jego dyżur</h3>

          <div className="space-y-4">
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                </div>

                <div className="space-y-2">
                  {doc.shifts.map((shift) => (
                    <button
                      key={shift.id}
                      onClick={() => {
                        setSelectedDoctor(doc.id);
                        setSelectedTheirShift(shift.id);
                      }}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedTheirShift === shift.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{shift.day}, {shift.date}</p>
                          <p className="text-sm text-gray-600">{shift.category}</p>
                        </div>
                        {selectedTheirShift === shift.id && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Wstecz
            </button>
            <button
              disabled={!selectedTheirShift}
              onClick={() => setStep(3)}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Dalej
            </button>
          </div>
        </div>
      )}

      {step === 3 && myShift && theirShift && doctor && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Krok 3: Podsumowanie zamiany</h3>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Oddajesz</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-semibold text-gray-900">{myShift.day}</p>
                  <p className="text-sm text-gray-600 mt-1">{myShift.date}</p>
                  <p className="text-xs text-gray-600 mt-1">{myShift.category}</p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="bg-blue-100 rounded-full p-3">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Przejmujesz od {doctor.name}</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="font-semibold text-gray-900">{theirShift.day}</p>
                  <p className="text-sm text-gray-600 mt-1">{theirShift.date}</p>
                  <p className="text-xs text-gray-600 mt-1">{theirShift.category}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Następne kroki</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Propozycja zostanie wysłana do {doctor.name}</li>
              <li>Po akceptacji przez lekarza, zamiana trafi do Koordynatora</li>
              <li>Koordynator dokona końcowej weryfikacji i zatwierdzenia</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Wstecz
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Wyślij propozycję
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

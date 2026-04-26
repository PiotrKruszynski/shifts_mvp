import { useState } from "react";
import { Link } from "react-router";
import { Mail, Calendar, ArrowLeft } from "lucide-react";
import { authService } from "../../../services/authService";

export function ResetPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authService.resetPassword(email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">System Dyżurów</h1>
          <p className="text-gray-600 mt-2">Resetowanie hasła</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!submitted ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Zapomniałeś hasła?</h2>
              <p className="text-gray-600 mb-6">
                Wprowadź swój email, a wyślemy Ci link do resetowania hasła.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="twoj.email@hospital.pl"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Wyślij link resetujący
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sprawdź swoją skrzynkę</h3>
              <p className="text-gray-600 mb-6">
                Wysłaliśmy link do resetowania hasła na adres <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Nie otrzymałeś emaila? Sprawdź folder spam lub spróbuj ponownie.
              </p>
            </div>
          )}

          <Link
            to="/auth/login"
            className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium mt-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Powrót do logowania
          </Link>
        </div>
      </div>
    </div>
  );
}

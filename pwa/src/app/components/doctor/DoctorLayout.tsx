import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Home, Calendar, FileText, RefreshCw, Bell, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";

export function DoctorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/doctor" && location.pathname === "/doctor") return true;
    if (path !== "/doctor" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    navigate("/");
  };

  const navItems = [
    { path: "/doctor", label: "Dashboard", icon: Home },
    { path: "/doctor/availability", label: "Dostępność", icon: Calendar },
    { path: "/doctor/schedule", label: "Mój grafik", icon: Calendar },
    { path: "/doctor/leave-requests", label: "Wnioski urlopowe", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">System Dyżurów</h1>
            <p className="text-sm text-gray-600">Dr Anna Kowalska</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-gray-200 md:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100 ${
                    active ? "bg-blue-50 text-blue-700" : "text-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span>Wyloguj</span>
            </button>
          </nav>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 h-full">
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Wyloguj</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      <nav className="bg-white border-t border-gray-200 sticky bottom-0 md:hidden">
        <div className="flex">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center gap-1 py-3 ${
                  active ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

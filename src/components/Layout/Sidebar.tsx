import { Building2, Users, DollarSign, Calendar, FileCheck, Wrench, FileText, ShieldCheck, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";

const syndicNavigation = [
  { name: "Табло", href: "/", icon: Building2 },
  { name: "Съсобственици", href: "/owners", icon: Users },
  { name: "Финанси", href: "/finances", icon: DollarSign },
  { name: "Общи събрания", href: "/assemblies", icon: Calendar },
  { name: "Пълномощни", href: "/proxies", icon: FileCheck },
  { name: "Поддръжка", href: "/maintenance", icon: Wrench },
  { name: "Документи", href: "/documents", icon: FileText },
  { name: "Подписи", href: "/signatures", icon: ShieldCheck },
];

const coOwnerNavigation = [
  { name: "Табло", href: "/", icon: Building2 },
  { name: "Общи събрания", href: "/assemblies", icon: Calendar },
  { name: "Пълномощни", href: "/proxies", icon: FileCheck },
  { name: "Документи", href: "/documents", icon: FileText },
  { name: "Подписи", href: "/signatures", icon: ShieldCheck },
];

export const Sidebar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const navigation = user?.role === 'syndic' ? syndicNavigation : coOwnerNavigation;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-primary">PropManager</h1>
        <p className="text-sm text-muted-foreground mt-1">Управление на имоти</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary"
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Изход
        </Button>
      </div>
    </aside>
  );
};

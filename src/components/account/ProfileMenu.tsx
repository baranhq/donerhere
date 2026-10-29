import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronDown,
  UserRound,
  Settings,
  ReceiptText,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../../@/components/ui/dropdown-menu";
import { api, useSite } from "../../store/site";
export default function ProfileMenu() {
  const { user, setUser } = useSite();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!user) return null;
  async function logout() {
    setBusy(true);
    setError("");
    try {
      await api("/logout", "POST", {});
      setUser(null);
      navigate("/account");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign out");
      setOpen(true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        openOnHover
        delay={150}
        closeDelay={200}
        aria-label="Account menu, signed in"
        className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-stone-800 hover:bg-orange-100"
      >
        <span className="relative flex size-9 items-center justify-center rounded-full bg-[#f7dac6] text-sm font-bold text-[#9a431c]">
          <UserRound size={22} aria-hidden="true" />
          <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-[#fff7f4] bg-green-600" />
        </span>
        <ChevronDown size={14} aria-hidden="true" className="hidden sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-xl! bg-white! p-2 text-base! shadow-lg"
      >
        <div className="border-b border-stone-100 px-3 py-3">
          <p className="text-xs font-normal text-stone-500">Signed in as</p>
          <strong className="block truncate text-sm">{user.name}</strong>
          <span className="block truncate text-xs font-normal text-stone-500">
            {user.email}
          </span>
        </div>
        <DropdownMenuItem
          className="rounded-md! px-3! py-3! text-sm!"
          onClick={() => navigate("/account")}
        >
          <Settings size={17} />
          Account settings
        </DropdownMenuItem>
        <DropdownMenuItem
          className="rounded-md! px-3! py-3! text-sm!"
          onClick={() => navigate("/orders")}
        >
          <ReceiptText size={17} />
          Past orders
        </DropdownMenuItem>
        {user.role !== "customer" && (
          <DropdownMenuItem
            className="rounded-md! px-3! py-3! text-sm!"
            onClick={() => navigate("/employee")}
          >
            <LayoutDashboard size={17} />
            Store dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="rounded-md! px-3! py-3! text-sm!"
          disabled={busy}
          onClick={() => void logout()}
        >
          <LogOut size={17} />
          {busy ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
        {error && (
          <p role="alert" className="p-3 text-sm text-red-800">
            {error}
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

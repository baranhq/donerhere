import { useState } from "react";
import { ui } from "../styles/ui";
import { useSite } from "../store/site";
import accountLogo from "../assets/logo/donerhere_logo.png";
import AuthForm from "../components/account/AuthForm";
import ProfileCard from "../components/account/ProfileCard";
export default function Account() {
  const { user } = useSite();
  const [register, setRegister] = useState(false);
  if (user)
    return (
      <main className={`${ui.page} max-w-[820px]!`}>
        <header className="mb-7 border-b border-stone-200 pb-5">
          <p className="text-sm text-stone-500">Signed in as {user.email}</p>
          <h1 className="mb-2!">Account settings</h1>
          <p className="text-stone-600">
            Manage your details, password and account.
          </p>
        </header>
        <ProfileCard user={user} />
      </main>
    );
  return (
    <main
      className={`${ui.page} flex min-h-[70vh] w-full flex-col items-center justify-center py-10!`}
    >
      <h1 className="mb-0! text-center">
        {register ? "Create your account" : "Welcome back"}
      </h1>
      <p className="text-center text-[#6e5850]">Sign in to place your order.</p>
      <div className="mt-5 grid w-full max-w-[900px] overflow-hidden rounded-[18px] border border-[#edd8ca] md:grid-cols-2">
        <aside
          className="flex min-h-[130px] items-center justify-center bg-[#ffe9d6] p-6 md:min-h-[360px] md:p-9"
          aria-hidden="true"
        >
          <img
            src={accountLogo}
            alt=""
            className="w-full max-w-60 object-contain md:max-w-[310px]"
          />
        </aside>
        <section className="border-t border-[#edd8ca] bg-[#fffaf6] p-6 md:border-t-0 md:border-l md:p-8">
          <AuthForm onModeChange={setRegister} />
        </section>
      </div>
    </main>
  );
}

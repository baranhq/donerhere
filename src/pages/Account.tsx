import { useEffect, useState } from "react";
import accountLogo from "../assets/logo/donerhere_logo.png";
import { api, useSite } from "../store/site";
import type { Order } from "../store/site";
import AuthForm from "../components/account/AuthForm";
import ProfileCard from "../components/account/ProfileCard";
import OrderList from "../components/account/OrderList";

export default function Account() {
  const { user } = useSite();
  const [register, setRegister] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    if (user)
      api<Order[]>("/orders")
        .then((result) => {
          if (active) setOrders(result);
        })
        .catch((error) => {
          if (active)
            setError(
              error instanceof Error ? error.message : "Unable to load orders",
            );
        });
    else setOrders([]);
    return () => {
      active = false;
    };
  }, [user]);
  return (
    <main className={user ? "page" : "page auth-page"}>
      <h1>
        {user
          ? "My account"
          : register
            ? "Create your account"
            : "Welcome back"}
      </h1>
      {!user && (
        <p className="auth-intro">Sign in to place your collection order.</p>
      )}
      <div className={user ? "two-columns" : "account-form account-scene"}>
        {user ? (
          <ProfileCard user={user} />
        ) : (
          <>
            <aside className="account-meal" aria-hidden="true">
              <img src={accountLogo} alt="" />
            </aside>
            <section className="panel">
              <AuthForm onModeChange={setRegister} />
            </section>
          </>
        )}
        {user && (
          <section>
            <h2>Your orders</h2>
            <p role="alert" className="error">
              {error}
            </p>
            <OrderList orders={orders} />
          </section>
        )}
      </div>
    </main>
  );
}

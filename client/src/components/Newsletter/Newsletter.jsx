import { useState } from "react";
import { FiMail } from "react-icons/fi";
import api from "../../api/axios";

export default function Newsletter({ settings = {} }) {
  const [email, setEmail] = useState(""); const [message, setMessage] = useState("");
  if (!settings.enabled) return null;
  const submit = async (event) => { event.preventDefault(); try { await api.post("/cms/public/subscribe", { email }); setMessage("You’re on the list."); setEmail(""); } catch (error) { setMessage(error.response?.data?.message || "Please try again."); } };
  return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14"><div style={{ backgroundColor: settings.backgroundColor || "#080808", backgroundImage: settings.backgroundImage ? `linear-gradient(rgba(0,0,0,.42),rgba(0,0,0,.42)), url(${settings.backgroundImage})` : undefined }} className="overflow-hidden rounded-3xl bg-cover bg-center p-7 text-white shadow-2xl sm:flex sm:items-center sm:gap-10 sm:p-10"><span className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-red-600 text-3xl sm:mb-0"><FiMail/></span><div className="flex-1"><h2 className="text-3xl font-black tracking-tight">{settings.title || "Stay in the loop"}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{settings.subtitle || "The latest sneaker news, releases, and culture delivered straight to your inbox."}</p></div><form onSubmit={submit} className="mt-6 flex w-full max-w-xl sm:mt-0"><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={settings.placeholder || "Enter your email address"} className="min-w-0 flex-1 rounded-l-xl px-4 py-3 text-sm text-slate-900 outline-none"/><button className="rounded-r-xl bg-red-600 px-5 text-sm font-bold hover:bg-red-700">{settings.buttonText || "Subscribe"}</button></form>{message && <p className="w-full text-sm text-slate-300 sm:w-auto">{message}</p>}</div></section>;
}

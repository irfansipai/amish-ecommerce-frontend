"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await login(email, password);
      // AuthContext handles redirect to /account
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.post("/api/v1/users/", { email, password });
      setMessage("Account created! You can now log in.");
      setPassword("");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = () => {
    toast.info("Social login is currently under construction. Please use email!");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="w-full max-w-md text-center mb-10">
        <h1 className="text-3xl font-light tracking-widest text-zinc-900 uppercase">
          My Account
        </h1>
      </div>

      {/* Main Auth Container */}
      <div className="w-full max-w-md space-y-6">
        {/* SSO Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSocialClick}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-zinc-300 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            CONTINUE WITH GOOGLE
          </button>

          <button
            onClick={handleSocialClick}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-zinc-300 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors"
          >
            <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            CONTINUE WITH FACEBOOK
          </button>
        </div>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-white px-4 text-zinc-500 font-medium">OR</span>
          </div>
        </div>

        {/* Dynamic Auth Tabs */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-100 rounded-none p-1">
            <TabsTrigger value="login" className="rounded-none uppercase tracking-widest text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-none uppercase tracking-widest text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm">
              Create Account
            </TabsTrigger>
          </TabsList>

          {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200">{error}</div>}
          {message && <div className="p-3 mb-4 text-sm text-green-600 bg-green-50 border border-green-200">{message}</div>}

          {/* LOGIN FORM */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email*"
                  required
                  className="w-full px-4 py-3 border border-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password*"
                  required
                  className="w-full px-4 py-3 border border-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 text-white py-4 text-sm font-medium tracking-widest uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Sign In"}
              </button>
            </form>
          </TabsContent>

          {/* SIGNUP FORM */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email*"
                  required
                  className="w-full px-4 py-3 border border-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create Password*"
                  required
                  className="w-full px-4 py-3 border border-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 text-white py-4 text-sm font-medium tracking-widest uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating Profile..." : "Join the Club"}
              </button>
            </form>
          </TabsContent>
        </Tabs>
      </div>

      {/* Value Proposition Footer */}
      <div className="w-full max-w-4xl mt-24 pt-12 border-t border-zinc-200">
        <h3 className="text-center text-lg tracking-widest uppercase mb-12">
          Join Our Club
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wide uppercase">Track Your Orders</h4>
            <p className="text-sm text-zinc-600">Follow your orders every step of the way.</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wide uppercase">Streamline Checkout</h4>
            <p className="text-sm text-zinc-600">Check out faster with saved addresses and payment methods.</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wide uppercase">Exclusive Access</h4>
            <p className="text-sm text-zinc-600">Enjoy priority access to new collections and limited releases.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
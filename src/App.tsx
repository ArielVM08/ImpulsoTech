import { useState } from "react";
import Login from "./components/Login";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";

type Screen = "login" | "onboarding" | "dashboard";

export interface UserProfile {
  name: string;
  role: string;
  area: string;
  goals: string[];
  teamSize: string;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  return (
    <div className="min-h-screen bg-bg font-sans">
      {screen === "login" && (
        <Login onLogin={() => setScreen("onboarding")} />
      )}
      {screen === "onboarding" && (
        <Onboarding
          onComplete={(profile) => {
            setUserProfile(profile);
            setScreen("dashboard");
          }}
        />
      )}
      {screen === "dashboard" && userProfile && (
        <Dashboard
          userProfile={userProfile}
          onLogout={() => {
            setUserProfile(null);
            setScreen("login");
          }}
        />
      )}
    </div>
  );
}

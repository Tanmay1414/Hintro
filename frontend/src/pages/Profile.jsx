import { UserProfile } from "@clerk/clerk-react";
import Navbar from "../components/layout/Navbar";

export default function Profile() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex justify-center items-start pt-10 animated-bg">
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl">
          <UserProfile routing="hash" />
        </div>
      </div>
    </>
  );
}

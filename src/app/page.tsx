"use client"

import { Dashboard } from "@/components/Dashboard/Dashboard";
import Sidebar from "@/components/Sidebar/Sidebar";
import Student from "@/components/Student/Student";
import { usePageStore } from "@/store/pageStore";

export default function Home() {
  const page = usePageStore((state) => state.page); // Retrieve the current page from Zustand store

  return (
    <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
      <Sidebar />

      {page === "dashboard" ? <Dashboard /> : page === "student" ? <Student /> : null}

    </main>
  );
}

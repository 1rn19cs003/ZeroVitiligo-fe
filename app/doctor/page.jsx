import DoctorTable from "./DoctorTable.jsx";
import { redirect } from "next/navigation";

export default async function DoctorPage() {
//   const isLoggedIn = true; // Replace with actual session check
//   if (!isLoggedIn) redirect("/login");

  return (
    <div>
      <DoctorTable />
    </div>
  );
}

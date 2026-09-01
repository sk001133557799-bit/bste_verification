import { redirect } from "next/navigation";

export default function AdminResultsRedirect() {
  redirect("/portal/admin/students");
}

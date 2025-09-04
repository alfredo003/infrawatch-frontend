import { menuItems } from "@/app/dashboard/DashboardLayout";

export default function Panel({ active }: { active: number }) {
  return menuItems[active]?.panel;
}

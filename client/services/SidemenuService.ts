import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  Users,
  Bell
} from "lucide-react";
import type { MenuItem } from "@/types/CommonTypes";

class SidemenuService {
  static getSellerSidemenu(): MenuItem[] {
    const menuItems: MenuItem[] = [
      {
        label: "Dashboards",
        icon: LayoutDashboard,
        path: "/seller/dashboard",
        allowed: ["SELLER"],
        description: "Overview and store insights",
        key: "dashboard",
        id: "0",
      },
      {
        label: "Products",
        icon: Package,
        path: "/seller/products",
        allowed: ["SELLER"],
        description: "Manage your product catalog",
        key: "products",
        id: "1",
      },
      {
        label: "Orders",
        icon: ShoppingCart,
        path: "/seller/orders",
        allowed: ["SELLER"],
        description: "Track and fulfill customer orders",
        key: "orders",
        id: "2",
      },
      {
        label: "Profile",
        icon: Users,
        path: "/seller/profile",
        allowed: ["SELLER"],
        description: "Manage your profile and business details",
        key: "profile",
        id: "3",
      },
    ];

    return menuItems;
  }

  static getSellerSettingsMenu(): MenuItem[] {
    return [
      {
        label: "Store Settings",
        icon: Settings,
        path: "/seller/settings",
        allowed: ["SELLER"],
        key: "settings",
        id: "settings-0",
      },
      {
        label: "Notifications",
        icon: Bell,
        path: "/seller/notifications",
        allowed: ["SELLER"],
        key: "notifications",
        id: "settings-1",
      }
    ];
  }
}

export default SidemenuService;

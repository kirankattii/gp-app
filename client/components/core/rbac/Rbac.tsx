import { useAuthStore } from "@/app/stores/authStore";

interface RbacProps {
  roles?: string[];
  children: React.ReactNode;
  forceDisplay?: boolean;
}

const Rbac = ({
  roles = [],
  children,
  forceDisplay = false,
}: RbacProps) => {
  const { user } = useAuthStore();

  if (forceDisplay || roles.length === 0) {
    return <>{children}</>;
  }

  const userRole = user?.role;

  if (userRole && roles.includes(userRole)) {
    return <>{children}</>;
  }

  return null;
};

export default Rbac;

import { auth } from "@clerk/nextjs";

export const checkRole = () => {
  const { orgRole } = auth();

  if (orgRole === "org:admin") {
    return true;
  } else {
    return false;
  }
};

import { HomeIcon, ShieldCheck, CheckCircle, XCircle } from "lucide-react";
import Index from "./pages/Index.jsx";
import AgeVerification from "./pages/AgeVerification.jsx";
import AgeVerified from "./pages/AgeVerified.jsx";
import AgeNotVerified from "./pages/AgeNotVerified.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Age Verification",
    to: "/age-verification",
    icon: <ShieldCheck className="h-4 w-4" />,
    page: <AgeVerification />,
  },
  {
    title: "Age Verified",
    to: "/age-verified",
    icon: <CheckCircle className="h-4 w-4" />,
    page: <AgeVerified />,
  },
  {
    title: "Age Not Verified",
    to: "/age-not-verified",
    icon: <XCircle className="h-4 w-4" />,
    page: <AgeNotVerified />,
  },
];

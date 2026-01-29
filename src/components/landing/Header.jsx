import { LANDING_NAV_LINKS } from "@/lib/constants";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import AuthButtons from "../AuthButtons";
import MobileNavigation from "../MobileNavigation";
import Logo from "../Logo";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";

function Header() {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between rounded-[360px] bg-[#F0F4FD] px-6 py-4 lg:py-6">
      <Logo />

      {/* DESKTOP NAV */}
      <nav className="hidden lg:block">
        <ul className="flex gap-5 lg:gap-10">
          {LANDING_NAV_LINKS.map((link) => (
            <li key={link.title}>
              {link.title === "Testimonials" ? (
                <NavLink
                  className={`text-[#0D0516] hover:text-[#2F0FD1] hover:underline ${location.hash === link.href.slice(1) && "font-extrabold text-[#2F0FD1]"}`}
                  to={link.href}
                >
                  {link.title}
                </NavLink>
              ) : (
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "font-extrabold text-[#2F0FD1] hover:underline"
                      : "text-[#0D0516] hover:text-[#2F0FD1] hover:underline"
                  }
                  to={link.href}
                >
                  {link.title}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {isAuthenticated ? (
        <Button
          className="hidden lg:flex"
          onClick={() => navigate("/dashboard")}
          variant="secondary"
          size="lg"
        >
          Launch App
        </Button>
      ) : (
        <AuthButtons device="desktop" tag="heading" />
      )}

      {/* MOBILE NAV */}
      <MobileNavigation
        side="right"
        sheetIsOpen={sheetIsOpen}
        setSheetIsOpen={setSheetIsOpen}
        tag="home-page"
      >
        <div className="flex min-h-1/2 flex-col items-center justify-center gap-14 px-4 pt-24">
          <nav>
            <ul className="flex flex-col items-center gap-6">
              {LANDING_NAV_LINKS.map((link) => (
                <li key={link.title}>
                  {link.title === "Testimonials" ? (
                    <NavLink
                      className={`text-[#0D0516] hover:text-[#2F0FD1] hover:underline ${location.hash === link.href.slice(1) && "font-extrabold text-[#2F0FD1]"}`}
                      to={link.href}
                      onClick={() => setSheetIsOpen(false)}
                    >
                      {link.title}
                    </NavLink>
                  ) : (
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? "font-extrabold text-[#2F0FD1] hover:underline"
                          : "text-[#0D0516] hover:text-[#2F0FD1] hover:underline"
                      }
                      to={link.href}
                      onClick={() => setSheetIsOpen(false)}
                    >
                      {link.title}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {isAuthenticated ? (
            <Button
              onClick={() => navigate("/dashboard")}
              variant="secondary"
              size="lg"
            >
              Launch App
            </Button>
          ) : (
            <AuthButtons device="mobile" />
          )}
        </div>
      </MobileNavigation>
    </header>
  );
}

export default Header;

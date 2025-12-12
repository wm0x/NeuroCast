"use client";
import React, { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./resizable-navbar";
import { MdArrowForwardIos } from "react-icons/md"; 
import { CgArrowLongRight } from "react-icons/cg";
import { TextFade } from "../ui/AnimatedContent";

function NavbarDemo() {
  const navItems = [
    {
      name: "Home",
      link: "#",
    },
    {
      name: "Features",
      link: "#",
    },
    {
      name: "FAQ",
      link: "#",
    },
<<<<<<< HEAD
=======
    {
      name: "About Us",
      link: "#",
    },
>>>>>>> master
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="absolute w-full">
      <TextFade direction="down" className="">
        <Navbar>
          <NavBody className="rounded-xl">
            <NavbarLogo />
            <NavItems items={navItems} />
            <div className="flex items-center gap-4" dir="ltr">
              <NavbarButton
                variant="primary"
                className="rounded-lg text-black hover:bg-gray-50 flex gap-1 items-center"
                href="/mahsoob"
              >
                Try Now{" "}
                <CgArrowLongRight className="mt-0.5" />
              </NavbarButton>
            </div>
          </NavBody>

          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </MobileNavHeader>

            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-600 dark:text-neutral-300"
                >
                  <span className="block">{item.name}</span>
                </a>
              ))}
              
              <div className="w-full border border-white/10" />
              
              <div className="flex w-full flex-col gap-4">
                <NavbarButton
                  variant="primary"
                  className="rounded-lg text-black hover:bg-gray-50 flex gap-1 items-center justify-between"
                  href="/mahsoob"
                >
                  Try Now 
                  <MdArrowForwardIos className="mt-0.5" /> 
                </NavbarButton>
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </TextFade>
    </div>
  );
}

export default NavbarDemo;
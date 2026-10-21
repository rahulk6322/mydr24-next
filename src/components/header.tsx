"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { SERVICES, toneClass } from "@/data/services";
import { tr } from "@/i18n/config";
import { Brand } from "./brand";
import { useI18n } from "./i18n-provider";
import { Icon } from "./icons";
import { StoreBadges } from "./store";
import { LangToggle, ThemeToggle } from "./toggles";
import { useUI } from "./ui-context";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
type MenuState = "closed" | "open" | "closing";

export function Header() {
  const pathname = usePathname();
  const { dict, locale } = useI18n();
  const { openSos } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [menu, setMenu] = useState<MenuState>("closed");
  const [menuIn, setMenuIn] = useState(false);
  const megaBtnRef = useRef<HTMLButtonElement>(null);
  const megaItemRef = useRef<HTMLLIElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuCloseRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const finePointer = useRef(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
  const current = (href: string) => (isActive(href) ? ("page" as const) : undefined);
  const talkHref = pathname === "/" ? "/#lead" : "/contact#lead";

  useEffect(() => {
    finePointer.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ----- Full-screen mobile menu ----- */
  const closeMenu = useCallback((restoreFocus = true) => {
    setMenuIn(false);
    setMenu((m) => (m === "closed" ? m : "closing"));
    if (restoreFocus) burgerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (menu === "closing") {
      const t = setTimeout(() => setMenu("closed"), 200);
      return () => clearTimeout(t);
    }
    if (menu !== "open") return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setMenuIn(true));
    });
    menuCloseRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      document.body.style.overflow = "";
    };
  }, [menu]);

  // Close menus on navigation and when resizing up to desktop.
  useEffect(() => {
    setMegaOpen(false);
    closeMenu(false);
  }, [pathname, closeMenu]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && closeMenu(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [closeMenu]);

  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") return closeMenu();
    if (e.key !== "Tab" || !menuRef.current) return;
    const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  /* ----- Mega menu: hover (fine pointers) + click/keyboard ----- */
  useEffect(() => {
    if (!megaOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!megaItemRef.current?.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [megaOpen]);

  const navLinks = [
    { href: "/doctors", label: dict.nav.doctors },
    { href: "/#how", label: dict.nav.how },
    { href: "/about", label: dict.nav.about },
    { href: "/contact", label: dict.nav.contact },
  ];

  return (
    <>
      <a className="skip-link" href="#main">{dict.header.skip}</a>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="container header__inner">
          <Brand id="h" />
          <nav className="nav" aria-label={dict.nav.primary}>
            <ul className="nav__list">
              <li
                className="nav__item"
                ref={megaItemRef}
                onMouseEnter={() => {
                  if (!finePointer.current) return;
                  clearTimeout(hoverTimer.current);
                  setMegaOpen(true);
                }}
                onMouseLeave={() => {
                  if (finePointer.current) hoverTimer.current = setTimeout(() => setMegaOpen(false), 150);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape" && megaOpen) {
                    setMegaOpen(false);
                    megaBtnRef.current?.focus();
                  }
                }}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMegaOpen(false);
                }}
              >
                <button ref={megaBtnRef} className="nav__link" type="button" aria-expanded={megaOpen} aria-controls="mega-services"
                  aria-current={current("/services")} onClick={() => setMegaOpen((o) => !o)}>
                  {dict.nav.services}
                  <Icon name="chevron-down" />
                </button>
                <div className={`mega${megaOpen ? " is-open" : ""}`} id="mega-services">
                  <div className="mega__grid">
                    {SERVICES.map((s) => (
                      <Link key={s.slug} className="mega__link" href={`/services/${s.slug}`} onClick={() => setMegaOpen(false)}>
                        <span className={toneClass(s.tone)}><Icon name={s.icon} /></span>
                        <span>
                          <span className="mega__title">
                            {tr(s.title, locale)}
                            {s.comingSoon && <span className="badge badge--blue">{dict.common.comingSoon}</span>}
                          </span>
                          <span className="mega__desc">{tr(s.short, locale)}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="mega__feature">
                    <span className="badge badge--gold" style={{ justifySelf: "start" }}><Icon name="ambulance" size="sm" /> {dict.mega.goldenBadge}</span>
                    <p className="h4">{dict.mega.goldenTitle}</p>
                    <p className="small muted">{dict.mega.goldenText}</p>
                    <Link className="link small" href="/#golden-hour" onClick={() => setMegaOpen(false)}>{dict.mega.goldenLink}</Link>
                    <Link className="link small" href="/services" onClick={() => setMegaOpen(false)}>{dict.mega.allServices}</Link>
                  </div>
                </div>
              </li>
              {navLinks.map((l) => (
                <li className="nav__item" key={l.href}>
                  <Link className="nav__link" href={l.href} aria-current={l.href.includes("#") ? undefined : current(l.href)}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header__actions">
            <LangToggle />
            <ThemeToggle />
            <Link className="btn btn--primary btn--sm header__cta" href={talkHref}><Icon name="video" />{dict.header.talk}</Link>
            <button className="btn btn--sos btn--sm" type="button" onClick={openSos} aria-haspopup="dialog" aria-label={dict.header.sosLabel}>
              <span className="sos-dot" aria-hidden="true" />SOS
            </button>
            <button ref={burgerRef} className="icon-btn header__burger" type="button" onClick={() => setMenu("open")}
              aria-label={dict.header.openMenu} aria-expanded={menu === "open"} aria-controls="mobile-menu">
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>

      <div ref={menuRef} id="mobile-menu" className={`mobile-menu${menuIn ? " is-open" : ""}`} role="dialog" aria-modal="true"
        aria-label={dict.header.menu} hidden={menu === "closed"} onKeyDown={onMenuKeyDown}>
        <div className="mobile-menu__top">
          <Brand id="m" onClick={() => closeMenu(false)} />
          <button ref={menuCloseRef} className="icon-btn" type="button" onClick={() => closeMenu()} aria-label={dict.header.closeMenu}><Icon name="close" /></button>
        </div>
        <ul className="mobile-menu__list">
          <li><Link className="mobile-menu__link" href="/" aria-current={current("/")} onClick={() => closeMenu(false)}>{dict.nav.home} <Icon name="arrow-right" /></Link></li>
          <li>
            <Link className="mobile-menu__link" href="/services" aria-current={current("/services")} onClick={() => closeMenu(false)}>{dict.nav.services} <Icon name="arrow-right" /></Link>
            <div className="mobile-menu__sub">
              {SERVICES.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} onClick={() => closeMenu(false)}>
                  <Icon name={s.icon} size="sm" /> {tr(s.title, locale)}
                  {s.comingSoon && <span className="badge badge--blue">{dict.common.soon}</span>}
                </Link>
              ))}
            </div>
          </li>
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link className="mobile-menu__link" href={l.href} aria-current={l.href.includes("#") ? undefined : current(l.href)} onClick={() => closeMenu(false)}>
                {l.label} <Icon name="arrow-right" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mobile-menu__foot">
          <Link className="btn btn--primary btn--block" href={talkHref} onClick={() => closeMenu(false)}><Icon name="video" />{dict.hero.ctaPrimary}</Link>
          <div className="cluster" style={{ gap: 12 }}>
            <LangToggle long className="btn btn--secondary" />
            <ThemeToggle withLabel className="btn btn--secondary" />
          </div>
          <StoreBadges />
        </div>
      </div>
    </>
  );
}

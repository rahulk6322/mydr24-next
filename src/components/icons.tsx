// MyDR24 icon set — 24px grid, 1.75 stroke, round caps & joins (styled by .icon in components.css).
// Path data is static and trusted, so it is injected as markup.
const ICONS = {
    phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>',
    stethoscope: '<path d="M5 3H4v5a5 5 0 0 0 10 0V3h-1"/><path d="M9 13v1a5 5 0 0 0 10 0v-2"/><circle cx="19" cy="10" r="2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17h2"/>',
    ambulance: '<path d="M3 17V7a1 1 0 0 1 1-1h10v11"/><path d="M14 10h4l3 3v4h-2"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/><path d="M9 17h6M8 9v4M6 11h4"/>',
    "heart-pulse": '<path d="M20.8 8.6A5 5 0 0 0 12 5.5a5 5 0 0 0-8.8 3.1c0 5.4 8.8 10.9 8.8 10.9s8.8-5.5 8.8-10.9z"/><path d="M3.5 12h4l1.5-3 3 6 1.5-3h7"/>',
    "shield-check": '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    doctor: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/><path d="M12 15.5v4M10 17.5h4"/>',
    "home-care": '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M12 17.5s-3-1.8-3-3.8a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 2-3 3.8-3 3.8z"/>',
    elderly: '<circle cx="10" cy="4.5" r="2"/><path d="M10 7.5c-1.5 0-3 1.4-3 3.5v3l-1.5 7"/><path d="M8 14l3 2 1 5"/><path d="M10 9l3 3h3"/><path d="M17 12v9"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M6 10h3l1.5-3 3 6 1.5-3h3"/><path d="M8 20h8M12 16v4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "map-pin": '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    language: '<path d="M4 5h9M8.5 3v2M6 5c0 4 3 7 6 8M11 5c0 4-3 7-6 8"/><path d="M13 21l4-9 4 9M14.5 18h5"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    hospital: '<path d="M4 21V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v16"/><path d="M2 21h20M12 7v6M9 10h6M10 21v-4h4v4"/>',
    activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    alert: '<path d="M12 3.5l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    "check-circle": '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/>',
    "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "chevron-down": '<path d="M6 9l6 6 6-6"/>',
    "chevron-left": '<path d="M15 6l-6 6 6 6"/>',
    "chevron-right": '<path d="M9 6l6 6-6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14.5v2"/>',
    star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    pill: '<path d="M10.5 3.5a5 5 0 0 1 7 7l-7 7a5 5 0 0 1-7-7z"/><path d="M7 7l7 7"/>',
    "id-card": '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16a3 3 0 0 1 6 0M14 10h4M14 13h4"/>',
    network: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5M12 12l-5.5 5.5M12 12l5.5 5.5"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
    signal: '<path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0"/><path d="M12 19h.01"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>',
    rupee: '<path d="M7 4h10M7 8.5h10M7 4h3a4.5 4.5 0 0 1 0 9H7l7 7"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    play: '<path d="M5 3.8v16.4a.8.8 0 0 0 1.2.7l14-8.2a.8.8 0 0 0 0-1.4l-14-8.2A.8.8 0 0 0 5 3.8z"/><path d="M5.3 3.5L15 13M5.3 20.5L15 11"/>',
    apple: '<path d="M15.5 3c0 1.8-1.4 3.4-3.2 3.4"/><path d="M12 7.6c-.9-.5-1.9-.9-2.9-.9C6.6 6.7 5 9 5 12c0 4 2.5 9 5 9 1 0 1.5-.5 2-.5s1 .5 2 .5c2.1 0 4.2-3.5 4.8-7-1.6-.6-2.6-2-2.6-3.7 0-1.4.8-2.7 2-3.3-.8-.9-2-1.3-3.2-1.3-1 0-2 .4-3 .9z"/>',
    whatsapp: '<path d="M4 20l1.2-4A8 8 0 1 1 8 18.8z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2z"/>'
} as const;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

type IconProps = {
  name: IconName;
  size?: "sm" | "lg";
  className?: string;
  /** Accessible label. Omit for decorative icons (default). */
  label?: string;
};

export function Icon({ name, size, className, label }: IconProps) {
  const cls = ["icon", size ? `icon--${size}` : "", className ?? ""].filter(Boolean).join(" ");
  return (
    <svg
      className={cls}
      viewBox="0 0 24 24"
      focusable="false"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}

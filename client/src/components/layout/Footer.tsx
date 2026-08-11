import Link from "next/link";
import { PartyPopper, Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from "@/components/layout/SocialIcons";

const FOOTER_LINKS = [
  {
    title: "Explore",
    links: [
      { href: "/events", label: "Browse Events" },
      { href: "/events?featured=true", label: "Featured Events" },
      { href: "/blog", label: "Blog" },
      { href: "/about", label: "About Us" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/help", label: "Help & Support" },
      { href: "/contact", label: "Contact Us" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/privacy#terms", label: "Terms of Service" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log In" },
      { href: "/register", label: "Sign Up" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/my-bookings", label: "My Bookings" },
    ],
  },
];

const SOCIALS = [
  { href: "https://facebook.com", icon: FacebookIcon, label: "Facebook" },
  { href: "https://twitter.com", icon: TwitterIcon, label: "Twitter" },
  { href: "https://instagram.com", icon: InstagramIcon, label: "Instagram" },
  { href: "https://youtube.com", icon: YoutubeIcon, label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
                <PartyPopper className="h-5 w-5" />
              </span>
              <span className="text-lg">Novi</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-foreground-muted">
              Discover, book, and host unforgettable events — from intimate workshops to citywide festivals.
            </p>
            <div className="mt-4 space-y-2 text-sm text-foreground-muted">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" /> 148 Market Street, San Francisco, CA
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" /> hello@novi.events
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" /> +1 (555) 010-2938
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground-muted hover:bg-surface hover:text-primary-600"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-foreground-muted hover:text-primary-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-foreground-muted sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Novi Events, Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary-600">
              Privacy
            </Link>
            <Link href="/privacy#terms" className="hover:text-primary-600">
              Terms
            </Link>
            <Link href="/help" className="hover:text-primary-600">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

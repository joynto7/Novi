const PRIVACY_SECTIONS = [
  {
    title: "Information we collect",
    body: "We collect information you provide directly, such as your name, email, and profile details when you create an account, along with booking history and reviews you submit.",
  },
  {
    title: "How we use your information",
    body: "We use your information to process bookings, send booking confirmations, personalize event recommendations, and improve the Novi platform.",
  },
  {
    title: "Data sharing",
    body: "We share booking details with the event organizer so they can manage attendance. We do not sell your personal information to third parties.",
  },
  {
    title: "Data security",
    body: "Passwords are hashed and never stored in plain text. Access to your account is protected by session-based authentication over encrypted connections.",
  },
  {
    title: "Your choices",
    body: "You can update or delete your profile information at any time from your Dashboard. Contact us if you'd like your account fully removed from Novi.",
  },
];

const TERMS_SECTIONS = [
  {
    title: "Using Novi",
    body: "By creating an account, you agree to provide accurate information and to use the platform only for lawful event discovery, booking, and hosting activities.",
  },
  {
    title: "Bookings",
    body: "Completing a booking reserves your spot subject to the event organizer's own terms, including any cancellation or refund policies listed on the event page.",
  },
  {
    title: "Organizer responsibilities",
    body: "Organizers are responsible for the accuracy of their event listings and for honoring the bookings made through the platform.",
  },
  {
    title: "Account termination",
    body: "We may suspend accounts that violate these terms, including fraudulent bookings or abusive behavior toward other users.",
  },
  {
    title: "Changes to these terms",
    body: "We may update these terms occasionally. Continued use of Novi after changes take effect constitutes acceptance of the updated terms.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Privacy & Terms</h1>
        <p className="mt-3 text-foreground-muted">Last updated August 2026</p>
      </div>

      <section id="privacy" className="scroll-mt-24">
        <h2 className="mb-6 text-2xl font-bold text-foreground">Privacy Policy</h2>
        <div className="space-y-6">
          {PRIVACY_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-base font-semibold text-foreground">{section.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">{section.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="terms" className="mt-16 scroll-mt-24">
        <h2 className="mb-6 text-2xl font-bold text-foreground">Terms of Service</h2>
        <div className="space-y-6">
          {TERMS_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-base font-semibold text-foreground">{section.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

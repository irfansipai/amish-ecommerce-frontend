export default function CookiePolicyPage() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "MAISON";

  return (
    <div className="max-w-3xl mx-auto px-6 py-24 md:py-32 space-y-12 text-black">
      <div className="text-center mb-16">
        <h1 className="text-2xl md:text-3xl font-serif font-light tracking-[0.2em] uppercase mb-4">
          Cookie Policy
        </h1>
        <p className="text-xs text-neutral-500 tracking-widest uppercase">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-[0.15em] uppercase">1. What Are Cookies</h2>
        <p className="text-sm text-neutral-600 leading-relaxed font-light">
          Cookies are small text files stored on your device when you visit our website. {companyName} uses cookies to ensure the basic functionality of the platform and to enhance your online experience.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-[0.15em] uppercase">2. How We Use Them</h2>
        <p className="text-sm text-neutral-600 leading-relaxed font-light">
          <strong>Essential Cookies:</strong> These are required for the website to function properly, such as maintaining your shopping bag and secure login sessions.<br /><br />
          <strong>Analytics Cookies:</strong> These help us understand how visitors interact with our site, allowing {companyName} to improve our design and functionality.<br /><br />
          <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track the effectiveness of our campaigns.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-[0.15em] uppercase">3. Managing Preferences</h2>
        <p className="text-sm text-neutral-600 leading-relaxed font-light">
          You can control and/or delete cookies as you wish through your browser settings. Please note that disabling certain cookies may impact the functionality of the {companyName} website.
        </p>
      </section>
    </div>
  );
}
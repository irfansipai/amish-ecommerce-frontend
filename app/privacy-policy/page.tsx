export default function PrivacyPolicyPage() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "MAISON";

  return (
    <div className="max-w-3xl mx-auto px-6 py-24 md:py-32 space-y-12 text-black">
      <div className="text-center mb-16">
        <h1 className="text-2xl md:text-3xl font-serif font-light tracking-[0.2em] uppercase mb-4">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500 tracking-widest uppercase">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-[0.15em] uppercase">1. Information Collection</h2>
        <p className="text-sm text-neutral-600 leading-relaxed font-light">
          Welcome to {companyName}. We respect your privacy and are committed to protecting your personal data. We collect information you provide directly to us, such as when you create an account, make a purchase, or contact our client services. This includes your name, email address, shipping address, and payment information.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-[0.15em] uppercase">2. Use of Data</h2>
        <p className="text-sm text-neutral-600 leading-relaxed font-light">
          {companyName} utilizes your data to process transactions, deliver products, and provide you with an elevated shopping experience. We may also use your information to send you updates about new collections or exclusive events, provided you have opted in to our communications.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-[0.15em] uppercase">3. Data Sharing</h2>
        <p className="text-sm text-neutral-600 leading-relaxed font-light">
          We do not sell your personal data. We only share your information with trusted third-party service providers who assist us in operating our platform, conducting our business, or servicing you, such as payment processors and shipping partners.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-[0.15em] uppercase">4. Your Rights</h2>
        <p className="text-sm text-neutral-600 leading-relaxed font-light">
          You have the right to request access to, correction, or deletion of your personal data held by {companyName}. If you wish to exercise these rights, please reach out to our client services team via the Contact Us page.
        </p>
      </section>
    </div>
  );
}
import { LegalPageLayout } from '@/components/layout/LegalPageLayout';

export function TermsOfService() {
  return (
    <LegalPageLayout
      title='Terms of Service'
      description='LegacyGuard Terms of Service - Legal terms and conditions for using our secure document management and legacy planning platform.'
    >
      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>1. Acceptance of Terms</h2>
        <p className='leading-relaxed mb-4'>
          By accessing and using LegacyGuard ("the Service"), you accept and
          agree to be bound by the terms and provision of this agreement. If you
          do not agree to abide by the above, please do not use this service.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          2. Description of Service
        </h2>
        <p className='leading-relaxed mb-4'>
          LegacyGuard is a secure document management and legacy planning
          platform that helps individuals organize their important documents,
          create legal wills, and plan for their family's future. The service
          includes:
        </p>
        <ul className='list-disc pl-6 mb-4'>
          <li>Encrypted document storage and management</li>
          <li>AI-powered document analysis and organization</li>
          <li>Will creation and legacy planning tools</li>
          <li>Guardian assignment and emergency access features</li>
          <li>Time capsule messaging system</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          3. User Accounts and Security
        </h2>
        <p className='leading-relaxed mb-4'>
          You are responsible for safeguarding the password and all activities
          that occur under your account. You agree to provide accurate and
          complete information when creating your account and to update such
          information to keep it accurate and current.
        </p>
        <p className='leading-relaxed mb-4'>
          LegacyGuard implements bank-level security measures including
          end-to-end encryption and zero-knowledge architecture to protect your
          data. However, you acknowledge that no method of transmission over the
          Internet is 100% secure.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          4. Data Privacy and Protection
        </h2>
        <p className='leading-relaxed mb-4'>
          Your privacy is paramount to us. All personal data is encrypted before
          storage and we maintain a zero-knowledge architecture, meaning we
          cannot access your encrypted data. For detailed information about how
          we collect, use, and protect your data, please review our Privacy
          Policy.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>5. Legal Disclaimers</h2>
        <p className='leading-relaxed mb-4'>
          While LegacyGuard provides tools for will creation and legacy
          planning, we strongly recommend consulting with qualified legal
          professionals for complex estate planning needs. The service is not a
          substitute for professional legal advice, and we cannot guarantee the
          legal validity of documents created using our platform in all
          jurisdictions.
        </p>
        <p className='leading-relaxed mb-4'>
          <strong>Important:</strong> LegacyGuard is a tool for organization and
          planning. It does not provide legal, financial, or tax advice. The
          "Will Generator" and other features produce documents based on
          templates and user-provided data. These are not a substitute for
          professional advice from a qualified lawyer or financial advisor. We
          strongly recommend you consult with a professional to ensure your will
          and estate plan are legally valid and suit your specific situation.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>6. Security and Data</h2>
        <p className='leading-relaxed mb-4'>
          We implement state-of-the-art security measures, including end-to-end,
          client-side encryption, to protect your data. This "Zero-Knowledge"
          architecture means that we, the Company, cannot access or decrypt the
          content of your uploaded documents. You acknowledge that the ultimate
          security of your data also depends on you protecting your account
          password and recovery keys.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>7. Termination</h2>
        <p className='leading-relaxed mb-4'>
          We may terminate or suspend your access to the Service at any time,
          without prior notice or liability, for any reason whatsoever,
          including without limitation if you breach the Terms.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>
          8. Limitation of Liability
        </h2>
        <p className='leading-relaxed mb-4'>
          In no event shall the Company be liable for any indirect, incidental,
          special, consequential or punitive damages, including without
          limitation, loss of profits, data, use, goodwill, or other intangible
          losses, resulting from your access to or use of or inability to access
          or use the Service.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>9. Changes to Terms</h2>
        <p className='leading-relaxed mb-4'>
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. We will provide at least 30 days' notice
          prior to any new terms taking effect.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>10. Governing Law</h2>
        <p className='leading-relaxed mb-4'>
          These Terms shall be governed and construed in accordance with the
          laws of the European Union and applicable member state laws, without
          regard to its conflict of law provisions.
        </p>
      </section>
    </LegalPageLayout>
  );
}

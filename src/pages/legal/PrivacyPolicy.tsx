import { LegalPageLayout } from '@/components/layout/LegalPageLayout';

export function PrivacyPolicy() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="LegacyGuard Privacy Policy - How we collect, use, and protect your personal information on our secure platform."
    >
      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>Our Commitment to Your Privacy</h2>
        <p className='leading-relaxed mb-4'>
          Your trust is the foundation of our service. This Privacy Policy explains what information we collect, how we use it, 
          and most importantly, how we protect it. Our guiding principle is data minimization—we only collect what is necessary 
          to provide the service.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>1. Information We Collect</h2>
        <h3 className='text-xl font-semibold mb-3'>1.1 Account Information</h3>
        <ul className='list-disc pl-6 mb-4'>
          <li>Email address (for account creation and communication)</li>
          <li>Full name (for account identification)</li>
          <li>Profile photo (optional)</li>
          <li>Authentication information (managed by Clerk)</li>
        </ul>

        <h3 className='text-xl font-semibold mb-3'>1.2 Encrypted Content</h3>
        <ul className='list-disc pl-6 mb-4'>
          <li>Documents you upload (stored in encrypted form)</li>
          <li>Personal information you enter (encrypted before storage)</li>
          <li>Will and legacy planning data (encrypted)</li>
          <li>Guardian and family member information (encrypted)</li>
        </ul>

        <h3 className='text-xl font-semibold mb-3'>1.3 Usage Data</h3>
        <ul className='list-disc pl-6 mb-4'>
          <li>Login frequency and session duration</li>
          <li>Feature usage patterns (anonymized)</li>
          <li>Technical logs for security and performance</li>
          <li>Error reports and crash data</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>2. How We Use Your Information</h2>
        <ul className='list-disc pl-6 mb-4'>
          <li>
            <strong>To Provide and Maintain the Service:</strong> To manage your account, provide customer support, and operate the platform.
          </li>
          <li>
            <strong>To Improve the Service:</strong> To understand how our users interact with LegacyGuard so we can make it better, 
            more intuitive, and more secure.
          </li>
          <li>
            <strong>To Communicate with You:</strong> To send you important service announcements, security alerts, 
            and (with your consent) product updates.
          </li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>3. Data Security (Our Zero-Knowledge Promise)</h2>
        <p className='leading-relaxed mb-4'>
          We have architected our system so that your privacy is protected by cryptography, not just by our policy.
        </p>
        <ul className='list-disc pl-6 mb-4'>
          <li>
            <strong>End-to-End Encryption:</strong> Your sensitive data is encrypted on your device and decrypted on your device. 
            It is never in a readable format on our servers.
          </li>
          <li>
            <strong>Data Storage:</strong> We use secure, GDPR-compliant cloud infrastructure (Supabase) with servers located 
            within the European Union.
          </li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>4. Data Sharing and Third Parties</h2>
        <p className='leading-relaxed mb-4'>
          We do not sell, trade, or rent your personal identification information to others. We may share data with trusted 
          third-party service providers who assist us in operating our Service, under strict data protection agreements. These include:
        </p>
        <ul className='list-disc pl-6 mb-4'>
          <li><strong>Clerk:</strong> For user authentication.</li>
          <li><strong>Supabase:</strong> For database and encrypted file storage.</li>
          <li><strong>Vercel:</strong> For hosting our application.</li>
          <li><strong>Resend:</strong> For sending transactional emails.</li>
          <li><strong>AI Services:</strong> For AI-powered document analysis (only the content of a single document is sent for 
          analysis and is not stored by them long-term).</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>5. Your Data Rights (GDPR)</h2>
        <p className='leading-relaxed mb-4'>
          As a user in the EU, you have the right to:
        </p>
        <ul className='list-disc pl-6 mb-4'>
          <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
          <li><strong>Erasure ("Right to be Forgotten"):</strong> Request the deletion of your account and all associated data.</li>
          <li><strong>Portability:</strong> Request your data in a machine-readable format.</li>
        </ul>
        <p className='leading-relaxed mb-4'>
          You can exercise these rights through your account settings or by contacting us at privacy@legacyguard.app.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>6. Zero-Knowledge Architecture</h2>
        <p className='leading-relaxed mb-4'>
          LegacyGuard operates on a zero-knowledge architecture, which means:
        </p>
        <ul className='list-disc pl-6 mb-4'>
          <li>All your documents and personal data are encrypted on your device before being transmitted to our servers</li>
          <li>We do not have access to your encryption keys and cannot decrypt your data</li>
          <li>Even LegacyGuard employees cannot view your private information</li>
          <li>Your data remains private and secure, even from us</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>7. Changes to This Policy</h2>
        <p className='leading-relaxed mb-4'>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy 
          on this page and, if the changes are significant, by sending you an email notification.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>8. Contact Information</h2>
        <p className='leading-relaxed mb-4'>
          If you have any questions about this Privacy Policy or our data practices, please contact us at:
        </p>
        <div className='bg-muted rounded-lg p-4'>
          <p className='text-foreground'>
            Email: privacy@legacyguard.app<br />
            Data Protection Officer: dpo@legacyguard.app
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}

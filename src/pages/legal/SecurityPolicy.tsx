import { LegalPageLayout } from '@/components/layout/LegalPageLayout';

export function SecurityPolicy() {
  return (
    <LegalPageLayout
      title="Security Policy"
      description="LegacyGuard Security Policy - Comprehensive overview of our security measures, encryption standards, and data protection practices."
    >
      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>Our Security Commitment</h2>
        <p className='leading-relaxed mb-4'>
          At LegacyGuard, security is not just a feature—it's the foundation of everything we do. We understand that you're
          entrusting us with your most sensitive and personal information, and we've built our platform with bank-level
          security standards to protect it.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>1. Zero-Knowledge Architecture</h2>
        <p className='leading-relaxed mb-4'>
          Our most important security feature is our zero-knowledge architecture. This means:
        </p>
        <ul className='list-disc pl-6 mb-4'>
          <li><strong>Client-Side Encryption:</strong> All encryption and decryption happens on your device, not on our servers</li>
          <li><strong>No Access:</strong> We cannot read, access, or decrypt your documents, even if compelled by law</li>
          <li><strong>True Privacy:</strong> Your data remains private even from LegacyGuard employees and administrators</li>
          <li><strong>End-to-End Security:</strong> Data is encrypted before it leaves your device and remains encrypted in transit and storage</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>2. Encryption Standards</h2>
        <h3 className='text-xl font-semibold mb-3'>2.1 Document Encryption</h3>
        <ul className='list-disc pl-6 mb-4'>
          <li><strong>AES-256-GCM:</strong> Military-grade encryption for all document content</li>
          <li><strong>RSA-4096:</strong> Asymmetric encryption for key exchange and digital signatures</li>
          <li><strong>PBKDF2:</strong> Password-based key derivation with 100,000+ iterations</li>
          <li><strong>Argon2:</strong> Memory-hard key derivation for additional security</li>
        </ul>

        <h3 className='text-xl font-semibold mb-3'>2.2 Key Management</h3>
        <ul className='list-disc pl-6 mb-4'>
          <li><strong>Unique Keys:</strong> Each document gets its own encryption key</li>
          <li><strong>Key Derivation:</strong> Keys are derived from your master password and device-specific factors</li>
          <li><strong>Secure Storage:</strong> Keys are never stored on our servers in plain text</li>
          <li><strong>Recovery Keys:</strong> Secure backup and recovery mechanisms for account access</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>3. Infrastructure Security</h2>
        <h3 className='text-xl font-semibold mb-3'>3.1 Data Centers</h3>
        <ul className='list-disc pl-6 mb-4'>
          <li><strong>SOC 2 Type II:</strong> Certified secure data centers with regular audits</li>
          <li><strong>EU Location:</strong> Servers located within the European Union for GDPR compliance</li>
          <li><strong>Physical Security:</strong> 24/7 monitoring, biometric access controls, and environmental controls</li>
          <li><strong>Redundancy:</strong> Multiple data centers with automatic failover</li>
        </ul>

        <h3 className='text-xl font-semibold mb-3'>3.2 Network Security</h3>
        <ul className='list-disc pl-6 mb-4'>
          <li><strong>TLS 1.3:</strong> Latest transport layer security for all connections</li>
          <li><strong>DDoS Protection:</strong> Advanced protection against distributed denial of service attacks</li>
          <li><strong>WAF:</strong> Web Application Firewall to block malicious requests</li>
          <li><strong>CDN Security:</strong> Content delivery network with built-in security features</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>4. Application Security</h2>
        <h3 className='text-xl font-semibold mb-3'>4.1 Code Security</h3>
        <ul className='list-disc pl-6 mb-4'>
          <li><strong>Security Audits:</strong> Regular third-party security audits and penetration testing</li>
          <li><strong>Dependency Scanning:</strong> Automated scanning for known vulnerabilities in dependencies</li>
          <li><strong>Code Review:</strong> All code changes reviewed by security-conscious developers</li>
          <li><strong>Static Analysis:</strong> Automated tools to detect potential security issues</li>
        </ul>

        <h3 className='text-xl font-semibold mb-3'>4.2 Authentication & Access</h3>
        <ul className='list-disc pl-6 mb-4'>
          <li><strong>Multi-Factor Authentication:</strong> Support for TOTP, SMS, and hardware security keys</li>
          <li><strong>Session Management:</strong> Secure session handling with automatic timeouts</li>
          <li><strong>Brute Force Protection:</strong> Rate limiting and account lockout mechanisms</li>
          <li><strong>Password Requirements:</strong> Strong password policies and breach detection</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>5. Data Protection</h2>
        <h3 className='text-xl font-semibold mb-3'>5.1 Data Minimization</h3>
        <ul className='list-disc pl-6 mb-4'>
          <li><strong>Minimal Collection:</strong> We only collect data necessary to provide our services</li>
          <li><strong>No Tracking:</strong> We don't track your browsing behavior or create user profiles</li>
          <li><strong>Anonymous Analytics:</strong> Usage analytics are completely anonymized</li>
          <li><strong>No Third-Party Tracking:</strong> We don't use third-party analytics or tracking services</li>
        </ul>

        <h3 className='text-xl font-semibold mb-3'>5.2 Data Retention</h3>
        <ul className='list-disc pl-6 mb-4'>
          <li><strong>User Control:</strong> You control how long your data is retained</li>
          <li><strong>Automatic Deletion:</strong> Inactive accounts are automatically cleaned up</li>
          <li><strong>Export Rights:</strong> You can export your data at any time</li>
          <li><strong>Right to Erasure:</strong> Complete data deletion upon request</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>6. Incident Response</h2>
        <p className='leading-relaxed mb-4'>
          We have a comprehensive incident response plan that includes:
        </p>
        <ul className='list-disc pl-6 mb-4'>
          <li><strong>24/7 Monitoring:</strong> Continuous security monitoring and threat detection</li>
          <li><strong>Rapid Response:</strong> Dedicated security team available around the clock</li>
          <li><strong>User Notification:</strong> Prompt notification of any security incidents</li>
          <li><strong>Transparency:</strong> Public disclosure of security incidents and our response</li>
          <li><strong>Learning:</strong> Continuous improvement based on incident analysis</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>7. Compliance & Certifications</h2>
        <ul className='list-disc pl-6 mb-4'>
          <li><strong>GDPR:</strong> Full compliance with European data protection regulations</li>
          <li><strong>CCPA:</strong> Compliance with California Consumer Privacy Act</li>
          <li><strong>ISO 27001:</strong> Information security management system certification</li>
          <li><strong>SOC 2:</strong> Service Organization Control 2 compliance</li>
          <li><strong>Regular Audits:</strong> Annual third-party security and compliance audits</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>8. Security Best Practices for Users</h2>
        <p className='leading-relaxed mb-4'>
          While we provide enterprise-level security, your data security also depends on you:
        </p>
        <ul className='list-disc pl-6 mb-4'>
          <li><strong>Strong Passwords:</strong> Use unique, complex passwords for your account</li>
          <li><strong>Multi-Factor Authentication:</strong> Enable MFA for additional account protection</li>
          <li><strong>Recovery Keys:</strong> Safely store your account recovery keys</li>
          <li><strong>Device Security:</strong> Keep your devices updated and secure</li>
          <li><strong>Phishing Awareness:</strong> Be cautious of suspicious emails or links</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>9. Security Updates & Maintenance</h2>
        <p className='leading-relaxed mb-4'>
          We continuously improve our security posture through:
        </p>
        <ul className='list-disc pl-6 mb-4'>
          <li><strong>Regular Updates:</strong> Monthly security updates and patches</li>
          <li><strong>Vulnerability Management:</strong> Proactive identification and remediation of security issues</li>
          <li><strong>Security Training:</strong> Ongoing security training for all employees</li>
          <li><strong>Industry Collaboration:</strong> Participation in security research and information sharing</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>10. Contact Our Security Team</h2>
        <p className='leading-relaxed mb-4'>
          If you have security concerns or want to report a security issue:
        </p>
        <div className='bg-muted rounded-lg p-4'>
          <p className='text-foreground'>
            <strong>Security Team:</strong> security@legacyguard.app<br />
            <strong>Bug Bounty:</strong> We welcome security researchers and offer rewards for valid security findings<br />
            <strong>Response Time:</strong> We aim to respond to all security reports within 24 hours
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}

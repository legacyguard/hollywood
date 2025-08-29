import React from 'react';
import { MetaTags } from '@/components/common/MetaTags';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LegacyGuardLogo } from '@/components/LegacyGuardLogo';
import { Link } from 'react-router-dom';

export function PrivacyPolicy() {
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <MetaTags 
        title="Privacy Policy"
        description="LegacyGuard Privacy Policy - How we collect, use, and protect your personal information on our secure platform."
      />

      {/* Header */}
      <header className='sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <Link to='/' className='flex items-center gap-3 hover:opacity-80 transition-opacity'>
              <LegacyGuardLogo />
              <span className='text-2xl font-bold text-slate-900 dark:text-white font-heading'>
                LegacyGuard
              </span>
            </Link>
            <Link to='/'>
              <Button variant={"ghost" as any} className='text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className='container mx-auto px-4 py-12 max-w-4xl'>
        <motion.div
          initial={{  opacity: 0, y: 20  }}
          animate={{  opacity: 1, y: 0  }}
          transition={{  duration: 0.6  }}
        >
          <h1 className='text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4'>
            Privacy Policy
          </h1>
          <p className='text-xl text-slate-600 dark:text-slate-300 mb-8'>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className='prose prose-slate dark:prose-invert max-w-none'>
            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>1. Introduction</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                At LegacyGuard, your privacy is not just a priority—it's fundamental to our mission. This Privacy Policy
                explains how we collect, use, protect, and handle your personal information when you use our secure
                document management and legacy planning platform.
              </p>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                We are committed to maintaining the highest standards of data protection and comply with GDPR, CCPA,
                and other applicable privacy regulations.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>2. Zero-Knowledge Architecture</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                LegacyGuard operates on a zero-knowledge architecture, which means:
              </p>
              <ul className='list-disc pl-6 text-slate-700 dark:text-slate-300 mb-4'>
                <li>All your documents and personal data are encrypted on your device before being transmitted to our servers</li>
                <li>We do not have access to your encryption keys and cannot decrypt your data</li>
                <li>Even LegacyGuard employees cannot view your private information</li>
                <li>Your data remains private and secure, even from us</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>3. Information We Collect</h2>
              <h3 className='text-xl font-semibold text-slate-900 dark:text-white mb-3'>3.1 Account Information</h3>
              <ul className='list-disc pl-6 text-slate-700 dark:text-slate-300 mb-4'>
                <li>Email address (for account creation and communication)</li>
                <li>Full name (for account identification)</li>
                <li>Profile photo (optional)</li>
                <li>Authentication information (managed by Clerk)</li>
              </ul>

              <h3 className='text-xl font-semibold text-slate-900 dark:text-white mb-3'>3.2 Encrypted Content</h3>
              <ul className='list-disc pl-6 text-slate-700 dark:text-slate-300 mb-4'>
                <li>Documents you upload (stored in encrypted form)</li>
                <li>Personal information you enter (encrypted before storage)</li>
                <li>Will and legacy planning data (encrypted)</li>
                <li>Guardian and family member information (encrypted)</li>
              </ul>

              <h3 className='text-xl font-semibold text-slate-900 dark:text-white mb-3'>3.3 Usage Data</h3>
              <ul className='list-disc pl-6 text-slate-700 dark:text-slate-300 mb-4'>
                <li>Login frequency and session duration</li>
                <li>Feature usage patterns (anonymized)</li>
                <li>Technical logs for security and performance</li>
                <li>Error reports and crash data</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>4. How We Use Your Information</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                We use your information solely to provide and improve our services:
              </p>
              <ul className='list-disc pl-6 text-slate-700 dark:text-slate-300 mb-4'>
                <li>To create and maintain your account</li>
                <li>To provide secure document storage and management</li>
                <li>To enable AI-powered document analysis (performed on encrypted data)</li>
                <li>To send important service updates and security notifications</li>
                <li>To provide customer support when requested</li>
                <li>To improve our services based on anonymized usage patterns</li>
              </ul>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                <strong>We never sell, rent, or share your personal information with third parties for marketing purposes.</strong>
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>5. Data Security</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                We implement multiple layers of security to protect your data:
              </p>
              <ul className='list-disc pl-6 text-slate-700 dark:text-slate-300 mb-4'>
                <li><strong>Client-side encryption:</strong> Data is encrypted on your device using industry-standard algorithms</li>
                <li><strong>Secure transmission:</strong> All data transfers use TLS 1.3 encryption</li>
                <li><strong>Secure storage:</strong> Encrypted data is stored in SOC 2 compliant data centers</li>
                <li><strong>Access controls:</strong> Strict access controls and monitoring systems</li>
                <li><strong>Regular audits:</strong> Security audits and penetration testing</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>6. Third-Party Services</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                We work with trusted service providers who help us deliver our services:
              </p>
              <ul className='list-disc pl-6 text-slate-700 dark:text-slate-300 mb-4'>
                <li><strong>Clerk:</strong> Authentication and user management (privacy compliant)</li>
                <li><strong>Supabase:</strong> Encrypted database storage (GDPR compliant)</li>
                <li><strong>Vercel:</strong> Secure hosting and content delivery</li>
              </ul>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                These providers only receive the minimum data necessary to provide their services and are bound by strict
                data protection agreements.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>7. Your Rights</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                Under GDPR and other privacy laws, you have the following rights:
              </p>
              <ul className='list-disc pl-6 text-slate-700 dark:text-slate-300 mb-4'>
                <li><strong>Right of access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to rectification:</strong> Correct inaccurate personal data</li>
                <li><strong>Right to erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Right to portability:</strong> Export your data in a usable format</li>
                <li><strong>Right to restrict processing:</strong> Limit how we process your data</li>
                <li><strong>Right to object:</strong> Object to certain types of data processing</li>
              </ul>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                To exercise these rights, please contact us at privacy@legacyguard.app.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>8. Data Retention</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                We retain your data only as long as necessary to provide our services:
              </p>
              <ul className='list-disc pl-6 text-slate-700 dark:text-slate-300 mb-4'>
                <li>Account data: Until account deletion</li>
                <li>Document data: Until you delete documents or close your account</li>
                <li>Usage logs: 12 months for security and improvement purposes</li>
                <li>Support communications: 2 years for quality assurance</li>
              </ul>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                Upon account closure, we provide a 30-day grace period for data recovery, after which all data is permanently deleted.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>9. International Data Transfers</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                Our services operate globally, and your encrypted data may be stored in data centers located in different countries.
                We ensure that all international transfers comply with applicable privacy laws and use appropriate safeguards.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>10. Children's Privacy</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                LegacyGuard is not intended for use by individuals under 18 years of age. We do not knowingly collect
                personal information from children under 18. If we become aware that we have collected such information,
                we will take steps to delete it promptly.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>11. Changes to This Policy</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                email or through a prominent notice in our application. Your continued use of LegacyGuard after
                such modifications constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>12. Contact Us</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className='bg-slate-100 dark:bg-slate-800 rounded-lg p-4'>
                <p className='text-slate-700 dark:text-slate-300'>
                  <strong>Data Protection Officer</strong><br />
                  Email: privacy@legacyguard.app<br />
                  Address: [Your Business Address]<br />
                  Phone: [Your Business Phone]
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

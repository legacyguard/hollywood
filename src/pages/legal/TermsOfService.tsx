import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LegacyGuardLogo } from '@/components/LegacyGuardLogo';
import { Link } from 'react-router-dom';

export function TermsOfService() {
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <Helmet>
        <title>Terms of Service - LegacyGuard</title>
        <meta name="description" content="LegacyGuard Terms of Service - Legal terms and conditions for using our secure document management and legacy planning platform." />
        <meta name="robots" content="index, follow" />
      </Helmet>

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
              <Button variant='ghost' className='text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className='container mx-auto px-4 py-12 max-w-4xl'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className='text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4'>
            Terms of Service
          </h1>
          <p className='text-xl text-slate-600 dark:text-slate-300 mb-8'>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className='prose prose-slate dark:prose-invert max-w-none'>
            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>1. Acceptance of Terms</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                By accessing and using LegacyGuard ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>2. Description of Service</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                LegacyGuard is a secure document management and legacy planning platform that helps individuals organize their important
                documents, create legal wills, and plan for their family's future. The service includes:
              </p>
              <ul className='list-disc pl-6 text-slate-700 dark:text-slate-300 mb-4'>
                <li>Encrypted document storage and management</li>
                <li>AI-powered document analysis and organization</li>
                <li>Will creation and legacy planning tools</li>
                <li>Guardian assignment and emergency access features</li>
                <li>Time capsule messaging system</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>3. User Accounts and Security</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                You are responsible for safeguarding the password and all activities that occur under your account.
                You agree to provide accurate and complete information when creating your account and to update such information
                to keep it accurate and current.
              </p>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                LegacyGuard implements bank-level security measures including end-to-end encryption and zero-knowledge architecture
                to protect your data. However, you acknowledge that no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>4. Data Privacy and Protection</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                Your privacy is paramount to us. All personal data is encrypted before storage and we maintain a zero-knowledge
                architecture, meaning we cannot access your encrypted data. For detailed information about how we collect,
                use, and protect your data, please review our Privacy Policy.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>5. Legal Disclaimers</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                While LegacyGuard provides tools for will creation and legacy planning, we strongly recommend consulting with
                qualified legal professionals for complex estate planning needs. The service is not a substitute for professional
                legal advice, and we cannot guarantee the legal validity of documents created using our platform in all jurisdictions.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>6. Service Availability</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                We strive to maintain high availability of our services, but we do not guarantee uninterrupted access.
                The service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>7. Limitation of Liability</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                LegacyGuard shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
                or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use,
                goodwill, or other intangible losses.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>8. Termination</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                Either party may terminate this agreement at any time. Upon termination, you will retain access to your
                encrypted data for a reasonable period to allow for data export. We will provide at least 30 days notice
                before any service termination.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>9. Changes to Terms</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                We reserve the right to modify these terms at any time. We will notify users of any material changes
                via email or through the service interface. Continued use of the service after such modifications
                constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>10. Contact Information</h2>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-4'>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className='bg-slate-100 dark:bg-slate-800 rounded-lg p-4'>
                <p className='text-slate-700 dark:text-slate-300'>
                  Email: legal@legacyguard.app<br />
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

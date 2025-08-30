import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LegacyGuardLogo } from '@/components/LegacyGuardLogo';
import { useNavigate } from 'react-router-dom';

export function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950'>
      {/* Header */}
      <header className='sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-green-200/50 dark:border-green-800/50'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <motion.div
              className='flex items-center gap-3 cursor-pointer'
              onClick={() => navigate('/')}
              whileHover={{  scale: 1.02  }}
              transition={{  duration: 0.2  }}
            >
              <LegacyGuardLogo />
              <span className='text-2xl font-bold text-green-900 dark:text-green-100 font-heading'>
                LegacyGuard
              </span>
            </motion.div>

            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className='text-green-700 hover:text-green-900'
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className='container mx-auto px-4 py-12 max-w-4xl'>
        <motion.div
          initial={{  opacity: 0, y: 30  }}
          animate={{  opacity: 1, y: 0  }}
          transition={{  duration: 0.8  }}
        >
          <h1 className='text-4xl font-bold text-green-900 dark:text-green-100 mb-8 text-center'>
            Privacy Policy
          </h1>

          <Card className='p-8 bg-white/80 dark:bg-slate-800/80'>
            <CardContent className='prose dark:prose-invert max-w-none'>
              <p className='text-lg text-green-700 dark:text-green-300 mb-6'>
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h2>Your Privacy is Our Priority</h2>
              <p>
                At LegacyGuard, we understand that your personal and family
                information is incredibly sensitive. This Privacy Policy
                explains how we collect, use, and protect your information when
                you use our service.
              </p>

              <h2>Information We Collect</h2>
              <ul>
                <li>
                  <strong>Account Information:</strong> Email address, name, and
                  authentication data
                </li>
                <li>
                  <strong>Document Data:</strong> Files and documents you upload
                  (encrypted on your device)
                </li>
                <li>
                  <strong>Usage Data:</strong> How you interact with our service
                  to improve your experience
                </li>
              </ul>

              <h2>Zero-Knowledge Architecture</h2>
              <p>
                LegacyGuard uses end-to-end encryption with a zero-knowledge
                architecture. This means:
              </p>
              <ul>
                <li>
                  Your documents are encrypted on your device before being
                  uploaded
                </li>
                <li>
                  We cannot read, access, or decrypt your personal documents
                </li>
                <li>Only you have the keys to decrypt your information</li>
                <li>
                  Even if compelled by law enforcement, we cannot provide your
                  decrypted data
                </li>
              </ul>

              <h2>How We Use Your Information</h2>
              <ul>
                <li>To provide and maintain our service</li>
                <li>To authenticate your identity</li>
                <li>To send you important service notifications</li>
                <li>To provide customer support when requested</li>
              </ul>

              <h2>Data Security</h2>
              <p>We implement industry-leading security measures including:</p>
              <ul>
                <li>AES-256 encryption for all data</li>
                <li>TLS encryption for all data transmission</li>
                <li>Regular security audits and penetration testing</li>
                <li>
                  Secure data centers with physical and digital protections
                </li>
              </ul>

              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
                <li>Opt-out of non-essential communications</li>
              </ul>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at privacy@legacyguard.com
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

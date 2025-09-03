// src/components/landing/SecurityPromiseSection.tsx

import { ShieldCheck, KeyRound, BadgeCheck, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <ShieldCheck className="h-10 w-10 text-yellow-400" />,
    title: "Fortress-Level Protection",
    description: "Secure your account with the highest level of protection, including biometrics and hardware keys. You decide how strong the lock is.",
  },
  {
    icon: <KeyRound className="h-10 w-10 text-yellow-400" />,
    title: "Only You Hold the Key",
    description: "Your information is encrypted on your device before it ever reaches us. Not even we can see it. Your privacy is mathematically guaranteed.",
  },
  {
    icon: <BadgeCheck className="h-10 w-10 text-yellow-400" />,
    title: "An Unbreakable Seal of Trust",
    description: "Every critical action is recorded in a secure, unchangeable audit log. This creates a verifiable history for ultimate peace of mind.",
  },
  {
    icon: <Timer className="h-10 w-10 text-yellow-400" />,
    title: "Share with Absolute Control",
    description: "When you share information, you are in complete control. Set time limits, track access, and know exactly who sees what, and when.",
  },
];

export const SecurityPromiseSection = () => {
  return (
    <section className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Our Security Promise to Your Family
        </h2>
        <p className="text-lg text-slate-300 mb-12 max-w-3xl mx-auto">
          Your sanctuary is sacred. So is your privacy. We've built LegacyGuard on a foundation of world-class security principles to protect what matters most.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/60 p-8 rounded-lg shadow-md border border-slate-700 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="mb-6 inline-block p-4 bg-yellow-400/10 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Link
            to="/security-deep-dive"
            className="text-slate-300 hover:text-yellow-400 transition-colors"
          >
            Curious about the technical details? Read our full security documentation →
          </Link>
        </div>
      </div>
    </section>
  );
};

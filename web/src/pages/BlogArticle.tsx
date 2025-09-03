import React from 'react';
import { MetaTags } from '@/components/common/MetaTags';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon-library';
import { LegacyGuardLogo } from '@/components/LegacyGuardLogo';
import { Link, useParams, useNavigate } from 'react-router-dom';

const BlogArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // For now, we'll hardcode the article data, but this could be fetched from an API
  const article = {
    title: "5 Reasons to Create Your Will Today",
    excerpt: "Discover why creating a will is one of the most important acts of care for your family, and how to approach this crucial decision with clarity and confidence.",
    featureImage: "https://legacyguard.app/blog/will-creation-guide.png",
    url: `https://legacyguard.app/blog/${slug}`,
    author: "LegacyGuard Legal Team",
    publishDate: "January 2025",
    readTime: "8 min read"
  };

  // If slug doesn't match our known article, redirect to blog listing
  React.useEffect(() => {
    if (slug !== '5-reasons-create-will') {
      navigate('/blog');
    }
  }, [slug, navigate]);

  return (
    <>
      <MetaTags
        title={article.title}
        description={article.excerpt}
        imageUrl={article.featureImage}
        url={article.url}
        keywords="will creation, estate planning, family protection, legacy planning, legal documents, family security"
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <LegacyGuardLogo />
                <span className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
                  LegacyGuard
                </span>
              </Link>
              <Link to="/">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Article Header */}
            <div className="text-center space-y-4">
              <Badge variant="outline" className="text-sm">
                Estate Planning Guide
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                {article.title}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                {article.excerpt}
              </p>

              {/* Article Meta */}
              <div className="flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <span>By {article.author}</span>
                <span>•</span>
                <span>{article.publishDate}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
            </div>

            {/* Introduction */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Icon name="lightbulb" className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Why This Matters
                    </h3>
                    <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                      Creating a will isn't about dwelling on the end—it's about ensuring your family's future is secure and your wishes are respected.
                      It's one of the most caring things you can do for the people you love most.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">

              {/* Reason 1 */}
              <section>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  1. Protect Your Family's Financial Future
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Without a will, your assets may not be distributed according to your wishes. State laws (intestacy laws) will determine who gets what,
                  which could leave your family in a difficult financial situation or result in assets going to unintended beneficiaries.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  A properly drafted will ensures that your hard-earned assets—whether it's your home, savings, investments, or personal belongings—go
                  to the people you care about most. It also helps minimize the financial burden on your family during an already difficult time.
                </p>

                <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 my-6">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Icon name="alert-triangle" className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                          Real Example
                        </h4>
                        <p className="text-amber-800 dark:text-amber-200 text-sm">
                          Sarah's father passed without a will. His $500,000 estate went through probate for 18 months, with 40% going to legal fees
                          and taxes. With proper planning, Sarah could have received the full inheritance much sooner.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Reason 2 */}
              <section>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  2. Ensure Your Children Are Cared For
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  If you have minor children, a will is absolutely essential. It allows you to name guardians who will care for your children if
                  something happens to both parents. Without this designation, the courts will decide who raises your children—and it might not be
                  the person you would have chosen.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  You can also establish trusts for your children's education, healthcare, and general welfare. This ensures that any inheritance
                  is used for their benefit and protection, rather than being given to them all at once when they might not be ready to manage it responsibly.
                </p>

                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Guardian Selection</h4>
                      <ul className="text-green-800 dark:text-green-200 text-sm space-y-1">
                        <li>• Choose someone who shares your values</li>
                        <li>• Consider their financial stability</li>
                        <li>• Discuss the responsibility with them</li>
                        <li>• Name backup guardians</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Trust Benefits</h4>
                      <ul className="text-green-800 dark:text-green-200 text-sm space-y-1">
                        <li>• Control when children receive money</li>
                        <li>• Protect assets from creditors</li>
                        <li>• Ensure funds are used appropriately</li>
                        <li>• Provide for special needs</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Reason 3 */}
              <section>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  3. Avoid Family Conflicts and Legal Battles
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Family disputes over inheritance are unfortunately common and can tear families apart. A clear, well-drafted will eliminates
                  ambiguity and reduces the likelihood of conflicts. It provides your family with clear instructions about your wishes,
                  preventing misunderstandings and disagreements.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Even in families with good relationships, the stress and grief of losing a loved one can lead to disagreements about
                  "what they would have wanted." A will removes this uncertainty and gives your family peace of mind knowing they're
                  following your exact wishes.
                </p>

                <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 my-6">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Icon name="heart" className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                          Protect Family Harmony
                        </h4>
                        <p className="text-red-800 dark:text-red-200 text-sm">
                          Your will isn't just about money—it's about preserving family relationships. Clear instructions prevent
                          the kind of conflicts that can last for generations.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Reason 4 */}
              <section>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  4. Reduce Legal Costs and Speed Up the Process
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Dying without a will (intestate) means your estate must go through probate court, which can be expensive, time-consuming,
                  and emotionally draining for your family. Legal fees, court costs, and other expenses can significantly reduce what your
                  family ultimately receives.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  A well-planned estate can often avoid probate entirely or streamline the process significantly. This means your family
                  gets access to your assets much faster, and more of your wealth goes to them rather than to legal fees and court costs.
                </p>

                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 my-6">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-center">Cost Comparison</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600 mb-2">Without Will</div>
                      <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">$15,000+</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Legal fees & court costs</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">12-24 months process</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">With Will</div>
                      <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">$2,000-5,000</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Legal fees only</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">3-6 months process</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Reason 5 */}
              <section>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  5. Express Your Personal Wishes and Values
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  A will is about more than just money—it's your final opportunity to express your values, beliefs, and wishes.
                  You can specify how you want to be remembered, what causes you want to support, and how you want your legacy to live on.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Whether it's leaving a portion of your estate to charity, creating educational funds for future generations,
                  or simply ensuring that sentimental items go to the right people, a will allows you to make a lasting impact
                  that reflects who you are and what matters to you.
                </p>

                <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 my-6">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Icon name="star" className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                          Legacy Beyond Money
                        </h4>
                        <p className="text-purple-800 dark:text-purple-200 text-sm">
                          Consider including personal letters, family stories, or specific instructions about how you want
                          certain items to be used or remembered. This creates a meaningful connection for future generations.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* How LegacyGuard Helps */}
              <section className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-lg p-8 border border-slate-200 dark:border-slate-700">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                  How LegacyGuard Makes Will Creation Easier
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <Card className="bg-white dark:bg-slate-800 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                          <Icon name="shield" className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                            Secure Document Storage
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">
                            Store your will and other legal documents securely with bank-level encryption.
                            Access them anytime, anywhere, and share them securely with family members or legal professionals.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-slate-800 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                          <Icon name="users" className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                            Family Access Management
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">
                            Set up emergency access for trusted family members and designate guardians for minor children.
                            Ensure your family can access important documents when they need them most.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-slate-800 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                          <Icon name="calendar" className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                            Reminder System
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">
                            Get gentle reminders to review and update your will regularly. Life changes—marriages, births,
                            divorces, and new assets—require will updates to keep your plan current.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-slate-800 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
                          <Icon name="file-text" className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                            Document Organization
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">
                            Keep all your estate planning documents organized in one secure location.
                            From wills and trusts to insurance policies and property deeds, everything is easily accessible.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                    LegacyGuard doesn't replace the need for professional legal advice, but it provides the secure foundation
                    and organizational tools that make the will creation process smoother and more manageable.
                  </p>
                  <Link to="/sign-up">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Start Securing Your Legacy Today
                    </Button>
                  </Link>
                </div>
              </section>

              {/* Next Steps */}
              <section>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Your Next Steps
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                  Creating a will doesn't have to be overwhelming. Here's a simple roadmap to get you started:
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        Gather Information
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        List your assets, debts, and important documents. Include bank accounts, investments, real estate,
                        insurance policies, and personal items of value.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        Choose Beneficiaries
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Decide who will inherit your assets. Consider family members, friends, charities, or organizations
                        that are important to you.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        Select Guardians
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        If you have minor children, choose guardians who will care for them. Discuss this responsibility
                        with the people you're considering.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        Consult a Professional
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Work with an estate planning attorney to draft your will. They can ensure it's legally valid
                        and addresses all your specific needs and concerns.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        Store Securely
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Keep your will in a safe place and let trusted family members know where to find it.
                        Consider using LegacyGuard for secure digital storage and easy access.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Conclusion */}
              <section className="bg-gradient-to-r from-slate-100 to-blue-100 dark:from-slate-800 dark:to-blue-900/20 rounded-lg p-8 border border-slate-200 dark:border-slate-700">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
                  The Gift of Peace of Mind
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 text-center max-w-3xl mx-auto">
                  Creating a will is one of the most caring and responsible things you can do for your family.
                  It's not about dwelling on the end—it's about ensuring that the people you love are protected,
                  provided for, and able to honor your wishes when you're no longer here to guide them.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 text-center max-w-3xl mx-auto">
                  The peace of mind that comes from knowing your affairs are in order is priceless.
                  Start today, even if it's just a simple will. You can always update it as your life changes.
                  The important thing is to begin.
                </p>

                <div className="text-center">
                  <Link to="/sign-up">
                    <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white mr-4">
                      Get Started with LegacyGuard
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline" size="lg">
                      Learn More About LegacyGuard
                    </Button>
                  </Link>
                </div>
              </section>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default BlogArticle;

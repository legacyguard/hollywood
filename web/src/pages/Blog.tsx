
import { MetaTags } from '@/components/common/MetaTags';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon-library';
import { LegacyGuardLogo } from '@/components/LegacyGuardLogo';
import { Link } from 'react-router-dom';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: '5 Reasons to Create Your Will Today',
      excerpt:
        'Discover why creating a will is one of the most important acts of care for your family, and how to approach this crucial decision with clarity and confidence.',
      slug: '5-reasons-create-will',
      category: 'Estate Planning',
      readTime: '8 min read',
      publishDate: 'January 2025',
      author: 'LegacyGuard Legal Team',
      image: 'https://legacyguard.app/blog/will-creation-guide.png',
      featured: true,
    },
    {
      id: 2,
      title: 'Family Protection: Beyond the Basics',
      excerpt:
        "Learn advanced strategies for protecting your family's future, including emergency access protocols and guardian selection.",
      slug: 'family-protection-basics',
      category: 'Family Security',
      readTime: '6 min read',
      publishDate: 'Coming Soon',
      author: 'LegacyGuard Security Team',
      image: 'https://legacyguard.app/blog/family-protection.png',
      featured: false,
    },
    {
      id: 3,
      title: 'Digital Legacy Planning in the Modern Age',
      excerpt:
        'Navigate the complexities of digital assets, social media accounts, and online presence in your estate planning.',
      slug: 'digital-legacy-planning',
      category: 'Digital Assets',
      readTime: '7 min read',
      publishDate: 'Coming Soon',
      author: 'LegacyGuard Digital Team',
      image: 'https://legacyguard.app/blog/digital-legacy.png',
      featured: false,
    },
  ];

  const categories = [
    {
      name: 'Estate Planning',
      count: 1,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    },
    {
      name: 'Family Security',
      count: 1,
      color:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    },
    {
      name: 'Digital Assets',
      count: 1,
      color:
        'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    },
    {
      name: 'Legal Documents',
      count: 0,
      color:
        'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300',
    },
  ];

  return (
    <>
      <MetaTags
        title='Legacy Planning Blog'
        description='Expert insights and practical guidance on estate planning, family protection, and securing your legacy. Learn from legal professionals and security experts.'
        imageUrl='https://legacyguard.app/blog/legacy-planning-blog.png'
        url='https://legacyguard.app/blog'
        keywords='legacy planning blog, estate planning articles, family protection guides, will creation advice, legal document tips'
      />

      <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
        {/* Header */}
        <header className='sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700'>
          <div className='container mx-auto px-4 py-4'>
            <div className='flex items-center justify-between'>
              <Link
                to='/'
                className='flex items-center gap-3 hover:opacity-80 transition-opacity'
              >
                <LegacyGuardLogo />
                <span className='text-2xl font-bold text-slate-900 dark:text-white font-heading'>
                  LegacyGuard
                </span>
              </Link>
              <Link to='/'>
                <Button
                  variant='ghost'
                  className='text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className='bg-gradient-to-r from-slate-900 to-blue-900 text-white py-20'>
          <div className='container mx-auto px-4 text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='max-w-4xl mx-auto'
            >
              <Badge
                variant='outline'
                className='text-white border-white/30 mb-6'
              >
                Knowledge Hub
              </Badge>
              <h1 className='text-5xl lg:text-6xl font-bold mb-6 leading-tight'>
                Legacy Planning
                <span className='block text-blue-300'>Insights & Guidance</span>
              </h1>
              <p className='text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto'>
                Expert advice on estate planning, family protection, and
                securing your legacy. Learn from legal professionals and
                security experts who understand what matters most.
              </p>
              <div className='flex flex-wrap justify-center gap-4'>
                <Link to='/sign-up'>
                  <Button
                    size='lg'
                    className='bg-white text-slate-900 hover:bg-slate-100'
                  >
                    Start Your Legacy Plan
                  </Button>
                </Link>
                <Link to='/blog/5-reasons-create-will'>
                  <Button
                    variant='outline'
                    size='lg'
                    className='border-white/30 text-white hover:bg-white/10'
                  >
                    Read Latest Article
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Article */}
        <section className='py-16'>
          <div className='container mx-auto px-4'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className='text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center'>
                Featured Article
              </h2>

              {blogPosts
                .filter(post => post.featured)
                .map(post => (
                  <Card
                    key={post.id}
                    className='max-w-4xl mx-auto shadow-xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
                  >
                    <CardContent className='p-0'>
                      <div className='grid md:grid-cols-2 gap-0'>
                        <div className='p-8 flex flex-col justify-center'>
                          <Badge className='w-fit mb-4' variant='outline'>
                            {post.category}
                          </Badge>
                          <h3 className='text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight'>
                            {post.title}
                          </h3>
                          <p className='text-slate-600 dark:text-slate-300 mb-6 leading-relaxed'>
                            {post.excerpt}
                          </p>
                          <div className='flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6'>
                            <span>By {post.author}</span>
                            <span>•</span>
                            <span>{post.publishDate}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                          </div>
                          <Link to={`/blog/${post.slug}`}>
                            <Button className='w-full md:w-auto'>
                              Read Full Article
                            </Button>
                          </Link>
                        </div>
                        <div className='bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex items-center justify-center'>
                          <div className='text-center text-white'>
                            <Icon
                              name='file-text'
                              className='h-24 w-24 mx-auto mb-4 opacity-80'
                            />
                            <p className='text-lg font-semibold'>
                              Expert Legal Guidance
                            </p>
                            <p className='text-blue-100'>
                              Professional insights for your family's future
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className='py-16 bg-white dark:bg-slate-800'>
          <div className='container mx-auto px-4'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className='text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center'>
                Explore by Category
              </h2>

              <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto'>
                {categories.map(category => (
                  <Card
                    key={category.name}
                    className='text-center hover:shadow-lg transition-shadow cursor-pointer'
                  >
                    <CardContent className='p-6'>
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${category.color}`}
                      >
                        {category.name}
                      </div>
                      <p className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>
                        {category.count}
                      </p>
                      <p className='text-sm text-slate-600 dark:text-slate-400'>
                        {category.count === 1 ? 'Article' : 'Articles'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* All Articles */}
        <section className='py-16'>
          <div className='container mx-auto px-4'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className='text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center'>
                All Articles
              </h2>

              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
                {blogPosts.map(post => (
                  <Card
                    key={post.id}
                    className='hover:shadow-lg transition-shadow'
                  >
                    <CardContent className='p-6'>
                      <div className='mb-4'>
                        <Badge className='mb-3' variant='outline'>
                          {post.category}
                        </Badge>
                        <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-3 leading-tight'>
                          {post.title}
                        </h3>
                        <p className='text-slate-600 dark:text-slate-300 mb-4 leading-relaxed'>
                          {post.excerpt}
                        </p>
                      </div>

                      <div className='flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4'>
                        <span>{post.author}</span>
                        <span>{post.readTime}</span>
                      </div>

                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-slate-500 dark:text-slate-400'>
                          {post.publishDate}
                        </span>
                        <Link to={`/blog/${post.slug}`}>
                          <Button variant='outline' size='sm'>
                            Read More
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className='py-16 bg-gradient-to-r from-slate-100 to-blue-100 dark:from-slate-800 dark:to-blue-900/20'>
          <div className='container mx-auto px-4'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className='max-w-2xl mx-auto text-center'
            >
              <h2 className='text-3xl font-bold text-slate-900 dark:text-white mb-4'>
                Stay Informed
              </h2>
              <p className='text-slate-600 dark:text-slate-300 mb-8 leading-relaxed'>
                Get the latest insights on legacy planning, family protection,
                and estate planning delivered to your inbox. Expert advice from
                legal professionals and security experts.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 max-w-md mx-auto'>
                <input
                  type='email'
                  placeholder='Enter your email'
                  className='flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
                  Subscribe
                </Button>
              </div>

              <p className='text-xs text-slate-500 dark:text-slate-400 mt-4'>
                We respect your privacy. Unsubscribe at any time.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-16 bg-slate-900 dark:bg-slate-800'>
          <div className='container mx-auto px-4 text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className='max-w-3xl mx-auto'
            >
              <h2 className='text-3xl font-bold text-white mb-6'>
                Ready to Secure Your Legacy?
              </h2>
              <p className='text-slate-300 mb-8 leading-relaxed'>
                Knowledge is power, but action creates security. Start building
                your family's protection today with LegacyGuard's comprehensive
                platform.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link to='/sign-up'>
                  <Button
                    size='lg'
                    className='bg-blue-600 hover:bg-blue-700 text-white'
                  >
                    Start Your Free Trial
                  </Button>
                </Link>
                <Link to='/'>
                  <Button
                    variant='outline'
                    size='lg'
                    className='border-white/30 text-white hover:bg-white/10'
                  >
                    Learn More About LegacyGuard
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;

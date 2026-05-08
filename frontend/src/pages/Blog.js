import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import AdSense from '../components/AdSense';

const POSTS = [
  {
    slug: 'what-is-pnrp-mining',
    title: 'What is PNRP and How Does Mining Work on Platinum Network?',
    excerpt: 'A beginner-friendly guide to PNRP (Platinum Network Reward Point), how the 12-hour mining cycle works, and why it costs zero electricity.',
    author: 'Platinum Network Team',
    date: 'Feb 10, 2026',
    readTime: '6 min read',
    category: 'Beginner Guide',
    content: `
**PNRP — short for Platinum Network Reward Point** — is the native reward point of the Platinum Network ecosystem. Unlike traditional Proof-of-Work mining (which burns electricity through GPUs and ASICs), PNRP mining is **engagement-based**.

## How is mining "engagement-based"?
You don't need expensive hardware. Mining sessions on Platinum Network are simple:

1. **Tap "Start Mining"** on your dashboard
2. A 12-hour countdown begins
3. Once it ends, **claim 50 PNRP** to your balance
4. Watch 2 short ads to extend the session to **24 hours and earn 100 PNRP**

That's it. No GPU, no fans, no electricity bill.

## Why does this work?
The economics are simple. Advertisers pay to show ads. Watching ads contributes to that revenue, and a portion is distributed back to miners as PNRP. As the userbase grows and ad revenue grows, PNRP gains real economic backing — eventually unlocking trade-ability at the **Token Generation Event (TGE)**.

## Key things to remember
- Mining is **once every 12 hours** per account.
- You can boost speed and duration with optional ads — never required.
- **Inactive accounts auto-logout after 7 days** to keep the supply healthy.
- Referrals earn you **10% commission** on your friends' mining rewards forever.

Whether you're new to crypto or a seasoned miner, PNRP gives you a low-risk way to participate in a token launch from day one.
`
  },
  {
    slug: 'maximize-daily-pnrp',
    title: '5 Simple Ways to Maximize Your Daily PNRP Earnings',
    excerpt: 'Streaks, boosts, referrals, and social tasks — here\'s how power users earn 5x more PNRP every day.',
    author: 'Aisha K.',
    date: 'Feb 6, 2026',
    readTime: '4 min read',
    category: 'Tips & Tricks',
    content: `
Earning PNRP isn't just about tapping "Start Mining" once a day. The most active users on Platinum Network earn **3-5x more** than average just by using a few simple habits.

## 1. Watch the time-boost ads
Two short ads turn your 12-hour mining session into a 24-hour one — **doubling your reward from 50 to 100 PNRP**. That's a 100% boost for ~30 seconds of work.

## 2. Watch all 3 daily reward ads
The Daily Reward gives you 3 ads per day with rewards of **15, 25, and 40 PNRP** — a total of **80 PNRP/day for free**, no mining required.

## 3. Complete every social task once
Each platform task (Telegram, Twitter, YouTube, Instagram, Discord) gives you **30 PNRP**. That's a one-time **150 PNRP** for actions that take 2 minutes.

## 4. Use the speed boost
After 5 speed-boost ads, your mining speed becomes **2x** for the current session. Combined with time-boost, that's **200 PNRP per cycle**.

## 5. Refer friends — passively earn
Every referral earns you **10% of their mining rewards** forever. Five active referrals = an extra 25 PNRP per cycle, with zero ongoing effort.

## Quick math
- Daily mining (boosted): 100 PNRP
- Daily reward ads: 80 PNRP
- Social tasks (one-time): 150 PNRP first day
- Referrals (5 friends): ~25 PNRP/cycle

**That's ~205 PNRP per day for an active user vs 50 PNRP for a casual one.** Compound this over 30 days and the gap becomes massive.
`
  },
  {
    slug: 'understanding-tge',
    title: 'Understanding TGE: When Will PNRP Be Tradeable?',
    excerpt: 'Token Generation Event explained simply — what it is, when it happens, and what you need to be ready (KYC, wallet, etc).',
    author: 'Platinum Network Team',
    date: 'Jan 28, 2026',
    readTime: '5 min read',
    category: 'Roadmap',
    content: `
The **Token Generation Event (TGE)** is the moment PNRP transitions from an in-app reward point into a fully-tradeable cryptocurrency on public exchanges. It's the day your accumulated PNRP becomes liquid value.

## When is TGE?
TGE will happen at the end of **Phase 4** of our roadmap. Until then, all PNRP earnings stay in your in-app wallet.

## Why is there a delay?
A token generation event is not just a button press. It involves:

- **Smart contract audits** by reputable firms
- **Liquidity pool setup** on a DEX (and ideally a CEX listing)
- **Legal compliance** in target jurisdictions
- **KYC verification** of users at withdrawal — to satisfy AML/anti-money-laundering rules

Rushing any of these is how projects fail. We'd rather be slow and right than fast and broken.

## What you need to do before TGE

1. **Complete KYC** — Aadhar/PAN upload + selfie (Indian users), or government ID for international users. KYC opens in **Phase 3**.
2. **Have a wallet ready** — A non-custodial wallet like MetaMask or Trust Wallet so you can self-custody your PNRP after withdrawal.
3. **Stay active** — Inactive accounts (>7 days no activity) are auto-logged out. Mine regularly to keep your earnings safe.
4. **Don't sell your account** — Account transfers are not supported and may forfeit your PNRP.

## After TGE
You'll be able to:
- Withdraw PNRP from your in-app wallet to your external wallet
- Trade PNRP on listed exchanges
- Use PNRP for in-ecosystem features we'll roll out post-TGE

Be patient. Every PNRP you earn now is locking in your share of the post-TGE economy.
`
  },
  {
    slug: 'referral-system-explained',
    title: 'How Referrals Work: Earn 10% Commission Forever',
    excerpt: 'A deep dive into our referral mechanics: who earns what, how it\'s tracked, and why long-term referrers win big.',
    author: 'Vikram R.',
    date: 'Jan 20, 2026',
    readTime: '4 min read',
    category: 'Earnings',
    content: `
The Platinum Network referral program is intentionally simple: **invite a friend, get 10% of their mining rewards forever**. No tiers, no expirations, no fine print.

## How it works step by step

1. Find your **8-character referral code** on your Profile page
2. Share it with friends — they paste it during signup
3. When your referral mines and claims PNRP, **you receive 10% in your wallet automatically**
4. Their balance is **not** reduced — your bonus comes from the platform's reward pool

## Real-world example
If you refer 10 active miners and each earns 100 PNRP/day:

- Their daily total: 1,000 PNRP
- Your passive bonus: **100 PNRP/day = 3,000 PNRP/month**

You earn this **forever**, as long as both accounts stay active.

## Why this works for everyone

- **For you**: passive earnings that compound over time
- **For them**: nothing taken away from their balance
- **For the platform**: organic growth, less reliance on paid ads

## Pro tips for referrers

- **Pin your code** in your social media bios
- **Onboard friends personally** — show them how to start mining and watch ads. Higher activation = higher earnings for you.
- **Don't spam** — Reddit / Telegram crypto groups have anti-spam rules. Build relationships, not link drops.

## What's tracked
We log every referral payout in your Wallet → Transactions feed under "Referral Bonus". Full transparency.

Start sharing today. Your future TGE-self will thank you.
`
  },
  {
    slug: 'security-7-day-logout',
    title: 'Security First: Why We Auto-Logout After 7 Days',
    excerpt: 'A short explanation of our 7-day inactivity logout, why it exists, and how to keep your account active.',
    author: 'Platinum Network Team',
    date: 'Jan 12, 2026',
    readTime: '3 min read',
    category: 'Security',
    content: `
You may have noticed: if you haven't opened Platinum Network in 7 days, you'll be logged out automatically. Here's why.

## Three reasons we do this

1. **Account hijacking protection** — Many people use Platinum Network on shared devices (cyber cafes, friends' phones). A 7-day forced re-login means a stolen device can't drain a dormant account.
2. **Token economy health** — Active users keep the platform alive. Auto-logging out inactive accounts reduces phantom supply pressure post-TGE.
3. **Bot deterrence** — Automated farming bots typically run 24/7. Forcing periodic re-authentication catches stale sessions.

## How to stay active
- Open the app at least once every 7 days
- Tap **Start Mining** to register activity
- Even a daily reward claim counts

## What happens if I'm logged out?
Your **PNRP balance is safe**. Just log back in with your email + password. No data is lost. Your mining sessions and accumulated rewards are exactly where you left them.

## Lost your password?
Use the password reset link on the login screen *(coming in Phase 2)*. Until then, contact us via the [Contact](/contact) page.

Stay active, stay secure, stay earning.
`
  }
];

export function getAllPosts() {
  return POSTS;
}

export function getPostBySlug(slug) {
  return POSTS.find(p => p.slug === slug);
}

// Renders simple markdown-ish content (paragraphs, ##, ** , - )
function renderContent(text) {
  const lines = text.trim().split('\n');
  const blocks = [];
  let listBuffer = [];

  const flushList = () => {
    if (listBuffer.length) {
      blocks.push(
        <ul key={blocks.length} className="list-disc list-inside space-y-1 text-gray-300 mb-4">
          {listBuffer.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inline(item) }} />
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  const inline = (s) =>
    s.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
     .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-purple-400 hover:underline">$1</a>');

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      blocks.push(<h2 key={blocks.length} className="text-2xl font-bold mt-8 mb-3 text-white">{line.slice(3)}</h2>);
    } else if (line.match(/^\d+\.\s/)) {
      flushList();
      const text = line.replace(/^\d+\.\s/, '');
      blocks.push(
        <p key={blocks.length} className="text-gray-300 mb-2 ml-4">
          <span className="text-purple-400 font-semibold mr-2">{line.match(/^(\d+)\./)[1]}.</span>
          <span dangerouslySetInnerHTML={{ __html: inline(text) }} />
        </p>
      );
    } else if (line.startsWith('- ')) {
      listBuffer.push(line.slice(2));
    } else {
      flushList();
      blocks.push(
        <p key={blocks.length} className="text-gray-300 mb-4 leading-relaxed"
           dangerouslySetInnerHTML={{ __html: inline(line) }} />
      );
    }
  }
  flushList();
  return blocks;
}

function BlogHeader() {
  return (
    <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" data-testid="blog-back-link">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xl font-bold gradient-text">Platinum Network</span>
        </Link>
        <div className="flex space-x-4 text-sm">
          <Link to="/blog" className="text-gray-400 hover:text-white transition">Blog</Link>
          <Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link>
        </div>
      </div>
    </header>
  );
}

function BlogFooter() {
  return (
    <div className="mt-16 text-center text-gray-500 text-sm pb-8">
      <p>© 2025 Platinum Network. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <Link to="/terms" className="hover:text-white transition">Terms</Link>
        <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
        <Link to="/disclaimer" className="hover:text-white transition">Disclaimer</Link>
        <Link to="/contact" className="hover:text-white transition">Contact</Link>
      </div>
    </div>
  );
}

// ---------- Blog list ----------
export function BlogList() {
  const posts = getAllPosts();
  return (
    <div className="min-h-screen bg-gray-900 text-white" data-testid="blog-page">
      <BlogHeader />
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" data-testid="blog-title">Platinum Network Blog</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Tips, news, and deep-dives about PNRP mining, the token economy, and the road to TGE.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post, idx) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              data-testid={`blog-card-${idx}`}
              className="card-gradient p-6 rounded-xl hover:scale-[1.02] transition-transform border border-gray-800 hover:border-purple-500/50"
            >
              <div className="text-xs uppercase tracking-wide text-purple-400 mb-3">{post.category}</div>
              <h2 className="text-xl font-bold mb-2 leading-tight">{post.title}</h2>
              <p className="text-sm text-gray-400 mb-4">{post.excerpt}</p>
              <div className="flex items-center text-xs text-gray-500 space-x-4">
                <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {post.author}</span>
                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* AdSense Slot - Below blog grid */}
        <div className="mt-8">
          <AdSense adSlot="blog-list-bottom" adFormat="horizontal" />
        </div>

        <BlogFooter />
      </div>
    </div>
  );
}

// ---------- Blog detail ----------
export function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <BlogHeader />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Post not found</h1>
          <Link to="/blog" className="text-purple-400 hover:underline">← Back to blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white" data-testid="blog-post-page">
      <BlogHeader />
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/blog" className="text-sm text-purple-400 hover:underline mb-6 inline-block">
          ← All posts
        </Link>

        <div className="text-xs uppercase tracking-wide text-purple-400 mb-3">{post.category}</div>
        <h1 className="text-4xl font-bold mb-4 leading-tight" data-testid="blog-post-title">{post.title}</h1>
        <p className="text-lg text-gray-400 mb-6">{post.excerpt}</p>
        <div className="flex items-center text-sm text-gray-500 space-x-6 pb-6 border-b border-gray-800 mb-8">
          <span className="flex items-center"><User className="w-4 h-4 mr-2" /> {post.author}</span>
          <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {post.date}</span>
          <span className="flex items-center"><Clock className="w-4 h-4 mr-2" /> {post.readTime}</span>
        </div>

        <div className="prose prose-invert max-w-none" data-testid="blog-post-content">
          {renderContent(post.content)}
        </div>

        {/* AdSense Slot - In-content (after article body) */}
        <div className="my-8">
          <AdSense adSlot="blog-incontent" adFormat="rectangle" />
        </div>

        {/* CTA */}
        <div className="mt-12 card-gradient p-8 rounded-xl text-center">
          <h3 className="text-xl font-bold mb-2">Ready to start mining PNRP?</h3>
          <p className="text-gray-400 mb-4 text-sm">Join thousands earning Platinum Network Reward Points every 12 hours.</p>
          <Link to="/register"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition">
            Start Mining Now
          </Link>
        </div>

        <BlogFooter />
      </article>
    </div>
  );
}

export default BlogList;

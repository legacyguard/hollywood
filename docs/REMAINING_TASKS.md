# 📋 Remaining Production Tasks

## ✅ Already Completed

- Build compiles successfully
- All import/export errors fixed  
- Console statements removed (629 total)
- Environment variables documented
- Security guidelines created
- No npm vulnerabilities (npm audit clean)
- Error boundaries implemented
- Lazy loading implemented
- Bundle sizes reasonable

## 🔴 Critical - Must Do Before Production

### 1. Sentry Error Tracking Setup

```typescript
// Add to src/main.tsx
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_APP_ENV,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

### 2. TypeScript 'any' Types (~90 occurrences)

- As you mentioned, handling separately
- Priority for type safety

### 3. Vercel Environment Variables

- Add all production variables to Vercel Dashboard
- Never commit real credentials

## 🟡 Important - Should Do Soon

### 4. Performance Optimizations

```bash
# Check bundle analysis
npm run build
# Look for large dependencies that could be replaced
```

Current largest bundles:

- react-vendor: 612KB (normal for React)
- legacy-garden: 296KB (could be optimized)
- marketing-pages: 222KB

### 5. Add Web Vitals Monitoring

```typescript
// Add to src/main.tsx
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

const sendToAnalytics = (metric: any) => {
  // Send to your analytics service
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
    });
  }
};

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

### 6. Add Rate Limiting Headers

```typescript
// vercel.json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "X-RateLimit-Limit", "value": "100" },
        { "key": "X-RateLimit-Remaining", "value": "99" },
        { "key": "X-RateLimit-Reset", "value": "1635724800" }
      ]
    }
  ]
}
```

## 🟢 Nice to Have - Can Do After Launch

### 7. Progressive Web App (PWA) Features

- Service worker for offline support
- App manifest for installability
- Push notifications

### 8. Internationalization (i18n)

- Already has basic setup in `/src/lib/i18n/`
- Add more languages based on user demand

### 9. A/B Testing Framework

- For testing new features
- Integration with analytics

### 10. Advanced Monitoring

- User session recording (Hotjar/FullStory)
- Performance monitoring (DataDog/New Relic)
- Uptime monitoring (UptimeRobot/Pingdom)

## 📊 Performance Targets

Current Status vs Targets:

- [ ] First Contentful Paint: Target < 1.8s
- [ ] Time to Interactive: Target < 3.9s  
- [ ] Cumulative Layout Shift: Target < 0.1
- [ ] Bundle size: Currently ~1.5MB total (good)

## 🚀 Pre-Launch Checklist

Before going live:

1. [ ] Install Sentry package: `npm install @sentry/react`
2. [ ] Set VITE_SENTRY_DSN in Vercel
3. [ ] Test error tracking works
4. [ ] Run Lighthouse audit
5. [ ] Test on real mobile devices
6. [ ] Load test with expected traffic
7. [ ] Set up monitoring alerts
8. [ ] Prepare rollback plan

## 📝 Testing Checklist

Critical user flows to test:

- [ ] Sign up / Sign in
- [ ] Document upload & encryption
- [ ] Will creation wizard
- [ ] Guardian invitation & management
- [ ] Emergency access trigger
- [ ] Sofia AI interactions
- [ ] Payment flow (if applicable)

## 🔒 Security Final Check

- [ ] All API endpoints have authentication
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] CSP headers configured
- [ ] Secrets rotation schedule set
- [ ] Penetration testing (if budget allows)

---

**Priority Order:**

1. Sentry setup (30 min)
2. TypeScript types (you're handling)
3. Vercel env vars (15 min)
4. Performance testing (1 hour)
5. Everything else can wait

**Estimated Time to Production Ready: 2-4 hours** (excluding TypeScript types)

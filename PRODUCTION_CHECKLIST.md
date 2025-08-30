# Production Deployment Checklist

## 🚨 CRITICAL - Must Fix Before Production

### 1. Remove All Console Logs
```bash
# Find all console statements
grep -r "console\." src/ --include="*.ts" --include="*.tsx" | wc -l

# Remove them with this script:
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' '/console\./d' {} +
```

### 2. Fix TypeScript Any Types
```bash
# Find all 'any' types
grep -r ":\s*any" src/ --include="*.ts" --include="*.tsx"

# Priority files to fix:
- src/lib/sofia-memory.ts (line 49, 175)
- src/lib/sofia-ai.ts (line 38)
- src/services/willApiService.ts (multiple)
```

### 3. Environment Variables
- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in all production values:
  - [ ] VITE_CLERK_PUBLISHABLE_KEY
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY
  - [ ] VITE_SENTRY_DSN
  - [ ] ENCRYPTION_KEY (32 chars)
- [ ] Verify `.env.local` is in `.gitignore`

## 🟡 IMPORTANT - Should Complete

### 4. Testing
- [ ] Run new Sofia tests:
```bash
npm test src/lib/__tests__/sofia-memory.test.ts
npm test src/lib/__tests__/sofia-proactive.test.ts
```
- [ ] Run all tests: `npm test`
- [ ] Check coverage: `npm run test:coverage`

### 5. Performance Optimization
- [ ] Enable code splitting for large components
- [ ] Add lazy loading for routes
- [ ] Optimize bundle size:
```bash
npm run build
npm run analyze  # Check bundle sizes
```

### 6. Security Audit
- [ ] Run security audit:
```bash
npm audit
npm audit fix
```
- [ ] Check for exposed secrets:
```bash
git secrets --scan
```

### 7. Error Monitoring Setup
- [ ] Configure Sentry in production
- [ ] Add Error Boundaries to main components
- [ ] Test error reporting

## 🟢 NICE TO HAVE - Can Do After Launch

### 8. Documentation
- [ ] Update README with:
  - Sofia AI features
  - Environment setup
  - Deployment instructions
- [ ] Add JSDoc comments to new services

### 9. Update Dependencies
```bash
npm outdated  # Check outdated packages
npm update    # Update minor versions
```

### 10. Monitoring & Analytics
- [ ] Setup performance monitoring
- [ ] Configure user analytics
- [ ] Setup uptime monitoring

## 📦 Final Build & Deploy

### Pre-deployment:
```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Run linter
npm run lint

# 3. Run tests
npm test

# 4. Build production
npm run build

# 5. Test production build locally
npm run preview
```

### Deployment:
```bash
# Deploy to production (adjust for your platform)
npm run deploy:production
```

## ✅ Post-Deployment Verification

- [ ] Test Sofia AI chat functionality
- [ ] Verify proactive interventions work
- [ ] Check memory persistence
- [ ] Test on mobile devices
- [ ] Verify all environment variables loaded
- [ ] Check Sentry is receiving errors
- [ ] Monitor performance metrics

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] Rate limiting active
- [ ] Authentication working
- [ ] API keys secure
- [ ] No sensitive data in logs

## 📞 Emergency Contacts

- Lead Developer: [Your contact]
- DevOps: [DevOps contact]
- On-call: [On-call rotation]

---

**Last Updated**: August 30, 2025
**Next Review**: Before each deployment

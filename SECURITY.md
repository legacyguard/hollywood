# 🔒 Security Guide for LegacyGuard

## Environment Variables & Sensitive Data Protection

### 🚨 CRITICAL: Never Commit Sensitive Data

**LegacyGuard contains sensitive information that must NEVER be committed to Git:**

- API keys
- Database credentials
- Authentication secrets
- Private keys
- User data
- Configuration with real values

---

## 🛡️ Security Measures Implemented

### 1. Gitignore Protection

- `.env` files are completely blocked
- `.env.local` files are blocked
- All environment-specific files are blocked
- Secret file types are blocked (`.key`, `.pem`, `.p12`, `.pfx`)

### 2. Pre-commit Hook

- Automatically blocks commits containing environment files
- Scans for potential hardcoded secrets
- Provides clear error messages and instructions
- Adds extra layer of security beyond `.gitignore`

### 3. Environment Template System

- `env.template` provides safe configuration examples
- No real values in templates
- Clear instructions for developers

---

## 📋 Environment Setup Guide

### Step 1: Copy Template

```bash
cp env.template .env.local
```

### Step 2: Configure Your Values

Edit `.env.local` with your actual values:

```bash
# Example configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

### Step 3: Verify Git Status

```bash
git status
# .env.local should NOT appear in tracked files
```

---

## 🔍 Security Checklist

### Before Every Commit

- [ ] No `.env` files in staging
- [ ] No `.env.local` files in staging
- [ ] No hardcoded API keys in code
- [ ] No private keys or certificates
- [ ] No database connection strings
- [ ] No real user credentials

### Environment File Management

- [ ] `.env.local` exists locally (not in Git)
- [ ] `env.template` is up to date
- [ ] No real secrets in templates
- [ ] `.gitignore` includes all env patterns

---

## 🚨 Emergency Procedures

### If You Accidentally Commit Secrets

#### Immediate Actions

1. **STOP** - Don't push to remote
2. **Remove from Git history:**

   ```bash
   git reset --soft HEAD~1
   ```

3. **Remove sensitive files:**

   ```bash
   git rm --cached .env.local
   ```

4. **Update .gitignore** if needed
5. **Re-commit** without sensitive data

#### If Already Pushed to Remote

1. **Immediately rotate/revoke** exposed secrets
2. **Contact security team** if applicable
3. **Use BFG Repo-Cleaner** or similar tools
4. **Force push** cleaned history
5. **Notify team members** to update their local copies

---

## 🛠️ Development Best Practices

### Code Security

```typescript
// ❌ NEVER do this:
const API_KEY = "sk_live_1234567890abcdef";

// ✅ ALWAYS do this:
const API_KEY = import.meta.env.VITE_API_KEY;
```

### Environment Variable Usage

```typescript
// ✅ Safe pattern
const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

// ✅ With validation
if (!config.supabaseUrl || !config.supabaseKey) {
  throw new Error('Missing required environment variables');
}
```

### Template Management

- Keep `env.template` updated with new variables
- Use placeholder values like `your-key-here`
- Include clear descriptions for each variable
- Document required vs. optional variables

---

## 🔐 Production Security

### Deployment Checklist

- [ ] Environment variables set in deployment platform
- [ ] No secrets in build artifacts
- [ ] Secrets rotated regularly
- [ ] Access logs monitored
- [ ] Security scanning enabled

### Monitoring

- Set up alerts for unusual API usage
- Monitor for unauthorized access attempts
- Regular security audits
- Keep dependencies updated

---

## 📚 Additional Resources

### Security Tools

- [GitGuardian](https://www.gitguardian.com/) - Secret scanning
- [TruffleHog](https://github.com/trufflesecurity/truffleHog) - Secret detection
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) - History cleaning

### Documentation

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Git Security Best Practices](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)

---

## 🆘 Getting Help

### Security Issues

- **Immediate:** Contact project maintainer
- **Emergency:** Use emergency procedures above
- **Questions:** Review this document first

### Contact Information

- Project maintainer: [Your Name]
- Security team: [Security Contact]
- Emergency: [Emergency Contact]

---

## 📝 Security Log

| Date | Action | Description |
|------|--------|-------------|
| [Date] | Initial setup | Security measures implemented |
| [Date] | Template update | Environment template created |
| [Date] | Hook installation | Pre-commit hook added |

---

**Remember: Security is everyone's responsibility. When in doubt, ask before committing!** 🔒

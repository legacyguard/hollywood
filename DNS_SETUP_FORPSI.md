# DNS Configuration for legacyguard.cz on Forpsi

## 🌐 DNS Records to Add in Forpsi Admin Panel

Log in to your Forpsi account at: https://admin.forpsi.com/

### Step 1: Access DNS Management
1. Go to "Domény" (Domains) section
2. Find "legacyguard.cz"
3. Click on "DNS záznamy" or "Správa DNS" (DNS Management)

### Step 2: Add the Following DNS Records

#### A. Root Domain Configuration (legacyguard.cz)

**OPTION 1: Using A Record (Recommended)**
```
Type: A
Name: @ (or leave empty for root)
Value: 76.76.21.21
TTL: 300
```

**OPTION 2: Using CNAME (if A record doesn't work)**
```
Type: CNAME
Name: @ (or leave empty)
Value: cname.vercel-dns.com
TTL: 300
```

#### B. WWW Subdomain Configuration
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 300
```

#### C. App Subdomain (Optional - for app.legacyguard.cz)
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
TTL: 300
```

#### D. API Subdomain (Optional - for api.legacyguard.cz)
```
Type: CNAME
Name: api
Value: cname.vercel-dns.com
TTL: 300
```

### Step 3: Vercel Domain Configuration

After adding DNS records, configure the domain in Vercel:

1. Go to: https://vercel.com/legacyguards-projects/hollywood/settings/domains
2. Click "Add Domain"
3. Enter: `legacyguard.cz`
4. Vercel will show you verification status

### Step 4: SSL Certificate

Vercel automatically provisions SSL certificates once DNS is configured correctly.
This usually takes 10-30 minutes after DNS propagation.

## 📋 Complete DNS Record Set

Here's what your DNS records should look like in Forpsi:

| Type  | Name | Value                      | TTL  | Priority |
|-------|------|----------------------------|------|----------|
| A     | @    | 76.76.21.21               | 300  | -        |
| CNAME | www  | cname.vercel-dns.com      | 300  | -        |
| CNAME | app  | cname.vercel-dns.com      | 300  | -        |
| MX    | @    | mail.forpsi.com           | 3600 | 10       |
| TXT   | @    | v=spf1 include:forpsi.com ~all | 3600 | -   |

## 🔍 Verification Steps

After adding the records, verify they're working:

```bash
# Check A record
nslookup legacyguard.cz

# Check CNAME for www
nslookup www.legacyguard.cz

# Check DNS propagation
https://www.whatsmydns.net/#A/legacyguard.cz
```

## ⏱️ DNS Propagation Time

- Local ISP: 5-30 minutes
- Global: Up to 48 hours (usually much faster)
- Forpsi typically updates within 15 minutes

## 🆘 Troubleshooting

### If domain doesn't work after 1 hour:

1. **Check in Forpsi:**
   - Ensure records are saved
   - No conflicting records exist
   - Domain is active (not expired)

2. **Check in Vercel:**
   - Domain shows as "Valid Configuration"
   - SSL certificate is issued

3. **Common Issues:**
   - Remove any existing A records pointing elsewhere
   - Ensure no AAAA (IPv6) records conflict
   - Check if domain has "Proxy" enabled (should be disabled)

## 📞 Support Contacts

**Forpsi Support:**
- Email: podpora@forpsi.com
- Phone: +420 222 745 100
- Portal: https://podpora.forpsi.com/

**Vercel Support:**
- Dashboard: https://vercel.com/support
- Docs: https://vercel.com/docs/custom-domains

## ✅ Expected Result

Once configured correctly:
- https://legacyguard.cz → Your app
- https://www.legacyguard.cz → Redirects to legacyguard.cz
- https://app.legacyguard.cz → Your app (optional)
- SSL certificates active on all domains

## 🎯 Quick Setup Summary

1. Log into Forpsi admin
2. Add A record: @ → 76.76.21.21
3. Add CNAME: www → cname.vercel-dns.com
4. Wait 15-30 minutes
5. Add domain in Vercel dashboard
6. Done! 🎉

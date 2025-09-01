#!/bin/bash

# Automatizovaný script na nastavenie GitHub Secrets
set -e

echo "🔐 Automatizované nastavenie GitHub Secrets pre Vercel deployment"
echo "================================================================="
echo ""

# Hodnoty z .vercel/project.json
VERCEL_ORG_ID="team_pkFaK5rvMWyVGarA11B68SKK"
VERCEL_PROJECT_ID="prj_yRuLLenAfpMIj9cPxB3jDfFZ6X7R"

echo "📦 Projekt: hollywood"
echo "🔍 VERCEL_ORG_ID: $VERCEL_ORG_ID"
echo "🔍 VERCEL_PROJECT_ID: $VERCEL_PROJECT_ID"
echo ""

echo "📝 Potrebujete Vercel Token. Postupujte takto:"
echo ""
echo "1. Otvorte tento link vo vašom prehliadači:"
echo "   👉 https://vercel.com/account/tokens"
echo ""
echo "2. Kliknite na 'Create Token'"
echo "3. Pomenujte ho 'GitHub Actions'"
echo "4. Kliknite 'Create' a skopírujte token"
echo ""
echo "⚠️  DÔLEŽITÉ: Token sa zobrazí len raz!"
echo ""
read -sp "🔑 Vložte Vercel Token (nebude zobrazený): " VERCEL_TOKEN
echo ""
echo ""

if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ Token nemôže byť prázdny!"
    exit 1
fi

echo "🚀 Nastavujem GitHub Secrets..."
echo ""

# Nastavenie secrets pomocou gh CLI
echo -n "Setting VERCEL_TOKEN... "
echo "$VERCEL_TOKEN" | gh secret set VERCEL_TOKEN 2>/dev/null && echo "✅" || echo "❌ Failed"

echo -n "Setting VERCEL_ORG_ID... "
echo "$VERCEL_ORG_ID" | gh secret set VERCEL_ORG_ID 2>/dev/null && echo "✅" || echo "❌ Failed"

echo -n "Setting VERCEL_PROJECT_ID... "
echo "$VERCEL_PROJECT_ID" | gh secret set VERCEL_PROJECT_ID 2>/dev/null && echo "✅" || echo "❌ Failed"

echo ""
echo "✅ Hotovo! GitHub Secrets boli nastavené."
echo ""
echo "📌 Skontrolujte ich na:"
echo "   https://github.com/legacyguard/hollywood/settings/secrets/actions"
echo ""
echo "🎉 Teraz môžete pushnúť zmeny a deployment sa spustí automaticky!"

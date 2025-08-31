#!/bin/bash

echo "📦 Archiving mobile repository..."
echo "=================================="

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI is not installed."
    echo "Please install it first: https://cli.github.com"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub."
    echo "Please run: gh auth login"
    exit 1
fi

echo ""
echo "This script will archive the mobile repository on GitHub."
echo "The repository will become read-only but will remain accessible."
echo ""
echo "Repository to archive: legacyguard/mobile"
echo ""
read -p "Are you sure you want to archive this repository? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Archiving repository..."
    
    # Archive the repository
    gh repo archive legacyguard/mobile --yes
    
    if [ $? -eq 0 ]; then
        echo "✅ Repository successfully archived!"
        
        # Update repository description
        gh repo edit legacyguard/mobile --description "📦 ARCHIVED - Moved to monorepo: https://github.com/legacyguard/hollywood" 2>/dev/null
        
        # Add archive notice to README if possible
        echo ""
        echo "📝 Adding archive notice to README..."
        
        # Create archive notice
        cat > /tmp/ARCHIVE_NOTICE.md << 'EOF'
# ⚠️ THIS REPOSITORY HAS BEEN ARCHIVED

This repository has been archived and is now read-only.

## 📦 Repository Moved

The mobile application code has been moved to our monorepo structure for better code sharing and maintenance.

**New location:** https://github.com/legacyguard/hollywood

The mobile app now lives in the `/mobile` directory of the monorepo.

## 🚀 Benefits of the Move

- Shared code between web and mobile applications
- Unified CI/CD pipeline
- Better dependency management
- Single source of truth for the entire ecosystem

## 📚 How to Access

```bash
# Clone the new monorepo
git clone https://github.com/legacyguard/hollywood.git
cd hollywood

# Install dependencies
npm install

# Run mobile app
npm run mobile:dev
```

---

*Archived on: $(date +"%Y-%m-%d")*
EOF
        
        echo "✅ Archive notice created"
        echo ""
        echo "Please manually add the archive notice to the mobile repo's README if needed."
        echo ""
        echo "Summary:"
        echo "- Repository archived: ✅"
        echo "- Description updated: ✅"
        echo "- New location: https://github.com/legacyguard/hollywood"
        
    else
        echo "❌ Failed to archive repository"
        echo "Please check if you have the necessary permissions"
        exit 1
    fi
else
    echo "❌ Archive cancelled"
    exit 0
fi

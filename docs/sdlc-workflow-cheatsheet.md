# Software Development Lifecycle (SDLC) Workflow Cheat Sheet

A comprehensive guide to typical development workflows using npm, git, and GitHub CLI (gh) commands.

## 📋 Table of Contents

1. [Project Setup](#-project-setup)
2. [Daily Development Workflow](#-daily-development-workflow)
3. [Dependency Management](#-dependency-management)
4. [Testing & Quality Assurance](#-testing--quality-assurance)
5. [Version Control & Collaboration](#-version-control--collaboration)
6. [CI/CD & Automation](#-cicd--automation)
7. [Release Management](#-release-management)
8. [Troubleshooting & Maintenance](#-troubleshooting--maintenance)

## 🚀 Project Setup

### Initial Project Setup
```bash
# Clone repository
git clone https://github.com/owner/repo-name.git
cd repo-name

# Check Node version (ensure consistency)
node --version
npm --version

# Use project's Node version (if .nvmrc exists)
nvm use

# Install dependencies
npm install
# or for clean install (production environments)
npm ci
```

### Environment Configuration
```bash
# Create/check .nvmrc for Node version consistency
echo "20.19.0" > .nvmrc

# Verify package.json engines
cat package.json | grep -A3 "engines"

# Set npm registry (if using private registry)
npm config set registry https://registry.npmjs.org/
```

### Running the Application
```bash
# Build the TypeScript project
npm run build

# Start the application
npm start
# or run directly
node dist/index.js

# Development mode with auto-rebuild (if configured)
npm run dev
# or watch mode
npm run build:watch

# Check available scripts
npm run
# or view package.json scripts
cat package.json | grep -A10 "scripts"

# Run with environment variables
NODE_ENV=production npm start
NODE_ENV=development npm start

# Run with command line arguments (for CLI applications)
npm start -- --help
npm start -- --config ./config.json
node dist/index.js --help
```

## 🔄 Daily Development Workflow

### 1. Start of Day
```bash
# Pull latest changes
git pull origin main

# Check for updates
git status
git log --oneline -5

# Install any new dependencies
npm install

# Build project
npm run build
```

### 2. Feature Development
```bash
# Create feature branch
git checkout -b feature/add-new-functionality
# or
git switch -c feature/add-new-functionality

# Make changes, then check status
git status
git diff

# Stage and commit changes
git add .
# or selective staging
git add src/specific-file.js

# Commit with descriptive message
git commit -m "feat: Add new IoT certificate management feature

- Implement certificate rotation logic
- Add parameter store integration
- Include error handling for AWS API calls"
```

### 3. Testing Changes
```bash
# Build to check for compilation errors
npm run build

# Run tests (if available)
npm test
npm run test:watch

# Check for security vulnerabilities
npm audit
npm audit fix

# Lint code (if configured)
npm run lint
npm run lint:fix
```

## 📦 Dependency Management

### Adding Dependencies
```bash
# Add production dependency
npm install @aws-sdk/client-iot
npm install commander@^14.0.1

# Add development dependency
npm install --save-dev typescript
npm install -D @types/node

# Add global tool
npm install -g @typescript-eslint/cli
```

### Updating Dependencies
```bash
# Check outdated packages
npm outdated

# Update all packages (respecting semver)
npm update

# Update specific package
npm install @aws-sdk/client-iot@latest

# Update package.json ranges
npm install @aws-sdk/client-iot@^3.914.0
```

### Dependency Auditing
```bash
# Security audit
npm audit
npm audit --audit-level=moderate
npm audit fix
npm audit fix --force  # Use with caution

# Check specific package info
npm info @aws-sdk/client-iot
npm info @aws-sdk/client-iot versions --json
```

### Managing Lock Files
```bash
# Generate fresh package-lock.json
rm package-lock.json
npm install

# Verify integrity
npm ci  # Clean install from lock file

# Update lock file only
npm update --package-lock-only
```

## 🧪 Testing & Quality Assurance

### Build & Compilation
```bash
# TypeScript compilation
npm run build
npx tsc
npx tsc --noEmit  # Check only, don't emit files

# Watch mode for development
npx tsc --watch
```

### Code Quality
```bash
# Run linting
npm run lint
npx eslint src/
npx eslint src/ --fix

# Format code
npm run format
npx prettier --write src/
```

### Testing Commands
```bash
# Run all tests
npm test
npm run test:unit
npm run test:integration

# Test with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🌿 Version Control & Collaboration

### Branch Management
```bash
# List branches
git branch
git branch -r  # Remote branches
git branch -a  # All branches

# Switch branches
git switch main
git checkout main
git switch -c feature/new-branch

# Delete branches
git branch -d feature/completed-feature
git push origin --delete feature/completed-feature
```

### Commit Best Practices
```bash
# Staged changes review
git diff --cached

# Commit with conventional commit format
git commit -m "feat: Add certificate auto-rotation"
git commit -m "fix: Resolve AWS API timeout issues"
git commit -m "docs: Update API documentation"
git commit -m "chore: Update dependencies"

# Amend last commit
git commit --amend
git commit --amend --no-edit
```

### Pushing & Pull Requests
```bash
# Push feature branch
git push origin feature/add-new-functionality
git push -u origin feature/add-new-functionality  # Set upstream

# Create pull request with GitHub CLI
gh pr create --title "Add certificate management" --body "Implements auto-rotation for IoT certificates"
gh pr create --draft  # Create as draft

# View PRs
gh pr list
gh pr list --state open
gh pr view 123
gh pr view --web  # Open in browser
```

## ⚡ CI/CD & Automation

### GitHub Actions Workflow Commands
```bash
# View workflow runs
gh run list
gh run list --limit 10
gh run list --workflow="CI"

# View specific run
gh run view 123456789
gh run view --log
gh run view --log --job=build

# Re-run workflows
gh run rerun 123456789
```

### Working with Dependabot
```bash
# View dependabot PRs
gh pr list --author="app/dependabot"

# Auto-merge dependabot PR (if configured)
gh pr merge --auto --squash

# Close dependabot PR
gh pr close 432
gh pr reopen 432  # Reopen to trigger new workflow
```

### Workflow Debugging
```bash
# Check workflow status
gh run list --status=failure
gh run list --status=in_progress

# Download logs
gh run download 123456789

# View specific job logs
gh run view --log --job=53409150667
```

## 🚢 Release Management

### Versioning
```bash
# Update version in package.json
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0

# Create version with tag
npm version patch --tag-version-prefix="v"
```

### Tagging & Releases
```bash
# Create and push tag
git tag v1.0.0
git push origin v1.0.0
git push origin --tags

# Create GitHub release
gh release create v1.0.0 --title "Version 1.0.0" --notes "Initial release"
gh release create v1.0.0 --generate-notes  # Auto-generate notes
```

### Publishing (if applicable)
```bash
# Build for production
npm run build

# Publish to npm registry
npm publish
npm publish --dry-run  # Test without publishing
npm publish --access public  # For scoped packages
```

## 🔧 Troubleshooting & Maintenance

### Common Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install

# Fix permission issues
sudo npm install -g npm@latest
npm config get prefix
```

### Debugging
```bash
# Verbose npm commands
npm install --verbose
npm run build --verbose

# Check npm configuration
npm config list
npm config get registry

# Node/npm environment
node --version
npm --version
which node
which npm
```

### Git Troubleshooting
```bash
# Undo last commit (keep changes)
git reset HEAD~1

# Undo changes in working directory
git checkout -- file.js
git restore file.js

# Force pull (destructive)
git fetch origin
git reset --hard origin/main

# Stash changes temporarily
git stash
git stash pop
git stash list
```

## 🛡️ Security & Best Practices

### Security Auditing
```bash
# Security audit with different levels
npm audit --audit-level=low
npm audit --audit-level=moderate
npm audit --audit-level=high
npm audit --audit-level=critical

# Review vulnerabilities
npm audit --json
npm audit --parseable
```

### Environment Management
```bash
# Check environment variables
printenv | grep NODE
echo $NODE_ENV

# Set environment for commands
NODE_ENV=production npm run build
NODE_ENV=development npm start
```

### Clean Development Environment
```bash
# Fresh start workflow
git pull origin main
rm -rf node_modules package-lock.json
npm cache clean --force
npm ci
npm run build
npm test
```

## 🤖 Automation Examples

### Pre-commit Hooks
```bash
# Install husky for git hooks
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm run lint && npm run build"
```

### Automated Workflows
```bash
# Dependabot auto-merge (from our conversation)
gh pr list --author="app/dependabot" --state=open
gh pr merge --auto --squash

# Batch operations
for pr in $(gh pr list --state=open --json number --jq '.[].number'); do
  gh pr view $pr
done
```

## 📚 Common Command Combinations

### Daily Standup Prep
```bash
# What did I work on yesterday?
git log --author="$(git config user.name)" --since="yesterday" --oneline
gh pr list --author="@me"
```

### Pre-deployment Checklist
```bash
npm ci                    # Clean install
npm run build            # Build project
npm test                 # Run tests  
npm audit                # Security check
git status               # Ensure clean working directory
gh pr list --state=open  # Check pending PRs
```

### Emergency Hotfix Workflow
```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix
# Make fix
git add .
git commit -m "hotfix: Patch critical security vulnerability"
git push origin hotfix/critical-security-fix
gh pr create --title "URGENT: Security Hotfix" --body "Critical security patch"
```

---

## 💡 Pro Tips

1. **Use `.nvmrc`**: Ensures team uses same Node version
2. **Conventional Commits**: Use `feat:`, `fix:`, `docs:`, `chore:` prefixes
3. **Package-lock.json**: Always commit this file
4. **npm ci**: Use in CI/CD, `npm install` for local development
5. **Security First**: Run `npm audit` regularly
6. **Branch Protection**: Use GitHub branch protection rules
7. **Dependabot**: Configure for automatic security updates
8. **Environment Variables**: Never commit sensitive data

## 🔗 Related Documentation

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub CLI Manual](https://cli.github.com/manual/)
- [npm CLI Documentation](https://docs.npmjs.com/cli/)
- [Git Documentation](https://git-scm.com/docs)

---

*This cheat sheet is based on real-world workflows from the iot-garden project, including dependabot automation, Node.js standardization, and CI/CD pipeline management.*
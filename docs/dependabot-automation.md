# Dependabot Automation Setup

This repository is configured with autonomous dependabot updates that minimize human intervention while maintaining security and stability.

## How It Works

### 🤖 Automated Dependency Updates

**Dependabot Configuration** (`.github/dependabot.yml`)
- Runs weekly on Mondays at 9 AM UTC
- Groups related updates (AWS SDK, dev dependencies) to reduce PR noise
- Limited to 10 open PRs maximum
- Automatically assigns you as reviewer

### 🔄 Auto-Merge Process

**Automatic Merging** (`.github/workflows/dependabot-auto-merge.yml`)
- **✅ Auto-merges:** Patch and minor version updates
- **⏸️ Requires human review:** Major versions and security updates
- **Prerequisites:** All CI checks must pass
- **Safety:** Waits up to 10 minutes for CI completion

#### Auto-Merge Criteria
- ✅ Patch updates (`1.0.0` → `1.0.1`)
- ✅ Minor updates (`1.0.0` → `1.1.0`)
- ✅ PRs labeled `auto-merge-candidate`
- ❌ Major updates (`1.0.0` → `2.0.0`)
- ❌ Security updates (flagged for human review)
- ❌ Breaking changes

### 🔒 Security Handling

**Security Updates** (`.github/workflows/security-updates.yml`)
- Daily security scans at 9 AM UTC
- Automatic issue creation for vulnerabilities
- Security PRs require manual approval
- High-priority labeling for urgent attention

### 📊 Monitoring & Health Checks

**Automation Monitoring** (`.github/workflows/automation-monitoring.yml`)
- Weekly health reports on Sundays
- Tracks stale PRs (>7 days old)
- Identifies failed auto-merge attempts
- Creates monitoring issues when intervention needed

### 🧪 Continuous Integration

**CI Pipeline** (`.github/workflows/ci.yml`)
- Runs on all PRs and main branch pushes
- Builds TypeScript project
- Performs security audit
- Required for auto-merge approval

## When Human Intervention Is Required

### 🚨 Automatic Alerts
You'll receive notifications for:
- Major version updates
- Security vulnerabilities
- Failed CI checks
- Stale PRs (>14 days)
- Auto-merge failures

### 🏷️ Labels to Watch
- `needs-human-review` - Requires manual approval
- `major-version-update` - Breaking changes possible
- `security` - Security-related updates
- `auto-merge-failed` - Automation couldn't merge
- `high-priority` - Urgent attention needed

## Manual Override

### Forcing Auto-Merge
Add the `auto-merge-candidate` label to any dependabot PR to force auto-merge (if CI passes).

### Preventing Auto-Merge
- Remove the `auto-merge-candidate` label
- Add `needs-human-review` label
- The automation will skip the PR

### Emergency Stop
To temporarily disable automation:
1. Disable the "Dependabot Auto-Merge" workflow in GitHub Actions
2. Re-enable when ready to resume

## Configuration Customization

### Adjusting Auto-Merge Criteria
Edit `.github/workflows/dependabot-auto-merge.yml`:
- Modify the conditions in the "Auto-approve and merge" step
- Change merge method (`squash`, `merge`, `rebase`)
- Adjust wait times and retry logic

### Changing Update Frequency
Edit `.github/dependabot.yml`:
- Modify `schedule.interval` (daily, weekly, monthly)
- Adjust `schedule.day` and `schedule.time`
- Change `open-pull-requests-limit`

### Security Thresholds
Edit `.github/workflows/security-updates.yml`:
- Modify `--audit-level` (low, moderate, high, critical)
- Adjust scan frequency in cron schedule

## Troubleshooting

### Common Issues

**Auto-merge not working:**
- Check CI status - all checks must pass
- Verify PR meets auto-merge criteria
- Check workflow logs for errors

**Too many notifications:**
- Adjust dependabot group configurations
- Modify notification labels
- Reduce scan frequencies

**Missing security alerts:**
- Verify GitHub security features are enabled
- Check workflow permissions
- Ensure npm audit is working

### Getting Help
- Check workflow logs in GitHub Actions
- Review monitoring issues created by automation
- Look for `automation-monitoring` labeled issues

## Benefits

✅ **Reduced maintenance overhead** - Most updates happen automatically
✅ **Security focused** - Critical security updates get immediate attention  
✅ **Stability maintained** - Major changes require human review
✅ **Full visibility** - Comprehensive monitoring and reporting
✅ **Easy override** - Manual control when needed
✅ **Failure resilient** - Automated error detection and reporting
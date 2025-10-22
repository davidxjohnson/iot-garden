# Dependabot Ignore Rules Examples

## Common Ignore Patterns

### Ignore Specific Dependencies
```yaml
# Add to your dependabot.yml under the npm ecosystem:
ignore:
  # Ignore all updates to a specific package
  - dependency-name: "@aws-sdk/client-s3"
  
  # Ignore major version updates only
  - dependency-name: "@aws-sdk/*"
    update-types: ["version-update:semver-major"]
  
  # Ignore specific versions
  - dependency-name: "@types/node"
    versions: ["24.9.x", "25.x"]
  
  # Ignore version ranges
  - dependency-name: "typescript"
    versions: [">= 5.5.0, < 6.0.0"]
```

### Complete Example with Ignore Rules
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/sdk"
    schedule:
      interval: "weekly"
    groups:
      aws-sdk:
        patterns:
          - "@aws-sdk/*"
        update-types:
          - "minor"
          - "patch"
    # Ignore rules
    ignore:
      # Don't update major versions automatically
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]
      
      # Ignore specific problematic packages
      - dependency-name: "@aws-sdk/client-iot"
        versions: ["3.914.x"]
      
      # Ignore Node types above 24.x
      - dependency-name: "@types/node"
        versions: [">= 25.0.0"]
```

## When to Use Ignore Rules

### ✅ **Good Use Cases:**
- **Problematic versions**: A specific version causes issues
- **Major version control**: Want to handle major updates manually
- **Stability requirements**: Need to stay on a specific version range
- **Testing cycles**: Want to batch major updates for specific testing periods

### ❌ **Avoid Over-Ignoring:**
- Don't ignore security updates without good reason
- Don't ignore patch updates (they're usually safe bug fixes)
- Don't ignore dev dependencies unless they break your build

## Current System Behavior

With your current setup:
- **Minor/patch updates**: Automatically grouped and merged
- **Major updates**: Will create separate PRs requiring human review
- **Security updates**: Handled by special security workflow
- **Dev dependencies**: Grouped separately from production dependencies
# Release Process

This document outlines the standard, lightweight process for releasing new versions of the AI Engineering Workspace Kit. We adhere to [Semantic Versioning](https://semver.org/).

## Version Logic
- **MAJOR (x.0.0)**: Breaking changes in kit rules or structure.
- **MINOR (0.x.0)**: New backward-compatible functionality (e.g., new skills or rules).
- **PATCH (0.0.x)**: Fixes and minor script improvements.

## Minimal Release Strategy

When you are ready to cut a new release, follow these steps locally:

1. **Update Files**: Ensure any new scripts, templates, or rule modifications are complete.
2. **Update Changelog**: Add the new version block in `CHANGELOG.md` corresponding to the upcoming Git tag. Look at previous entries for formatting.
3. **Commit Changes**: Use Conventional Commits.
   ```bash
   git commit -m "chore(release): bump to version vX.Y.Z"
   ```
4. **Create Tag**: Generate the Git tag pointing strictly to your release commit.
   ```bash
   git tag vX.Y.Z
   ```
5. **Push Branch**: Send the base repository updates to GitHub.
   ```bash
   git push origin main
   ```
6. **Push Tag**: Send the newly created tag to GitHub.
   ```bash
   git push origin vX.Y.Z
   ```
7. **Create GitHub Release**: Go directly to the GitHub repository UI (`Tags` -> `Create Release`), pick the new tag, set the title to `vX.Y.Z`, and copy-paste the corresponding section from `CHANGELOG.md` as the release notes.

> **Note**: Avoid unnecessary automation plugins or CI/CD pipelines until scaling requirements explicitly demand them.

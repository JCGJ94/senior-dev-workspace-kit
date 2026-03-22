# Homebrew Tap Setup

This guide explains how to set up the `pedrito-tap` Homebrew tap so users can install Pedrito with `brew install`.

## Prerequisites

- A GitHub account and access to the `josec/pedrito` repository.
- Homebrew installed on macOS.

---

## Step 1: Create the tap repository

Create a new public GitHub repository named exactly **`homebrew-pedrito`** (Homebrew convention: `homebrew-<tap-name>`).

```bash
# via GitHub CLI
gh repo create josec/homebrew-pedrito --public --description "Homebrew tap for Pedrito V4"
```

Clone it locally:
```bash
git clone https://github.com/josec/homebrew-pedrito
cd homebrew-pedrito
mkdir Formula
```

---

## Step 2: Copy the formula

Copy `Formula/pedrito.rb` from this repository into the tap:

```bash
cp /path/to/pedrito/Formula/pedrito.rb homebrew-pedrito/Formula/pedrito.rb
```

---

## Step 3: Update SHA256 checksums

After a GitHub Release is published, update the two `sha256` placeholders in `Formula/pedrito.rb` with the actual checksums from the release:

```bash
# Download the tar.gz checksum files from the release
curl -fsSL https://github.com/josec/pedrito/releases/download/v4.0.0/pedrito-macos-arm64.tar.gz.sha256
curl -fsSL https://github.com/josec/pedrito/releases/download/v4.0.0/pedrito-macos-x64.tar.gz.sha256
```

Edit `Formula/pedrito.rb` and replace `PLACEHOLDER_MACOS_ARM64_SHA256` and `PLACEHOLDER_MACOS_X64_SHA256` with the actual hashes.

---

## Step 4: Push and verify

```bash
cd homebrew-pedrito
git add Formula/pedrito.rb
git commit -m "feat: add pedrito v4.0.0"
git push

# Verify Ruby syntax
ruby -c Formula/pedrito.rb
```

---

## Step 5: Test the tap locally

```bash
brew tap josec/pedrito
brew install pedrito

pedrito version   # should print 4.0.0
brew test pedrito # runs the formula's test block
```

---

## Updating after a new release

When a new Pedrito version is published:

1. Update `version` in `Formula/pedrito.rb`.
2. Update both `sha256` values (download `.tar.gz.sha256` from the new release).
3. Push to `homebrew-pedrito`.

Future improvement: automate this via a GitHub Actions workflow in `pedrito` that PRs the tap after each release (Phase 8 self-update scope).

---

## User install command (for documentation)

```bash
brew tap josec/pedrito
brew install pedrito
```

Or in one line:
```bash
brew install josec/pedrito/pedrito
```

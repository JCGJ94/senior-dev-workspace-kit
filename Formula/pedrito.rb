class Pedrito < Formula
  desc "AI Engineering Workspace Kit — governance, memory, and code review for AI agents"
  homepage "https://github.com/josec/pedrito"
  version "4.0.0"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/josec/pedrito/releases/download/v#{version}/pedrito-macos-arm64.tar.gz"
      sha256 "PLACEHOLDER_MACOS_ARM64_SHA256"
    end

    on_intel do
      url "https://github.com/josec/pedrito/releases/download/v#{version}/pedrito-macos-x64.tar.gz"
      sha256 "PLACEHOLDER_MACOS_X64_SHA256"
    end
  end

  def install
    if Hardware::CPU.arm?
      target = "macos-arm64"
    else
      target = "macos-x64"
    end

    bin.install "pedrito-#{target}" => "pedrito"
    bin.install "pedrito-engram-#{target}" => "pedrito-engram"
    bin.install "gga-#{target}" => "gga"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/pedrito version")
    assert_match version.to_s, shell_output("#{bin}/pedrito-engram version")
    assert_match version.to_s, shell_output("#{bin}/gga version")
  end
end

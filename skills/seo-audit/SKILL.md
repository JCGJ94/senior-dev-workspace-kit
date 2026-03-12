# SEO Audit

## Purpose
Identify SEO issues and provide actionable recommendations to improve organic search performance by auditing site crawlability, technical foundations, on-page optimization, content quality, and authority.

## Use when
- Auditing or diagnosing SEO issues ("my traffic dropped", "SEO check", "not ranking").
- Reviewing meta tags, broken links, or crawl errors on a web property.

## Do not use when
- Automating programmatic page generation (use programmatic-seo instead).
- Executing pure backend database transformations unrelated to site routing or meta output.

## Audit Framework
1. **Crawlability & Indexation**: Robots.txt, XML sitemap, internal linking, URL structures.
2. **Technical Foundations**: Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1), mobile responsiveness, HTTPS.
3. **On-Page Optimization**: Unique title tags (50-60 chars), meta descriptions (150-160 chars), proper H1-H3 semantics, keyword targeting.
4. **Content Quality**: E-E-A-T signals, depth, format, and semantic relevance.

## Rules
- **No Assumptions on Schema**: `web_fetch`/`curl` cannot reliably detect JS-injected JSON-LD. Use browser rendering or the Google Rich Results Test to confirm structured data.
- **Review Prior Context**: Read `.agents/product-marketing-context.md` before asking redundant business questions.
- **Fix Don't Just Report**: Automatically fix straightforward issues (like alt text or heading levels) via parallelized file edits when confirmed.

## Context Efficiency
- Query specific site maps or targeted landing pages rather than spidering the entire domain exhaustively blindly via normal browsing tools.

## Validation
- Missing meta tags are patched in the markdown/html code.
- Rendered pages pass Lighthouse / Core Web Vitals basic tests locally if measurable.
- Title and description lengths conform strictly to Google truncation limits.

## Output

Return an Audit Report Structure:
### Executive Summary
Overall health assessment and top priority issues.
### Technical & On-Page Findings
Issue, Impact (High/Medium/Low), Evidence, and Fix Recommendation.
### Action Plan
Prioritized sequence of steps to deploy the SEO fixes to the repository.

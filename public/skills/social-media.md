---
name: social-media
description: Social media content pipeline skill. Generate content calendars, write platform-native posts for LinkedIn/X/Instagram, research hashtags, repurpose long-form content, and schedule via Buffer. Use when the user wants to create social content, build a content calendar, repurpose content, or schedule posts.
version: 1.0.0
license: commercial
---

# Social Media Pipeline Skill

You are a social media content strategist and copywriter. When invoked, you help users create platform-native content at scale — from a single idea or long-form source to a full week of posts optimized for LinkedIn, X/Twitter, and Instagram.

## Capabilities

### 1. Content Calendar Generation
Build weekly or monthly content calendars based on:
- User's niche, industry, and goals
- Brand voice and tone guidelines
- Mix of content types (educational, promotional, personal, engagement)
- Platform-appropriate posting frequency

Default posting cadence:
- **LinkedIn**: 5x/week (Mon–Fri)
- **X/Twitter**: 7x/week (daily + threads)
- **Instagram**: 4x/week (feed) + 3x/week (stories)

### 2. Platform-Native Post Writing

**LinkedIn:**
- Professional tone with storytelling hook
- 150–300 words for thought leadership posts
- Line breaks for readability (no walls of text)
- Clear CTA (comment, share, follow)
- 3–5 hashtags max

**X/Twitter:**
- Punchy, conversational, under 280 characters for single posts
- Threads: 5–12 tweets, numbered, opening hook + insights + CTA
- No hashtag stuffing (1–2 max per tweet, 3–5 for threads)

**Instagram:**
- Caption: hook in first line (before "more"), 150–300 words
- Storytelling with emotion
- 20–30 hashtags (mix of size tiers: mega/macro/mid/micro/niche)
- Emojis for visual rhythm

### 3. Hashtag Research & Optimization
For each platform and topic, generate a hashtag strategy:

```
Tier structure (Instagram):
- 3–5 mega tags (1M+ posts) — for discovery
- 5–7 macro tags (100K–1M posts) — for reach
- 8–10 mid tags (10K–100K posts) — for engagement
- 5–7 micro tags (1K–10K posts) — for niche targeting

X/Twitter: use 1–2 trending tags per post, 3–5 per thread
LinkedIn: use 3–5 industry-specific tags per post
```

### 4. Content Repurposing
Transform any source into multi-platform content:
- **Blog post → social series**: extract 5–10 key insights, one post each
- **Podcast/video transcript → content**: pull quotes, stats, frameworks
- **Case study → story posts**: before/after narrative + results
- **Newsletter → LinkedIn posts + X threads + Instagram carousels**

Repurposing workflow:
1. Extract 3–5 core ideas from source
2. Identify the best format per platform
3. Adapt voice and length per platform
4. Generate CTAs pointing back to original (when relevant)

### 5. Buffer Integration (Scheduling)
Schedule posts directly via Buffer API:

```
Required env: BUFFER_ACCESS_TOKEN
Optional env: BUFFER_PROFILE_ID_LINKEDIN, BUFFER_PROFILE_ID_TWITTER, BUFFER_PROFILE_ID_INSTAGRAM
```

When scheduling:
- Respect each platform's optimal posting times (see schedule below)
- Stagger posts 2+ hours apart
- Include media placeholders in schedule output

Optimal posting windows (all times local):
- **LinkedIn**: Tue–Thu, 8–10am and 12–2pm
- **X/Twitter**: 9am–12pm and 5–7pm
- **Instagram**: 11am–1pm and 7–9pm

If Buffer is not configured, output a ready-to-paste schedule table with timestamps.

### 6. Engagement Analytics Templates
Generate tracking templates for:
- Weekly engagement report (reach, impressions, likes, comments, shares, saves)
- Best-performing post analysis
- Hashtag performance tracking
- Follower growth vs. posting frequency correlation
- Content type breakdown (which formats drive most engagement)

## How to Use

### Generate a weekly content calendar
```
use social-media skill to create a content calendar for next week
niche: B2B SaaS founder
goals: grow LinkedIn following, drive newsletter signups
voice: direct, data-driven, occasionally funny
```

### Repurpose a blog post
```
use social-media skill to repurpose this blog post into social content:
[paste URL or text]
platforms: linkedin, twitter
```

### Write a single post
```
use social-media skill to write a LinkedIn post about:
topic: why we switched from Slack to async-first communication
hook: frame as a mistake we made for 2 years
```

### Build a full week from a theme
```
use social-media skill to build a Twitter content week on the theme:
"AI agents are eating software"
include: 2 threads + 5 single tweets + 7 LinkedIn posts
```

### Schedule via Buffer
```
use social-media skill to schedule this week's content to Buffer
[paste content or calendar]
start date: 2026-03-17
```

## Output Formats

### Content Calendar (weekly)
```markdown
## Week of [DATE]

### Monday
**LinkedIn** (post at 9am):
[post content]
Hashtags: #tag1 #tag2 #tag3
---
**X/Twitter** (post at 10am):
[tweet]
---

### Tuesday
...
```

### Repurposed Content Package
```markdown
## Source: [title/URL]

### LinkedIn Post
[content]

### X Thread (7 tweets)
1/ [hook]
2/ [insight]
...
7/ [CTA]

### Instagram Caption
[hook line]
...
[hashtags]
```

### Buffer Schedule (JSON)
```json
{
  "posts": [
    {
      "profile_id": "{{BUFFER_PROFILE_ID_LINKEDIN}}",
      "text": "...",
      "scheduled_at": "2026-03-17T09:00:00+00:00"
    }
  ]
}
```

## Configuration

Environment variables (optional — skill works without them but scheduling requires Buffer):
- `BUFFER_ACCESS_TOKEN` — Buffer API token for scheduling
- `BUFFER_PROFILE_ID_LINKEDIN` — Buffer profile ID for LinkedIn
- `BUFFER_PROFILE_ID_TWITTER` — Buffer profile ID for X/Twitter
- `BUFFER_PROFILE_ID_INSTAGRAM` — Buffer profile ID for Instagram

## Best Practices

1. **Batch content creation** — write a full week at once, not day by day
2. **Repurpose everything** — one blog post = 10+ social posts
3. **Front-load the hook** — first line determines if they read further
4. **Platform voice is non-negotiable** — LinkedIn ≠ Twitter ≠ Instagram
5. **Post consistently before optimizing** — 30 days of daily posting before A/B testing
6. **Engage within 60 minutes** — reply to comments right after posting
7. **Track saves, not just likes** — saves = signal of real value on Instagram

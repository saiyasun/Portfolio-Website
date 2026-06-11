---
{
    "slug": "making-a-game-in-real-time",
    "title": {
        "en": "Making a Game in Real Time",
        "zh": "即時把遊戲做出來"
    },
    "description": {
        "en": "How a gray box prototype, written rules, pixel art, and messy animation experiments helped AS ONE become something real.",
        "zh": "我如何透過 gray box 原型、規則文件、pixel art 和混亂的動畫實驗，讓 AS ONE 變成真正存在的東西。"
    },
    "tags": {
        "en": [
            "game development",
            "vibe coding",
            "ai",
            "as one",
            "prototyping"
        ],
        "zh": [
            "遊戲開發",
            "vibe coding",
            "AI",
            "AS ONE",
            "原型製作"
        ]
    },
    "preview_image": "s002-01.png",
    "published": {
        "uploaded": "2026-05-04T00:00:00+08:00",
        "edited": {
            "en": "",
            "zh": ""
        }
    },
    "featured": false,
    "series": {
        "is_series": true,
        "id": "s002",
        "order": 3
    }
}
---

**A journey of 1,000 miles starts with a single step. Figuring out the direction is where it gets hard.**

## Turning an Idea Into Something That Actually Works

After narrowing my idea down to something I could actually build, the next problem was figuring out how to build it.

Up to this point, everything was still in my head.

### From Idea to Something Testable

The first thing I did was create a very rough prototype to test the gameplay loop.

I built a simple gray box version of the game using Google Antigravity as my main IDE. The goal wasn’t to make it look good. It was just to answer one question:

Does this idea actually work?

At the same time, I created a markdown file to define the rules of the game. I wrote out how everything should function, what each character could do, and how the flow of the game should feel.

At first, my ideas were vague. But the more I wrote them down, the clearer they became. Defining the rules forced me to confront all the parts I had been hand-waving in my head.

### Where It Broke

Once I had a rough version of `game-rules.md`, I built a small test to see how the gameplay actually felt.

One issue stood out immediately. I had written instructions for the girl character where her animal could die, but I never specified what should happen after that. The system didn’t know how to handle it because I hadn’t told it.

Up to that point, I was still assuming things would “just work.” But with AI, nothing works unless you define it clearly. I learned very quickly that even with how advanced AI is, you still often need to be very explicit. You can't leave anything up to assumptions.

### It Was Harder Than I Thought

At this point, I started to realize this was more difficult than I expected.

Not because the tools were bad, but because I had to think more clearly than I was used to. Every vague idea became a problem the moment I tried to turn it into something real.

### Building the Visuals

After getting a basic loop working, I moved on to visuals.

I started creating pixel art and came across this article:
https://x.com/chongdashu/status/2047271308166078951

One thing that I tried was a 1024x1024 reference grid. It was supposed to give the AI something to keep the characters consistent. But, I had mixed results with this method.

### The Problem With Animations

ChatGPT and most image generation tools are not good at creating usable spritesheets. Getting consistent frames across multiple images was extremely difficult.

So, I used a video generation model (a free trial of Grok Imagine Pro) and extracted frames from the video instead. That worked much better. It gave me consistent motion that I could break down into frames.

I also learned that the way you describe animations matters a lot.

At first, I would say things like “idle animation.”

That didn’t work.

I had to switch to describing very specific actions:

- Tiger: snarling, no movement, no effects  
- Officer: subtle breathing, slight chest movement  
- Man: standing and breathing, no movement  
- Girl: standing and breathing, no movement  

The more specific I was, the better the result.

It also helped to use a bright, solid background so I could easily extract frames later using tools like Spritely.

### Getting Closer to What I Wanted

As I kept building, I noticed something interesting.

Adding actual code (HTML, CSS, small logic pieces) often gave me better results than just describing what I wanted. For example, I needed a platform for my characters to stand (I called them battle lanes). But without the actual code to constrain it, AI kept giving me full background scenes that weren't suitable for what I was trying to build.

It made things more concrete, and the AI could work from something real instead of guessing.

### What I Learned From This

The biggest takeaway from this part of the process is that small, clear steps matter more than big ideas. Trying to jump from nothing to a complete system doesn’t work. Breaking things down step by step does.

It also forced me to think more carefully about what the project actually needed. Not what I imagined it could be, but what it needed right now to function. Sometimes, doing one or two things manually gave better results than trying to generate everything. Once something real exists, the AI has something to build from.

### Where This Goes

At this point, the project started to feel real.

I had something that worked, even if it was rough.

Instead of imagining what the game could be, I was now working with something that already existed.

And that made it much easier to work with.
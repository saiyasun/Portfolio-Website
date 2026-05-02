**After settling on the idea, I ran into the next problem.**

I still did not have anything.

No game.

No system.

Just an idea.

So I needed to start somewhere.

### Starting With Something Simple

I did not try to build the full game first.

I started with a gray box prototype.

No real visuals.

No polish.

Just something simple enough to test the gameplay loop.

I used Google Antigravity as my main IDE. Before building too much, I made a markdown file called `game-rules.md`.

That file became the place where I defined:

- what each character does
- how turns work
- what happens during a round

At first, everything was vague.

But once I started writing the rules down, the idea became clearer.

Not because the game suddenly became easy.

Because writing forced me to make decisions.

### Where It Broke

After making a rough version of `game-rules.md`, I built a small test.

Just enough to get a feel for the gameplay cycle.

That is when the gaps started showing up.

One example was the girl and her animal.

I had a mechanic where the animal could die. In my head, I understood what that meant. The character should probably switch out. Something else should happen. The round should respond in some way.

But I never actually defined it.

So in the test, nothing happened.

The system did not know:

- should the character switch?
- should the round end?
- what replaces the animal?

I had assumed the logic.

But I never wrote it.

### What That Taught Me

That was one of the first real lessons.

You cannot assume anything.

If it is not explicitly defined, it does not exist.

That is probably true in programming generally, but it feels even more obvious when working with AI. Vague ideas do not automatically turn into systems. The AI can help you move faster, but it cannot read the version of the idea that only exists in your head.

At this stage, clarity mattered more than creativity.

And honestly, it was harder than I expected.

### Moving Into Visuals

Once I had something functional, I started thinking about visuals.

I wanted pixel art.

I came across a post about using a reference grid for AI-generated game assets: [x.com/chongdashu/status/2047271308166078951](https://x.com/chongdashu/status/2047271308166078951).

That gave me something concrete to try.

So I made a 1024 by 1024 reference grid for the AI to follow.

That helped more than I expected.

Instead of asking the model to invent everything from scratch each time, the grid gave it a structure. It made the characters feel more consistent and gave me a better starting point.

### Animations Were Different

Then came animations.

This is where things got messy.

ChatGPT and most image generation tools were not very good at making spritesheets. At least not in a way that was clean enough for what I needed.

So I tried a different approach.

I used a video generation model and extracted frames from the video.

For that, I used Grok Imagine Pro during the three-day trial.

It was not perfect.

But it gave me something I could work with.

### Learning How to Prompt

At first, I was too vague.

I would write prompts like:

> idle animation

That did not work well.

What worked better was describing the actual action I wanted.

- Tiger - snarling, no direction change, no movement, no VFX
- Officer - subtle breathing, slight chest and shoulder movement
- Man - breathing while standing, no movement
- Girl - breathing while standing, no movement

The less abstract, the better.

I also found that a bright, solid color background made the frames easier to work with later.

Then I used Spritely to extract the frames.

It was a weird process.

Not exactly clean.

But it got me closer than asking for a perfect spritesheet.

### What Helped

One thing surprised me.

Adding HTML and CSS alongside my prompts often helped the AI get much closer to what I wanted.

That made me rethink how I was communicating with it.

Descriptions are useful, but code gives structure. It gives the AI something specific to respond to. Especially with visual work, that mattered a lot.

I started noticing a pattern.

AI works better when I give it:

- structure
- constraints
- examples

Not just a description of what I want.

### Lessons So Far

A few things became clear during this stage.

Including code is usually better than relying only on descriptions.

Building step by step works better than trying to make big leaps all at once.

Defining things forces clarity.

And sometimes doing one or two things manually gives better results than trying to automate everything immediately.

That last one surprised me.

But it makes sense.

If I do a small part myself, the AI has something real to build from.

### Where This Leaves Me

Right now, I still do not have a finished game.

But I have more than an idea.

I have:

- a working loop
- defined rules
- actual assets
- something on screen

It is still rough.

But it exists.

### Where This Goes

I am starting to understand what the project actually needs.

Not what I imagined it needing.

What it requires to work.

That is changing how I approach everything.

Next, I want to focus on making the game feel like a real experience.

Not just something that runs.

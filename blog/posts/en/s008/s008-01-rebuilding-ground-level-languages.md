---
{
    "slug": "rebuilding-ground-level-languages",
    "title": {
        "en": "Rebuilding Ground Level Languages",
        "zh": "重建 Ground Level"
    },
    "description": {
        "en": "Starting the rebuild of Ground Level into a clearer, more modular language-learning app built around sound, meaning, stories, and better lesson flow.",
        "zh": "開始重建 Ground Level，把它整理成一個更清楚、更模組化的語言學習 App，並以聲音、意義、故事和更好的課程流程為核心。"
    },
    "tags": {
        "en": [
            "language learning",
            "Ground Level",
            "app design",
            "UI design",
            "devlog"
        ],
        "zh": [
            "語言學習",
            "Ground Level",
            "App 設計",
            "介面設計",
            "開發日誌"
        ]
    },
    "preview_image": "",
    "published": {
        "uploaded": "2026-07-04T00:00:00+08:00",
        "edited": {
            "en": "",
            "zh": ""
        }
    },
    "featured": false,
    "series": {
        "is_series": true,
        "id": "s008",
        "order": 1
    }
}
---

If I had to describe my app, Ground Level Languages, in one sentence, it would be this: language learning should start with sound, not text. The idea seemed simple enough. Help the learner hear the language first, then let meaning come from stories, images, and repetition instead of immediately forcing everything through translation.

But the more I built, the more I realized that a simple idea does not automatically become a simple app.

## The Problem

In the years I've been learning Mandarin, the biggest frustration I've had is the lack of material tailored for beginners. Yes, if you Google "learn Mandarin" you'll get a lot of results on learning pinyin, the top 100 most common words, and ads for 1-on-1 tutoring. I'm not saying any of those things are useless. I have used them myself to learn some basics. 

I'm saying I don't feel they address the root issues. Many of those resources focus on meaning, vocabulary, or explanation, but they do not always train the learner to hear raw sounds accurately.

Even after learning how to say "hello" and ask for directions, I still struggled to understand real spoken Mandarin. You could call it a skill issue on my part, and that might have a bit of merit. 

I've met some people with pretty fluent Chinese that used almost exclusively traditional resources. But for every native-sounding foreigner, I've probably met ten people who have been learning for years but still sound like they just started yesterday. 

And even though I've been using Chinese as the example, I think this applies to English and all other spoken languages.

So, I don't think it's just me. I believe there is something missing at the fundamental level in the way we learn languages.

## My (Attempted) Solution

On my learning journey, I have come across a few resources that, in my opinion, stand above the rest: [Rita Chinese](https://ritachinese.com/), [Fluent Forever](https://fluent-forever.com/index.html), [The Mimic Method](https://www.mimicmethod.com/), and [Mandarin Companion](https://mandarincompanion.com/) to name a few. I think these get closer to solving the root issue, especially Rita Chinese and The Mimic Method. But even with those, I still felt there was room for me to add my solution.

Like I've mentioned, I think the main issue is that many resources don't focus on training sound perception. So, I wanted to create something that both addresses this and adds on to resources that do address this but in a more accessible and, dare I say, fun way. 

I wanted to add simplified graded stories similar to Mandarin Companion for vocabulary acquisition, the focus on sound perception similar to Rita Chinese and Mimic Method, and the no translation philosophy of Fluent Forever. I wanted to take these ideas and present them in an app that was not only informative, but engaging.

With no experience in software development or graphic design, I got to work.

## Where It Got Messy

At first, I didn't notice the deeper problems with the app.

There were bugs, of course. There were layout issues, animation issues, and plenty of moments where I had to learn something I didn't know before. But those felt like normal development problems, especially for a first-timer. I expected those.

The real problem became clear when I got my first native Mandarin recordings.

I met with someone to record audio for the demo. The recording session itself went well. She did a great job with the instructions I gave her, and I got useful audio from it. But before we started recording, I showed her the demo so she could understand the kind of experience I was trying to build.

That was when I realized the app was not as clear as I thought it was.

A lot of things that felt obvious to me were not obvious to her. Since I wanted the app to avoid text, I had tried to make the interface simple and visual. But simple didn't automatically mean clear. Some screens made sense to me, but their purpose was not immediately understandable to her as someone seeing the app for the first time.

She sometimes swiped when I expected her to tap. She tapped where I expected her to swipe. Some sections didn't clearly communicate what the learner was supposed to do or why they were doing it. It all felt obvious to me because I had the whole system in my head. But the sections often weren't doing a good job at explaining themselves.

After the recording session, the problem became even more obvious when I tried to add the new audio into the app. The content didn't fit as cleanly as I expected. Some parts of the lesson flow felt unclear. Some sections overlapped. Some pieces of audio belonged to sound practice, while others belonged to meaning and story. I realized I was trying to force different kinds of learning into one messy structure.

## What I Learned From the First Version

But the demo also gave me some positive feedback. She said some parts felt like a game, similar to Duolingo. That told me there was something worth keeping. The app did have moments that felt engaging. It's just that those moments were buried inside a structure that was not clear enough yet.

So the idea wasn't bad. It just needed to explain itself better.

## The New Direction

That's why I'm taking a step back and essentially starting from scratch. 

I created a new experimental branch on GitHub to preserve the old version, then wiped the main branch so I can rebuild the project cleanly.

The biggest lesson was that Ground Level needs to be modular. Stories, vocabulary, phonemes, tones, rhythm, and review should not feel like random activities. They should feel like connected parts of one learning path.

The current goal for the new structure separates the app into two major learning paths: meaning and sound.

The meaning side will help learners connect sound to images, stories, and recognition.

The sound side will help learners hear the raw pieces of the language more accurately, including phonemes, syllables, tones, and rhythm.

Both sides should avoid translation and text in the earliest stages as much as possible. The goal is to make learners listen first instead of immediately reading, translating, or analyzing.

I want to build this slowly and document the process as I go. That means focusing not only on the code, but also on interaction design, visual design, and the actual learning experience.

The first version helped me understand what Ground Level Languages could be.

The rebuild is about making that idea clear enough for someone else to understand without me standing next to them explaining it.

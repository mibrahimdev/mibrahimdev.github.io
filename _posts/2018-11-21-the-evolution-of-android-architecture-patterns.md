---
layout: post
title: "The Evolution of Android Architecture patterns"
date: 2018-11-21
canonical_url: https://medium.com/@mibrahimdev/the-evolution-of-android-architecture-patterns-6ab78b81570a
original_publication: Medium
description: "The main problem that Android community started to realize in the last few years is how much coupling in Presentation layer they have in Android apps."
---

![](/images/posts/the-evolution-of-android-architecture-patterns/01.jpeg)

The main problem that Android community started to realize in the last few years is how much coupling in Presentation layer they have in Android apps.

This led to spaghetti code, that hard to maintain, hard to build up to, and this really hurts the business, so community starts to think of another architecture patterns that make life easier, that minimize the +1000 line Activity classes we have .. Those patterns have one purpose .. “**separate of concerns**”.

First design pattern we thought that will solve our problems, and put the last nail in the coffin of MVC was the **MVP**pattern**,** which gave us a glimpse of what clean, maintainable code should be, then we’ve became a little bored of writing the getView().doSomeUIThing() .. we thought that a reactive abraoch will solve MVP problems, so we moved a little to **MVVM**pattern where you use the Observer pattern to make View and ViewModel communicate with each other. and that really helped a lot.

along the way there were tools that either community/Google developed for Android or we discovered and make the use of it .. some of them was a mistake (DataBinding: the writing code in XML part), some of them was a great way to bring functional programming and its way of thinking to the Java world Rxjava as an example.

after using MVP and MVVM for a while we noticed the State problem, showing an error with loading indicator at the same time, so Hannes Dorfman came with the Mosby and the **MVI** pattern inspired of cycle Js and redux from the Javascript world, which I know nothing about except the names :D, MVI compose some of the great principles to get [clean code](https://www.linkedin.com/pulse/clean-code-notes-mohamed-ibrahim/) right.

One state at a time .. Immutable models, UDF, pure functions, those principle give us a predictable behavior of the UI, which makes debugging a lot more easier.

if my opinion matters, I’ve worked with the MVP, MVVM and currently playing with MVI and what I think is .. Your situation decides which pattern is the best for you So don’t couple yourself to patterns, or tools, just stick with the big picture, the principles, how to apply those principles with minimum, simple code .. I know this is the hardest thing Developer could do, but as **Leonardo Da Vinci** said once

> *“simplicity is the ultimate sophistication.”*

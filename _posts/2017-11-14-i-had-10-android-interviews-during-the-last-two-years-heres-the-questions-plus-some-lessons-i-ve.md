---
layout: post
title: "I had 10 Android interviews during the last two years, here’s the questions plus some lessons I’ve…"
date: 2017-11-14
canonical_url: https://medium.com/android-news/i-had-10-android-interviews-during-the-last-two-years-heres-the-questions-plus-some-lessons-i-ve-cdc583dfbc65
original_publication: Android News
description: "I wrote this blog post at the Udacity forum, thought sharing it here is a good thing."
---

### I had 10 Android interviews during the last two years, here’s the questions plus some lessons I’ve learned

![](/images/posts/i-had-10-android-interviews-during-the-last-two-years-heres-the-questions-plus-some-lessons-i-ve/01.jpeg)

*I wrote this blog post at the Udacity forum, thought sharing it here is a good thing.*

2 years passed since I started Android development, I was amazed by the amount of resources out there to learn Android, how the community share knowledge and co-operate to make Android development more fun, and how the Android developers attitude grows from just building things to create testable, maintainable, and easy way to communicate … code.

Through those 2 years I had bunch of interviews, some go smooth, some not, but each time I look back and see what I missed. Usually the purpose of interviews is to land a job, but it’s also a great way to sense your level of understanding of tools, language and development cycle.

I’m not a computer science major, so I’ve figured a lot of stuff from reading, watching talks, tutorial and of course Udacity materials, I even had this course with MAL, was named “Android fundamentals” back then, and from that point was my start with Android development.

So after counting the interviews, they are 10 interviews with many questions, first I’ll list the companies (no names just initials) and the interview style of each, then I’ll list all questions I’ve remembered … let’s start

### Interviews Styles

EP: Regular Android development and Java questions. — Task: Login screen with email and password, user should login automatically the second app use.

IC: Friendly interview, talking about tools and technologies and code quality. — Task: Non

SD: testing the flexibility of candidate attitude (e.g your ability to switch between hybrid and native) — Task: make a bucket game that collect one type of falling things.

AT: Regular Android development and Java questions — Task: Non.

AR: Regular Android development and Java questions — Task: Non

SW: Regular Android development and Java questions — Task: Non.

RA: Questions get harder the more you answer them correctly — Task: Photo app that label captured image with weather info.

VN: Questions get harder the more you answer them correctly. It was friendly talk too — Task: Non

IB: Java focused and Questions getting harder — Task: Master detail app that show list of airlines retrieved from server api.

WM: Java and Android and testing the flexible attitude — Task: Non

That’s all I hope I didn’t forget something, but why did I list interviews like this? because companies are different, some of them may need an Android developer just to do the job and to do it perfect, they are the big companies usually.

Others may need an open minded developer, fast learner, could work on other technologies (back-end, System admin … etc), they may be a small companies or startups. And each company has a specific purpose to hire you. So you shouldn’t focus only on the technical stuff, do your search about the company, try their apps before the interview. Prepare your question to ask them, because it’s not a one way interview, and it never has been one.

I’ll list the questions now, and it’s better to not find one answer for each question and memories it, this is very bad … try to read stackoverflow threads about the subject, read the comments too, I found it the best place that explain technical subjects to humans, because everyone there is trying to explain it the best.

Try to do sample apps, for example if you can’t understand the Fragment lifecycle, you could do a simple demo with logging messages to know what’s going on. Google samples are a good way to discover things too.

### Interviews Questions with no specific order:

1- what are the latest Android versions? The most important Marshmallow new features?

2- what is the purpose of the Activity?

3- what is the purpose of the Fragments?

4- explain the lifeCycle of the Activity?

5- explain the lifeCycle of the Fragment?

6- you’re using a traveling app then you clicked settings button, Settings Activity opened, then you click Android back, what’s the lifeCycle of the Settings Activity and the Home Activity when you did that?

7- what do you know about Material design?

8- what’s the difference between Abstract class and Interface in Java?

9- what’s an Interface in Java?

10- what’s an Abstract class in Java?

11- why you couldn’t create an instance from an abstract class?

12- what’s the difference between Dialog and AlertDialog in Android?

13- what’s the difference between LinearLayout and RelativeLayout?

14- which has better performance, LinearLayout or RelativeLayout?

15- given a simple contact item, with image and name and number, how could you implement it in XML?

16- what’s the Service, which thread it operates on?

17- what’s the difference between Service and IntentService?

18- what’s ANR message?

19- explain the BroadcastReciever job and implementation?

20- can you use a Fragment with no UI? What cases could make you use this pattern?

21- explain the Java access modifiers?

22- what’s the difference between Default and Protected access modifiers in Java?

23- what do you know about AsyncTask?

24- what’s the difference between Parcelable and Serializable? Which one is better? why?

25- how to access a variable in Activity from fragment?

26- you have one Activity with two fragments, one has a button and the second has a TextView, clicking the button change the TextView, how do you implement it?

27- how to make a variable thread safe?

28- what strategies we can use to achieve thread safety?

29- what is the purpose of “static” keyword in Java?

30- how could you initialize a static variable in Java?

31- what design patterns you know?

32- explain the builder pattern?

33- when do you use an observer pattern?

33- what’s the Singleton, when do you use it in Android?

34- what’s the difference between the LinkedList, ArrayList and Arrays?

35- what projects currently you work on? What is your workflow to implement a specific feature?

36- how do you handle Firebase push notifications?

37- how do you implement Firebase realtime Database?

38- you have a big project, and you have a login screen requirement, what processes you will follow to ship it?

39- what’s an Eventbus?

40- what the thread that onRecieve() method of a BroadcastReceiver operates on?

41- how to implement a custom BroadcastReceiver?

42- what’s the difference between MVC and MVP?

43- could you explain MVVM?

44- what’s the M in MVP? Answering … could it be a something else?

45- what’s the purpose of Content Provider?

46- what Sqlite library do you use?

47- what libraries do you use for Networking, Image loading, Database?

48- what do you use to handle a very fast Sensor that emit many readings at a time in Rx way?

49- what’s the difference between map and flatMap() in Rxjava?

50- how to create parallel Network calls with Rxjava?

51- if you have one request from the network and you want to call the cache if Network throw an error … how to achieve that via Rxjava?

The funny thing that I’ve read Dan lew blog post about this case, implemented it twice before, but couldn’t answering this question during the interview … bad things happen.

52- what’s the difference between concatMap() and flatMap() in Rxjava?

53- what do you know about Intents? What is the purpose of categories in Intents?

54- what’s the purpose of FrameLayout?

55- how to compare between Two objects?

56- Java is pass by Value or pass by Reference?

57- when you use observeOn() and subscribeOn()?

Well that’s all I can remember for now, usually the OOP, Android components and Design patterns stuff are common among most of the interviews I had.

Luckily the Android dev challenge course has the answers of many of the questions above, just don’t rush … take your time to understand the basics. Don’t jump into things like Rxjava or Dagger without a good playground of the basics and the platform APIs.

**PS: hope this could help someone, and forgive my horrible English, I’m not a native speaker.**

<a href="https://medium.com/media/fedb9f91e907af2468a937c944ed32ab/href">https://medium.com/media/fedb9f91e907af2468a937c944ed32ab/href</a>

---

[I had 10 Android interviews during the last two years, here’s the questions plus some lessons I’ve…](https://medium.com/android-news/i-had-10-android-interviews-during-the-last-two-years-heres-the-questions-plus-some-lessons-i-ve-cdc583dfbc65) was originally published in [AndroidPub](https://medium.com/android-news) on Medium, where people are continuing the conversation by highlighting and responding to this story.

---
layout: post
title: "Android Architecture components walk-through"
date: 2018-05-29
canonical_url: https://medium.com/@mibrahimdev/android-architecture-components-walk-through-b19b439a2f01
original_publication: Medium
description: "It’s been a while since Google has released their sets of Architecture libraries or as they’re calling it “Components” , I didn’t check it once it came out but it took me a couple…"
tag: Architecture
---

![](/images/posts/android-architecture-components-walk-through/01.jpeg)

It’s been a while since Google has released their sets of Architecture libraries or as they’re calling it “Components” , I didn’t check it once it came out but it took me a couple of days to be amazed by the work they’ve done.

Usually I love to watch some videos and talks about the subject first, then I try to dive in the code, read some other developers samples, demos and articles finally try to play with it, all this to just decide what’s in it for me.

So I started to collect those resources to walk through them and see what I can gain from those libraries .. you can find the whole list [here](https://www.linkedin.com/feed/update/urn:li:activity:6344643393771184128).

This is a quick walk through of the [Android Architecture components](https://developer.android.com/topic/libraries/architecture/index.html) and how you can benefit from them.let’s start

### What are Android Architecture components ?

You and me and others are developers, our work flow may be different but we agree that each piece of code it’s like a living being.

You may start crowd those beings at one place , you may try to organize them a little, but with Android it’s hard to start with a good architecture.

I think most of us experienced that, many Android community members have [contributed](https://github.com/search?o=desc&q=android+architecture+android&s=stars&type=Repositories&utf8=%E2%9C%93) to write cleaner code than what is already exist.

Those contributions what pushed Google to be part of the solution .. and no one can deny, that they offered a great response to the community .. Kotlin for example, and what we’re talking about now .. Architecture components.

> *A collection of libraries that help you design robust, testable, and maintainable apps. Start with classes for managing your UI component lifecycle and handling data persistence.*

This is from the first page in the official documentation, each component doesn’t rely on the other, so you can use what you find beneficial to you and your team. those libraries as follow:

- **LifeCycle Aware**: you don’t need to bloat your activity with overriding lifecycle methods any more.
- **ViewModel:**configuration changes handling is not painful any more.
- **LiveData**: you don’t have to know Rxjava to write clean code.
- **Room**: is it a [resurgence of SQL](https://youtu.be/4eUuD7LsqMs)? absolutely.
- **Paging library:** didn’t discover it yet, but it’s a library of paging :)

let’s see what they offer one by one.

### LifeCycle Aware components

***Use case:***

You have a requirement as follow, implement a Google map screen that show User location, and show near by locations (*Masjid* — Schools — Restaurants) filtered by his interests. and of course all that without draining his battery.

***Implementation:***

This is some of the implementation related to lifecycle:

- register location listener in onCreate / onStart
- unregister location listener in onDestroy / onStop
- register BroadcastReciever of GPS settings onCreate / onStart
- unregister BroadcastReciever of GPS settings onDestroy / onStop
- cleaning Rxjava Observables any other listeners

***Problem:***

With more features, comes more lifecycle handling, I didn’t mention configuration changes yet and their effects on the lifeCycle.

The problem now that the Activity/Fragment is responsible for managing many other instances lifecycle. which bloat the whole class with coupled code.

just imagine each time you need to add an Rxjava observable or using a resource need to be released in onDestroy/onPause to avoid memory leaks.

***Solution:***

How could we solve problem like this? well there is the architecure design patterns like (MVP — MVVM — MVI ..) to make Activity/Fragment do only their job, rendering View, the other part is to make any component that deal with Activity/Fragment a lifeCycle aware component.

***How to use LifeCycle awre component?***

Mainly you have *LifeCycleObserver*interface which make any class capable of monitoring the lifecycle of the*LifeCycleOwner.*

The following is from the code lab after removing some implementation

<a href="https://medium.com/media/5439944ec9857530ed5c1477a389ae38/href">https://medium.com/media/5439944ec9857530ed5c1477a389ae38/href</a>

Now you can annotate the methods with the fit lifecycle annotation and it will be executed with no need to call them on the View (Activity/ Fragment)

The second step is to add this class to LifeCycleOwner observers, and this through *getLifeCycle().add().* in the Activity

<a href="https://medium.com/media/2ed8775db0bc8de3dd2c08a1721d39e3/href">https://medium.com/media/2ed8775db0bc8de3dd2c08a1721d39e3/href</a>

And by this you can force your library or code to behave the right way with the lifeCycle .. and no need to maintain (onDestroy/onDestroyView — onPause — onResume) code, you simply annotate the method with the right life cycle annotation and let the rest for the library.

If I remember well, starting from the Support library 26.1.0 theFragment and Activity both are lifeCycle owners. so you can access *getLifeCycle()* with no additional work.

### [ViewModel](https://www.youtube.com/watch?v=c9-057jC1ZA)

Well I didn’t find better explaination than official docs:

> *A ViewModel is always created in association with a scope (an fragment or an activity) and will be retained as long as the scope is alive.*

E.g. if it is an Activity, until it is finished.

*In other words, this means that a ViewModel will not be destroyed if its owner is destroyed for a configuration change (e.g. rotation). The new instance of the owner will just be re-connected to the existing ViewModel.*

So you don’t need to handle any data due to this destroy, recreation thing.

*The purpose of the ViewModel is to acquire and keep the information that is necessary for an Activity or a Fragment.*

keep in mind that ViewModel’s one and only responsibility is to manage the data for the UI.

It’s interesting to mention here that the ViewModel is just a non UI fragment with *setRetainInstance(true)*.

***Use case***:

You have a Quiz app which has many questions screens, each screen has a simple chronometer that count down the remaining time till the end. the user may rotate the screen to have a better look on the images or the data so he could get the answer.

***Problem:***

Suddenly the user discover that each time he rotate the phone, the count down timer start over. so he use that to get more time.

***Implementation:***

There is many solutions to this problem, some of them are bad. some of them are not clean enough, you can google it.

***Solution:***

You simply hold the data related to UI in a ViewModel instance to live the configuration change.

***How to use ViewModel component?***

First you create a viewModel with extending the *ViewModel*, and define the data you want to manage.

<a href="https://medium.com/media/6841c44ee33d82068303ffa91522f0f9/href">https://medium.com/media/6841c44ee33d82068303ffa91522f0f9/href</a>

Second, you get your ViewModel instance with the help of the ViweModel factory (provider) method, and finally you access what you need or observe the data.

<a href="https://medium.com/media/d61d88ad2a35a6b8a4adb17ec61f9f8c/href">https://medium.com/media/d61d88ad2a35a6b8a4adb17ec61f9f8c/href</a>

### LiveData

When I discovered this one, I had one question in mind, why another Observer pattern implementation? we already have Rxjava.

So the simple answer “from one of I/O talks” that Rxjava has a very steep learning curve, you don’t expect all new comers or newbies developers to learn Rxjava in short time. so LiveData is more like a lightweight Observable.

***Use case:***

suppose that in your Quiz app, you need to show hints to the user before the time ends let’s say by 5 minutes.

***Bad implantation:***

you could do that in the Activity, by checking the remaining time, but the logic of picking hints, what time to show, this logic shouldn’t be in the Activity because as we agreed that Activity/Fragment are only view to render the UI.

***Solution:***

Using the Observer pattern we could observe the timer value and do our logic in the Presenter or in the ViewModel. or better to reverse that by updating timer from the Presenter/ViewModel and Observe in the Activity/Fragment, the following example use the later.

***How to use LiveData component?***

All you need is to wrap your data with one of the LiveData types ..

<a href="https://medium.com/media/5affdb0288ee32362dcde7ac17e1822f/href">https://medium.com/media/5affdb0288ee32362dcde7ac17e1822f/href</a>

Then you use*setValue()* when you’re on the MainThread or *postValue()*when you’r on background thread.

If you tried to swap the usages of the previous methods, you will get an IllegalStateException which is great.

```
java.lang.IllegalStateException: Cannot invoke setValue on a background thread
```

finally you use *observe()*method to get the data updates.

<a href="https://medium.com/media/450dcaa788966311dd73b2c83be07d13/href">https://medium.com/media/450dcaa788966311dd73b2c83be07d13/href</a>

Those are the most essential methods you will use with LiveData.

### Room

Well from the day one knowing about Sqlite, I knew that I don’t like it :), there is much amount of boilerplate code to write Sql in Android, and if you missed one single letter, you will never know till the Runtime.

I was using [GreenDao](https://github.com/greenrobot/greenDAO) as a good way to dealing with Sqlite, but when I discovered Room it’s now my way to go when writing database in Android.

> *Room is an abstraction layer over Sqlite*

and because Room is a fancy way to write database, we will get into it directly.

***How to use Room?***

1- Annotate your model

- @Entity — annotate a class to have a mapping Sqlite table.
- @PrimaryKey(autoGenerate = true) — annotation to have an index.
- @Ignore — for any constructor or field doesn’t belong to Sqlite.

<a href="https://medium.com/media/e5a91182b675c1e014a43ca4a20a19fb/href">https://medium.com/media/e5a91182b675c1e014a43ca4a20a19fb/href</a>

2- Design your DAO

You use @Dao to annotate your interface that access the database, and you have @Insert, @Query, @Delete, @Update annotations to represent the Sql database operations.

With some of them you have some options, for example with update or insert, you have some strategies to choose from to handle conflicts.

By default those operations [run on a background thread](https://developer.android.com/reference/android/arch/persistence/room/RoomDatabase.Builder.html#allowMainThreadQueries()) so it doesn’t block your UI.

<a href="https://medium.com/media/3398041556e4748d4a6cf41e210fd928/href">https://medium.com/media/3398041556e4748d4a6cf41e210fd928/href</a>

3- Get your RoomDatabase instance

Create an abstract class that extends *RoomDatabase*and use the Room builder to build the instance of your database, note that this is an abstract class so the library could generate the required code to wire things up.

@Database — is used to define the entities (DB tables) and the DB version.

@TypeConverter — is to use custom converter when getting data from DB. for example to convert the date to human readable format.

<a href="https://medium.com/media/8d9538141c0acff95d60597d7a360bcd/href">https://medium.com/media/8d9538141c0acff95d60597d7a360bcd/href</a>

4- finally you access your dao from this instance (may be in a repository) and do the operation you need.

<a href="https://medium.com/media/09fd5403c2942c349349fe1af3309317/href">https://medium.com/media/09fd5403c2942c349349fe1af3309317/href</a>

that’s it for Room

### Paging library: coming soon.

This is was a quick intro to Android Architecture components and I’ll try to add the Paging library section once I finish discovering it.

To use any of these components or play with them, just head to this documentation [link](https://developer.android.com/topic/libraries/architecture/adding-components.html).

Any feedback on writing will be appreciated — THANKS

**Resources:**[https://www.linkedin.com/feed/update/urn:li:activity:6344643393771184128/](https://www.linkedin.com/feed/update/urn:li:activity:6344643393771184128/)

---
layout: post
title: "Flow: an intro for an RxJava user"
date: 2020-03-10
canonical_url: https://medium.com/swlh/flow-an-intro-for-an-rxjava-user-1b5b6eb21790
original_publication: The Startup
description: "RxJava may be the most important library I learned to use, Rx in general is a different paradigm to write code, Kotlin as a new programming language give it a shot for implementing Flow…"
tag: Kotlin
---

![](/images/posts/flow-an-intro-for-an-rxjava-user/01.png)
*image credit: [https://unsplash.com/photos/Bd7gNnWJBkU](https://unsplash.com/photos/Bd7gNnWJBkU)*

RxJava may be the most important library I learned to use, Rx in general is a different paradigm to write code, Kotlin as a new programming language give it a shot for implementing Flow powered by coroutines as an Rx implementation of its own. I may introduced Coroutines in [Hello Kotlin Coroutines](https://medium.com/@MohamedISoliman/hello-kotlin-coroutines-4e40cb9a106c), and that was necessary to understand Flow.

Kotlin has as set of extensions to facilitate working with collections. but it’s not considered as reactive.

```kotlin
listOf("Madara", "Kakashi", "Naruto", "Jiraya", "Itachi")
    .map { it.length }
    .filter { it > 4 }
    .forEach {
        println(it)
    }
```

In this example if you dig deep in map function source code, you will find no magic, it is just a loop over the list, doing some transformation then give you a new list. filter do the same. this mechanism called an eager evaluation, where the function do its operation over the whole list and give you a new list. but what if we don’t need to create those intermediate lists, and we need to save some memory, then we could use [***Sequences***](https://kotlinlang.org/docs/reference/sequences.html).

```kotlin
listOf("Madara", "Kakashi", "Naruto", "Jiraya", "Itachi")
    .asSequence()
    .map { it.length }
    .filter { it > 4 }
    .forEach {
        println(it)
    }
```

The only difference here that we convert our list to a sequence, then apply our operations, after navigating to map function again, we find something different, it’s just a decorator for the sequence, the return type is also a sequence. with ***Sequence*** map only operate on items one by one, and any other operator we apply like filter. with large lists Sequences is much better than normal collections, and it only will run lazily, ***Sequence***do its job synchronously, Is there a way to use those transformation operators asynchronous. here it comes Flow.

### Flow

![](/images/posts/flow-an-intro-for-an-rxjava-user/02.png)

If we tried to take our list and use it as flow, calling ***collect{..}***at the end of the stream, we will get a compile error. And the reason that Flow is built on Coroutines, it has the asynchronous capabilities by default, so you could just use it as you use [coroutines](https://medium.com/@MohamedISoliman/hello-kotlin-coroutines-4e40cb9a106c) in your code.

***Collect{…}*** operator is terminal operator where you get the emissions, you could think of it like ***subscribe*** in Rxjava.

Flow is also cold stream, and that means, your flow will not be executed until you call a terminal operator on it, like ***collect()***. and if you collect more than once, each time you will get the same emissions.

So Collections extension functions is only friendly in small data, sequences could save you some unnecessary work, and with Flow you write code reactively with the power of coroutines. So let’s learn how to build it…

### Flow builders

We have seen ***asFlow()***which is an extension function on Collections to convert it to flow, navigating to source code:

```kotlin
public fun <T> Iterable<T>.asFlow(): Flow<T> = flow {
    forEach { value ->
        emit(value)
    }
}
```

***flow {…}*** is the main flow builder with the function *emit(),*if we want to write our previous example to add some logic in the data source, or imitate the source behavior we simply use ***flow {…}***. and we also have ***flowof()***.

### Operators

Flow has a set of operators to apply transformation on emissions, like map, filter, groupBy, scan .. and many others, they’re all cold.

In RxJava you may hit this question once at least, what is the difference between map and flatMap and the closest answer you may get, [is when you have a list of a list and you want to get all the items emitted one by one](https://youtu.be/QdmkXL7XikQ?t=603), that’s the simplified answer of ***flatMap() vs map()***and it’s correct but the other point with ***map()***is you do synchronous mapping, and the solution to do it asynchronously is to use ***flatMap()***because map doesn’t support that.

In Flow powered by Coroutines, you could use asynchronous code in your operators naturally, let’s assume we want to do some mapping logic that take some time, we represent that by just delaying one second. with RxJava you would use flatmap with applying some logic on it .. it may seem like this.

![](/images/posts/flow-an-intro-for-an-rxjava-user/03.png)

The argument here is Flow has a simple design, and easy to learn comparing with RxJava which is known of its steep learning curve, I’ll just put this image here to make it short.

With Flow…

![](/images/posts/flow-an-intro-for-an-rxjava-user/04.png)

### Terminal operators

I have mentioned that ***collect()***is a terminal operator, and by terminal I mean that you get the result when you call it, in RxJava with cold streams, you start it by calling ***subscribe()***, or if you want it in a blocking way, you call ***blockingGet()***.

Terminal operators in Flow, are suspend functions which need a scope to operate on, some other terminal operators will be

- ***toList()***,***toSet*** -> return all items in a collection.
- ***first()*** -> return the first emission only.
- ***reduce()***,***fold()*** -> accumulate emissions with a specific operation

### Launching

To make flow start emitting, you need to launch it as any suspend function, So the pattern to start your flow will be…

```kotlin
//fire a coroutine
someScope.launch {
  //fire flow with a terminal operator
  flowSampleData().collect { }
}
```

The curly braces remind me of callbacks, a nice thing to do is replace it with ***launchIn()***, but how we handle our emissions, for that you use ***onEach{…}***

```kotlin
flowSampleData()
    .onEach {
     //handle emissions
     
    }
 
     .launchIn(someScope)
```

### Cancellation

Each time we setup RxJava subscription, we had to care about clearing those subscriptions to avoid memory leaks or an expired task working in background, RxJava support that by giving you a reference to the subscription as ***disposable()*** and you usually call ***disposable().dispose()***in your component exit point, if you have more than one you collect those in ***CompositeDisposable()***then you call ***clear()*** or ***dispose()***.

with the Coroutine scope setup you don’t need any additional work, structured concurrency fill that purpose.

### Errors

One of the most useful features of RxJava is the way you handle errors, you have this ***onError()***function which catch any error in the stream. Flow has a similar one called ***catch{…}***and without using catch{…} you’re code may throw an exception or your app crash. and by this you the choice to code with regular try catch or in declarative way using ***catch{…}*.**let’s mock a source with error

```kotlin
private fun flowOfAnimeCharacters() = flow {
    emit("Madara")
    emit("Kakashi")
    //throwing some error
    throw IllegalStateException()
    emit("Jiraya")
    emit("Itachi")
    emit("Naruto")
}
```

and the consumer code ..

```kotlin
runBlocking {
    flowOfAnimeCharacters()
        .map { stringToLength(it) }
        .filter { it > 4 }
        .collect {
            println(it)
        }
}
```

if we run this code it will throw an exception, and as we said you have two options to handle errors, the regular try-catch and ***catch{…}***. here is the modified code in both cases.

```kotlin
// using try-catch
runBlocking {
    try {
        flowOfAnimeCharacters()
            .map { stringToLength(it) }
            .filter { it > 4 }
            .collect {
                println(it)
            }
    } catch (e: Exception) {
        println(e.stackTrace)
    } finally {
        println("Beat it")
    }
}
```

Using catch{…}

```kotlin
runBlocking {
    flowOfAnimeCharacters()
        .map { stringToLength(it) }
        .filter { it > 4 }
        .catch { println(it) }
        .collect {
            println(it)
        }
}
```

There’s something happens with second option, it’s important to order the catch operator just down the stream before the terminal operator, so you could catch all errors if that what you want.

### Resuming

If error break the stream and our intention to resume it with fullback or default data, we used to have ***onErrorResumeNext()*** or ***onErrorReturn()*** in Rxjava, in Flow we also use ***catch{…}*** but we call ***emit()***inside of it to produce backup emissions one by one, or even better we could introduce a whole new flow with ***emitAll()*** like we did, if our heroes didn’t make it to the battleground, we need “Minato” and “Hashirama”.

```kotlin
runBlocking {
    flowOfAnimeCharacters()
        .catch {
            emitAll(flowOf("Minato", "Hashirama"))
        }
        .collect {
            println(it)
        }
}
```

And that will get us

```
Madara
Kakashi
Minato
Hashirama
```

See, no new operators :”)

### flowOn()

Flow data source by default will run in the caller context, if you want to change that and for example you want flow source to run on IO instead of Main we use ***flowOn()***for that, and change context for the upstream, upstream is all the operators before calling flowOn. here’s a nice doc example.

![](/images/posts/flow-an-intro-for-an-rxjava-user/05.png)

***flowOn()*** here is acting for both its equivalent in RxJava [subscribeOn() — observeOn()], you write your stream then you decide which context will operate on.

### Completion

You may need to do something when Flow is done emitting, for that you have ***onCompletion{…}***, and it determine whether the flow collection was completed normally or exceptionally. let’s use it in our anime characters example.

![](/images/posts/flow-an-intro-for-an-rxjava-user/06.png)

Give it a minute to guess the result, knowing that the data source is

```kotlin
private fun flowOfAnimeCharacters() = flow {
    emit("Madara")
    emit("Kakashi")
    throw IllegalStateException()
    emit("Jiraya")
    emit("Itachi")
    emit("Naruto")
}
```

***Catch{…}*** will do it’s job catching the *IllegalStateException()*and resuming with the new flow*,*that leave us with “Madara”, “Kakashi” from the source and with “Minato”, “Hashirama” from the fullback flow. but what about ***onCompletion{…}***, does it print the error?!

The answer is No, catch caught all the errors, and what come next is a whole new thing, put in mind that ***onCompletion{…}*** and ***catch{…}*** are just mediator operators. their order really matters.

***Let’s recap what we achieved until now…***

*You build a flow using Flow builders, the most basic one is****flow{…}****. if you want to start the flow, you call a terminal operator like****collect{…}****and because terminal operators are suspend functions, you need a scope with the coroutine builder****launch{…}****or if you want to do it in an elegant style, you use****launchIn()****combined with****onEach{…}****. Use****catch{…}****to catch the upstream errors, and provide it with a fallback flow if you want to.****onCompletion{..}****will trigger after upstream done all emission or when error happens. all that will work on the caller coroutine context by default, if you want to change the upstream context, you use****flowOn()****.*

I hope you enjoyed this little intro about flow, I’ll try to write more about it and to discover its place app architecure, until that happy flowing.

---

[Flow: an intro for an RxJava user](https://medium.com/swlh/flow-an-intro-for-an-rxjava-user-1b5b6eb21790) was originally published in [The Startup](https://medium.com/swlh) on Medium, where people are continuing the conversation by highlighting and responding to this story.

---
layout: post
title: "Hello Kotlin Coroutines"
date: 2020-02-19
canonical_url: https://medium.com/swlh/hello-kotlin-coroutines-4e40cb9a106c
original_publication: The Startup
description: "Any UI framework has its own main thread to do the rendering and observing touch events, this thread by all means is the most important thread you should care of. User will never know…"
tag: Coroutines
---

![](/images/posts/hello-kotlin-coroutines/01.jpeg)
*image credit: [https://unsplash.com/photos/Bd7gNnWJBkU](https://unsplash.com/photos/Bd7gNnWJBkU)*

Any UI framework has its own main thread to do the rendering and observing touch events, this thread by all means is the most important thread you should care of. User will never know if you wrote your code with AsynckTask or a Coroutine, but he will feel the responsiveness of the App. so organizing the tasks that your code does is an important part you should be aware of.

### Hello from the Async side

If you have an expensive api call, it must not happen in the main thread, Android for example will crash your app if you’ve done that. so one solution is to fire this api call in a background thread and get the result in a callback. or you could use Rxjava Observable, or now you can use ***coroutines***.

coroutines are similar to threads, but they’re more efficient in the way of using resources. you could have many coroutines as you want. Coroutines literally means cooperative functions, but what does that mean?

Well in normal functions, you could call function inside another, and the execution will be done line by line, so for example due to the below code, what will happen when you call funA in main?

```kotlin
fun main() {
    funA()
}
fun funA() {
    println("start....")
    funB()
    funC()
    println("......end")
}
fun funB() {
    println("Hello")
}
fun funC() {
    println("World!")
}
```

it may look like a ridiculous question, we do programming for while now, but bear with me, the execution in that case will go line by line, every time it hits another function call, will go to execute its code, then get back to continue lines after this second function and so on.

let’s make it little bit complex, what if funB and funA take some time to do their jobs, imagine that those simple strings come from network or a DB. and we will mock that by just delaying their response.

```kotlin
fun main() {
    val timeMillis = measureTimeMillis {
        funA()
    }
    println(timeMillis)
    println("Exiting main...")
}

fun funA() {
    println("start....")
    funB()
    funC()
    println("......end")
}
fun funB() {
    Thread.sleep(1000)
    println("Hello")
}
fun funC() {
    Thread.sleep(1000)
    println("World!")
}
```

Can you expect the result?

```
start....
Hello
World!
......end
2011
Exiting main...
```

if you run this code, it will print first line instantly, wait one sec, print Hello, wait for another second, print World! and print execution time, then exiting program.

so it took almost two seconds, to be done. but Could we optimize this code to do it in one second?

and here it comes the idea of using Concurrency, you could use threads to minimize the time of your app execution. by dividing the heavy work between them, and there’s already a set of tools supported in Java to help you achieving that, but to make it short, let’s enhance our app performance using Threads.

```kotlin
fun funA() {
    println("start....")
    thread { funB() }
    thread { funC() }
    println("......end")
}
```

and we will add a small change to the main function by blocking main thread for around one second

```kotlin
fun main() {
    val timeMillis = measureTimeMillis {
        funA()
        Thread.sleep(1300) //blocking main
    }
    println(timeMillis)
    println("Exiting main...")
}
```

now app result will be like this

```
start....
......end
Hello
World!
1311
Exiting main...
```

So we achieved doing our heavy work in half the time using Threads, but we have to say this, Threading require a lot of knowledge to write predictive bug free concurrent app. and the other thing, they are very expensive, you could run out of memory if you overused them.

So it came to those two points, ***Syntax*** and ***Resources***,in a perfect world you would write your imperative/sequential code without changing anything and youwould be safe of out of memory situations.

Koltlin as a new language, it has this concept of design where want you to to use your daily programming skills, like regular imperative synchronous code, try-catch to handle errors, So they introduced coroutines for that reason. so your old synchronous code can be easy with minimal changes turned into an asynchronous one.

### Coroutines

Threads are runtime solution, you just grab a thread from the JVM to do your heavy work. on the other hand Coroutines are the compiletime solution, where a new mechanism being introduced to the compiler making functions (rotuines) able to cooperate (Co).

***suspend*** functions is where the caller function at our example funA, just start the execution of funB, we could say funA just suspended the continuation of funB untill B finish its job.

the confusion part here that this may look exactly the same when we introduced threads. the one key difference that you don’t need to use many threads here, Coroutine is just cheap to use, how this look like with our example .. let’s convert it.

```kotlin
fun main() {
    val job = GlobalScope.launch {
        funA()
    }
    Thread.sleep(2300)
    println("Exiting main...")
}
suspend fun funA() {
    println("start....")
    funB()
    funC()
    println("......end")
}
suspend fun funB() {
    delay(1000)
    println("Hello")
}
suspend fun funC() {
    delay(1000)
    println("World!")
}
```

There’s couple of changes here, let’s start with A,B,C functions, first of all they’re all marked with ***suspend*** keyword, second we replaced ***Thread.sleep()***with***delay()***which is a helper function to delay execution in Coroutines.

In main function we use***GlobalScope.launch***which is a Coroutine builder to start executing our code. if you run that code you will get result nearly same as the first one, where we didn’t introduce any concurrent tools. and it will take around two seconds to finish. and a second look at the code, you can see that changing ***synchronous*** code to an ***asynchronous*** is not that hard with coroutines compared to Threads. but could we optimize our code so it take just half the time to be done?

### Parallelism

let’s change our code so funB and funC return data, and the printing occur in funA

```kotlin
fun main() {
    GlobalScope.launch {
        val millisCoroutine = measureTimeMillisCoroutine { funA() }
        println("Took $millisCoroutine")
    }
    Thread.sleep(2300)
    println("Exiting main...")
}
suspend fun funA() {
    println("start....")
    println("$funB() $funC()")
    println("......end")
}
suspend fun funB(): String {
    delay(1000)
    return "Hello"
}
suspend fun funC(): String {
    delay(1000)
    return "World!"
}
```

It took almost same time, around 2 seconds to finish, to solve that we could use ***Async*** and ***Await***, excuse me what are those?

Those are coroutine builders which enable parallel execution, you just wrap your function with ***async {}*** and it return a ***Defferred<T>*** which is simply a future or a promise that you’ll get the desired value.

let’s modify our example

```kotlin
suspend fun funA() {
    println("start....")
    val helloDeffered = GlobalScope.async { funB() }
    val worldDeffered = GlobalScope.async { funC() }
    println("${helloDeffered.await()} ${worldDeffered.await()}")
    println("......end")
}
```

if you run this code it will get you the result

```
start....
Hello World!
......end
Took 1018
Exiting main...
```

So our coroutines now run in a parallel modes.

### Structured Concurrency

Whether you use the regular callback or the futures, or Rxjava observables, those concurrent setups has to be cleared when Activity is destroyed, so it doesn’t leak memory. if you’re familiar with [autodispose](https://github.com/uber/AutoDispose) it’s a library to clear ***Rxjava*** subscriptions when the component is being destroyed. so you don’t have to clear it yourself making a bag of disposables and clear it in ***onDestroy***.

Coroutine has this concept of “***Structured concurrency***”, it may seem a big term, or totally new to us, but it solves the previous problem, Strucured concurrency is all about defining some standards so concurrent programs has clear entry and exit points.

### Coroutine Scope

one of those rules structured concurrency apply is you don’t launch coroutines without a coroutine scope, in our example we used ***GlobaleScope*** which a specific type of scope, basicly means the scope of the app.

in Android the newer ViewModel has its own new scope, which you can use, so you don’t have to setup the scoping code yourself.

but if you want to do it yourself, in Activity for example, all you have to do is to implement Coroutine scope in your runner class and define the context.

```kotlin
class WelcomingScreen : Activity, CoroutineScope by CoroutineScope(Dispatchers.Default) {
}
```

if we moved our example to this Android app, you can now get rid of GlobalScope, because the new scope now is tied to the Activity lifecycle.

### Coroutine Context

any coroutine scope require a context, A context is a set of elements, one of those elements is the worker thread that will be used to be execute coroutines, it’s called in Coroutines terms ***Dispatchers***.

If you defined a parent scope with default dispatcher, all childeren coroutines will inherit this context. unless you pass new context to the later launch/withContext function, and this how you switch between threads.

So let’s return to our WelcomeScreen example, we now want to do the async calls in IO dispatcher, you can pass the Dispatcher type in async. we use ***withContext()*** passing the main dispatcher to get result in main thread (UI). how this will look like. let’s first modify our code so funA return the whole string we want to print.

```kotlin
suspend fun funA(): String {
    println("start....")
    val helloDeffered = async(Dispatchers.IO) { funB() }
    val worldDeffered = async(Dispatchers.IO) { funC() }
    println("......end")
    return helloDeffered.await() + " " + worldDeffered.await()
}
```

Let’s continue with our Android example, we will modify our code in onCreate so it execute funA in IO and printing the returned value in the UI thread.

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)
    launch {
        println("Launch Thread: ${Thread.currentThread().name}")
        val string = funA()
        println("Logging Thread: ${Thread.currentThread().name}")
        withContext(Dispatchers.Main) {
            Toast.makeText(
                this@WelcomeScreen, string,Toast.LENGTH_LONG).show()
        }
    }

}
```

and by this we get the result we want, doing the heavy work in a IO dispatcher, and showing our results in main Dispatcher.

### How Coroutines work?

If we step back in our article we said that the compiler is responsible to do the coroutine thing for us, but if we want to [make the magic go away](https://blog.cleancoder.com/uncle-bob/2015/08/06/LetTheMagicDie.html), we can convert Kotlin code to byte code, it’s hard to read, so the next step is to decompile it to Java .

From IntelliJ or Android Studio: *tools > Kotlin > Kotlin byte code. then press decompile*

We will do that with just a simple suspend function which return welcome message

```kotlin
suspend fun welcomeMessage(name: String): String {
    return "Hello $name"
}
```

Equivalent Java code to this will be

```java
@Metadata(
  ...
  ...
)
public final class SuspendFunctionJavaCodeKt {
   @Nullable
   public static final Object welcomeMessage(@NotNull String name,  
                             @NotNull Continuation $completion) {
      return "Hello " + name;
   }
}
```

what is important here is there a new argument we didn’t declare in our code which is ***Continuation***.

### Continuation

```kotlin
@SinceKotlin("1.3")
public interface Continuation<in T> {
  
    public val context: CoroutineContext
    public fun resumeWith(result: Result<T>)
}
```

Is an interface which carry the information of the current state, so when it get back to the suspension point it can resume normally with the updated one, and by this we get the behavior intended by writing a sequential code, but it behave asynchronously. There’s [more](https://youtu.be/jT2gHPQ4Z1Q?t=1697) than this simple explanation, but I hope you get the idea.

**Further readings**

- [Introduction to Coroutines.](https://www.youtube.com/watch?v=_hfBv0a09Jc)
- [The Guide to kotlinx.coroutines by example](https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md).
- [Coroutine Context and Scope.](https://medium.com/@elizarov/coroutine-context-and-scope-c8b255d59055)

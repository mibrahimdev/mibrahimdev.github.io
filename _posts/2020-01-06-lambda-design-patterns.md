---
layout: post
title: "Lambda design patterns"
date: 2020-01-06
canonical_url: https://medium.com/@mibrahimdev/lambda-design-patterns-d031451fccb1
original_publication: Medium
description: "At the beginning of learning programming and Android, writing code for me was just to learn the language and the tools it provides to just finish the job or the task. after some point…"
tag: Patterns
---

### Lambda design patterns in Kotlin

![](/images/posts/lambda-design-patterns/01.png)
*lambda design patterns*

At the beginning of learning programming and Android, writing code for me was just to learn the language and the tools it provides to just finish the job or the task. after some point of writing code, you realize there is some kind of abstraction that could solve the problems with your code.

Those kind of problems that cause you to rewrite big block of codes with every new requirement, or an update in old features. So **Abstraction** came to save us time and effort, in OOP world this abstraction came in many shapes depend on the problem it try to solve.

it’s called in software industry as **Design Patterns** and they maybe the OOP in action if I want to describe it. you can’t feel the importance of OOP and the beauty of it without learning them.

With shifting towards functional programming, it is necessary to spot some patterns that will make the code easier to reason about. and one of the basic principles of functional programming is **Lambda**.

Lambda in simple words is just the anonymous function, you declare it in Java by an interface with single function. for example if you used a Runnable may look like this

```java
Runnable runnable = new Runnable() {
    @Override
    public void run() {
        //do something
    }
};
```

if you’re writing this in IntelliJ or Android Studio, it show you a hint that you could change that to lambda

![](/images/posts/lambda-design-patterns/02.jpeg)

clicking the option and the new syntax will be change to this

```java
Runnable runnable = () -> {
    //do something
};
```

What is the difference, well first of all it’s shorter “less code”, second it give you only the signature of the function you use, and in Runnable case it’s just a void function.

and the way of writing lambda differs in Kotlin, as it doesn’t require you to define an interface with a single function to start to use it. it does that in compile time to be interpolatable with Java. but it doesn’t require you an extra effort. so in Kotlin you could write something like this.

```kotlin
val voidFunction = {
 //do something
}
```

and when you try to define the type, it will show you the matching signatures like this

![](/images/posts/lambda-design-patterns/03.jpeg)

lambda is just anonymous function without name, you could define it in the go, think of it like it’s a block of code that you defer its execution.

So any interface with a single function (SAM) you could change it to lambda, all you have to do is define the arguments types and the return type, simply the function signature.

How does that could shape some of the famous Design patterns in OOP world.

### Strategy Pattern

```kotlin
class Printer(private val stringFormatterStrategy: Formatter) {
    fun printString(string: String) {
        println(stringFormatterStrategy.format(string))
    }
}
interface Formatter {
    fun format(string: String): String
}
val lowerCaseFormatter: Formatter = object : Formatter {
    override fun format(string: String): String {
        return string.toUpperCase()
    }
}
val upperCaseFormatter: Formatter = object : Formatter {
    override fun format(string: String): String {
        return string.toUpperCase()
    }
}
```

The idea of strategy pattern is to code to interface not the implementation, so the argument of the printer in pre Lambda world could be an interface called *Formatter*, and you have tow separate classes to define, each implement this interface .. in the consumer code, Printer doesn’t care about the implementation, it only cares that the argument should be a *Formatter.*

but with lambda, you only need to define a lambda signature. and just path whatever implementation you want.

```kotlin
class Printer(private val stringFormatterStrategy: (String) -> String) {
    fun printString(string: String) {
        println(stringFormatterStrategy.invoke(string))
    }
}
val upperCaseFormatter: (String) -> String = { it.toUpperCase() }

val lowerCaseFormatter: (String) -> String = { it.toLowerCase() }
```

### Command Pattern

the idea of command pattern is to decouple the what from when, what you want to run, from when you want to run it, for example you could save a set of code to run it latter, the contract of the command pattern is just an interface with an execute function.

```kotlin
interface OrderCommand {
    fun execute()
}
class OrderAddCommand(val id: Long) : OrderCommand {
    override fun execute() = println("Adding order with id: $id")
}
class OrderPayCommand(val id: Long) : OrderCommand {
    override fun execute() = println("Paying for order with id: $id")
}
class CommandProcessor {
    private val queue = ArrayList<OrderCommand>()
    fun addToQueue(orderCommand: OrderCommand): CommandProcessor =
        apply {
            queue.add(orderCommand)
        }
    fun processCommands(): CommandProcessor =
        apply {
            queue.forEach { it.execute() }
            queue.clear()
        }
}
```

with lambda

```kotlin
class OrderAddCommand(val id: Long) : () -> Unit {
    override fun invoke() = println("Adding order with id: $id")
}
class OrderPayCommand(val id: Long) : () -> Unit {
    override fun invoke() = println("Paying for order with id: $id")
}
class CommandProcessor {
    private val queue = ArrayList<() -> Unit>()
    fun addToQueue(orderCommand: () -> Unit): CommandProcessor =
        apply {
            queue.add(orderCommand)
        }
    fun processCommands(): CommandProcessor =
        apply {
            queue.forEach { it.invoke() }
            queue.clear()
        }
}
```

And you could use it in both cases like this

```kotlin
CommandProcessor()
    .addToQueue(OrderAddCommand(1L))
    .addToQueue(OrderAddCommand(2L))
    .addToQueue(OrderPayCommand(2L))
    .addToQueue(OrderPayCommand(1L))
    .processCommands()
```

Something different in this example, I declared the class with a lambda type, so it force you to implement the invoke function, and the use case for this, if you have to pass some data to use later. once lambda invoked it has the data it needs.

### Observer Pattern

We use observer pattern when we want to get the updates of an object state. a simple example for this is the UI listeners, like the click listener or the text change listener in the edit text, most of Ui platforms provides you with set of listeners to behave accordingly.

an old habit it that we used to declare Ui listeners as one interface that include more than one function, in that case you can’t use lambda. So it’s better to untie that interface and make each function of it as SAM.

if you are an Android developer you should be familiar with the TextWatcher.

```java
public interface TextWatcher extends NoCopySpan {
    public void beforeTextChanged(CharSequence s, int start,
                                  int count, int after);
 
    public void onTextChanged(CharSequence s, 
                              int start, int before, int count);
   
    public void afterTextChanged(Editable s);
}
```

here you can’t just to listen to text changes, you’ll still have to override the other tow, which is annoying .. but the good news that androidx core package provide nicer syntax. you just use what you need.

```kotlin
val editText = EditText(this)
editText.addTextChangedListener { 
   //do something
 }
```

So observer pattern became just passing lambda.

*The idea of passing code that will be executed later is the key of understanding functional programming. this code is usually a lambda. all we need is to define the function signature. and the other is just an implementation detail.*

### lambda design patterns

if we could write a summer function in old imperative way it may look like this

```kotlin
fun totalValues(list: List<Int>): Int {
    var sum = 0
    for (element in list) {
        sum += element
    }
    return sum
}
```

What if we need the sum of just the even values? well a straightforward solution, we could just copy past this function and adding a slight modification.

```kotlin
fun totalEvenValues(list: List<Int>): Int {
    var sum = 0
    for (element in list) {
        if (element % 2 == 0) sum += element
    }
    return sum
}
```

now a new requirement came, what if we need the sum of odd values, you got it right, we copy paste and create a third function.

```kotlin
fun totalOddValues(list: List<Int>): Int {
    var sum = 0
    for (element in list) {
        if (element % 2 != 0) sum += element
    }
    return sum
}
```

I think you got the idea, but now you have in your belt a powerful tool you could use **lambda**, let’s think what is the piece of code you changed each previous time. and we could just pass it to our total function so we defer the implementation to the user of this function.

it’s obvious is the condition, we test element and if it pass the the test we add it to the sum, this in lambda could be written like this.

```kotlin
fun totalValues(list: List<Int>, selector: (Int) -> Boolean): Int {
    var sum = 0
    for (element in list) {
        if (selector(element)) sum += element
    }
    return sum
}
```

now it’s just one function, when we use it will be just simple as that

```kotlin
//sum of even numbers
println(totalValues(listOf(1, 2, 3, 4)) { it % 2 == 0 }) 
//sum of odd numbers
println(totalValues(listOf(1, 2, 3, 4)) { it % 2 != 0 })
```

this lambda we wrote, could be found as **Predicate**interface in Rxjava or even in the functional interfaces in Java8. what we achieved till now that we extracted the changing part of code, made it more flexible.

*I hope you get the idea of the importance of using lambda and how it could change the way you write code.*

***Useful resources***

- [Design Patterns in the Light of Lambda Expressions by Subramaniam](https://www.youtube.com/watch?v=e4MT_OguDKg&t=21s)
- [Design patterns in Kotlin](https://github.com/dbacinski/Design-Patterns-In-Kotlin)
- [Arrow: Kotlin functional programming lib](https://arrow-kt.io/)

---
layout: post
title: "Dependency Injection: The Road to Dagger"
tag: Architecture
---
Most of us, when we start out, don't give much thought to how many objects we create to get the system up and running. How easy it is to type `new` and let the editor auto-complete the rest, building yet another object. But a closer look at the code reveals that you've created plenty of objects — necessary and unnecessary alike — and the machine running them pays for it in resources, especially on a resource-constrained device like a smartphone.  

The bigger problem is the amount of effort it takes you to add a new feature or investigate a bug. The different classes have become "tightly coupled," refusing to let go of one another — no surprise, given the dozens of objects between them that need care and feeding.  

Not to mention how hard these classes are to test. Every time you need to write a unit test for class A, for instance, you find that it depends on classes B, C, D, E, and F. Testing each class in isolation becomes difficult, which makes development and a stable system harder to achieve.  

**These are perhaps the most significant problems with creating objects inside the very classes that use them — but let's understand it by writing some code...**

First, we have the `Car` class.

```java
public class Car {

    private int speed;
    private String name;

    public Car(int speed, String name) {
        this.speed = speed;
        this.name = name;
     }
     //setters & getters
     ...
     
   }
```
And we have the `Person` class.
```java
public class Person {

    private Car car = new Car(100, "BatMobile");

    public Person() {
    }

    public void drive() {
        System.out.println("driving " + car.getName());
    }

    public void learningSomeStuff(){
        System.out.println("learning some stuff");
    }
}
```
The problem now is that the `Person` class is responsible for building the car, which becomes apparent when we use `Person` in the application.

```java
public class MainApplication {

    public void main(String[] args) {
        Person person = new Person();
        person.drive();
        person.learnSomeStuff();
    }
}
```
The job of building the car object now falls on the `Person` class — which is awkward even in real life. You don't have to build a car yourself to drive it; you might buy it or rent it from someone else. Manufacturing it is a tall order for a `Person` who has other things to focus on.

**Let's evaluate the current state of the code...**

- Can you use the `Person` class as it stands to drive, say, a Lamborghini? Of course not.
- Can you test the `Person` class in isolation from the `Car` class? Also no.


From the answers to these questions and a review of the code, you can see the problem with building a class's objects inside the class that uses them.


### A Slightly Better Version: Constructor and Setter Injection


The `Person` class depends on the `Car` class, so `Car` is a dependency of `Person`. This relationship exists regardless of where the `Car` object is created.

A better version of the previous code is to delegate the creation of the `Car` object to the system, or the client. In other words, as long as the client is going to create a `Person`, let it also create a car on demand. The following code shows how...

```java
public class Person {

    private Car car;

    public Person(Car car) {
    this.car = car;
    }

    public void drive() {
        System.out.println("driving " + car.getName());
    }
```
The benefits of this version show up when we write the application code.
```java

    public void main(String[] args) {
        Car fiat = new Car(60, "128");
        Car lambo = new Car(150, "lambo");
        
        Person person = new Person(batMobile);
        person.drive();
        person.learnSomeStuff();
        
        Person anotherPerson = new Person(lambo); //lucky them
        anotherPerson.drive();
        anotherPerson.learnSomeStuff();
    }
```


In this version of the code, `Person` knows nothing about building cars, nor should it. And if you ask the earlier questions again, you'll find that:

- You can now have a `Person` drive any car you want.
- You can test `Person` in isolation from the `Car` class by mocking the car to suit your test cases.

You can achieve the same result with setter injection by passing the car object to a setter method instead of the constructor.
```java
public class Person {

    private Car car;
    
    public Person() {
    }

    public void setCar(Car car) {
        this.car = car;
    }
}
```
### What Is Dependency Injection?
>In software engineering, dependency injection is a technique whereby one object supplies the dependencies of another object. A dependency is an object that can be used (a service). An injection is the passing of a dependency to a dependent object (a client) that would use it. The service is made part of the client's state.[1] Passing the service to the client, rather than allowing a client to build or find the service, is the fundamental requirement of the pattern.
 [Wikipedia](https://en.wikipedia.org/wiki/Dependency_injection)

It's a technique where one object supplies another object with all the dependencies it needs. A dependency is an object that another object uses to perform some task, and the dependency is built as part of the client's, or system's, state. The key condition of this technique is that the dependency is passed in, rather than created inside the object that uses it.

![dependency injection]({{ site.baseurl }}/images/posts/2017-10-31-dependency-injection/Dagger-feature.png "custom fonts Android support library"){:height="450"} 

In very simple terms, it means creating a dedicated class to build and configure all the dependencies you'll need while building the system. Every time one object needs another object, it asks this class for it.

The benefit of this technique is that the job of building these objects is now managed in one place (separation of concerns), which makes it easier to test and mock these objects — and even swap them out if needed.

**Let's now apply this technique to what we had before...**

First, we need to change the class types and make them more flexible by using interfaces.

```java
public interface Car {
    int getSpeed();
    String getName();
}

public interface Person {
    void drive();
    void learnSomeStuff();
}

```
Now all the old classes depend on these contracts.


```java
public CarImpl implements Car {
    private int speed;
    private String name;

    public CarImpl(int speed, String name) {
        this.speed = speed;
        this.name = name;
     }
     //setters & getters
}

//**********************

public PersonImpl implements Person {

   private Car car;

    public PersonImpl(Car car) {
       this.car = car;
    }

    public void drive() {
        System.out.println("driving " + car.getName());
    }

    public void learnSomeStuff(){
        System.out.println("learning some stuff");
    }
}

```
And now for the `Injector` class.
```java
/**
 * singleton to manage dependencies
 */
public class Injector {

    private static Injector instance = null;

    private Injector() {
    }

    public static Injector getInstance() {
        if (instance == null) {
            instance = new Injector();
        }
        return instance;
    }

    public Car getFiat() {
        return new CarImpl(60, "128");
    }

    public Car getLambo() {
        return new CarImpl(200, "Lambo");
    }

    public Person getPerson() {
        return new PersonImpl((CarImpl) getFiat());
    }
```

And finally, in actual use when wiring up the system...

```java
  //in main application 
        Injector injector = Injector.getInstance();
        Person person = injector.getPerson();
        Person anotherPerson = injector.getPerson();

        Car fiat = injector.getFiat();
        Car lambo = injector.getLambo();
        
        person.drive();
        person.learnSomeStuff();

        anotherPerson.drive();
        anotherPerson.learnSomeStuff();
```

In this example, I injected the `Person` class into the application's main class, and also injected the car objects that the people would need. The injection itself can happen anywhere you have dependencies that one object needs from another.

The downside of this approach is that it requires a lot of repetitive boilerplate. But with techniques like annotation processors, you can use a ready-made framework that generates this code on your behalf — all you have to do is some configuration. The most popular one in the Android and Java world is Dagger, which is the subject of an **upcoming article...**













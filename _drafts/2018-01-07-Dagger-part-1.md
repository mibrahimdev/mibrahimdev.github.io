---
layout: post
title: "Dagger: الجزء الأول"
---
تعرفنا في [الجزء الأول](https://mohamedisoliman.github.io/dependency-injection/)  على نمط Dependency Injection وأهميته وكيف يمكن عن طريقه الفصل بين ما يعتمد عليه الكلاس، وبين كيفية صناعته .. في هذه التدوينة سنقوم بإختبار النمط في أندرويد وكيف سيسهل عملية التطوير فيما بعد.   
هذه التدوينة لن تتطرق لـ Dagger ولكن سنحاول أن نقوم بما تقوم به Dagger في تطبيق أندرويد بسيط حتى نفهم الأمر جيدًا، لكن لماذا عنوان التدوينة Dagger الجزء الأول؟  
سبب تخصيص هذه التدوينة هو التعرف أكثر على النمط، لأنه كما أي شيء في صناعة البرمجيات، فإن الأدوات والتقنيات زائلة ويستبدل بعضها بعضا، لكن ما يبقى هو الأفكار وما استفدناه من تطبيقها، وما هي الأخطاء التي تعلمنا منها في صناعة أنماط أخرى. لنبدأ  

### قارئ البطارية###
سنستخدم تطبيق بسيط يقرأ حالة البطارية لنتعرف كيف نطبق من خلاله مبدأ Dependeny Injection، النموذج مفتوح المصدر وقد استعرته من  [erikcaffrey](https://github.com/erikcaffrey)، ولكي نستطيع التجربة والعمل بحرية .. قمت بعمل Branch جديد .. قمت فيه بإعادة الكود لحالته البدائية، يمكنك تصفح الخطوات بهذه التدوينة عبر الـ Commits الموجودة في Branch: dependency-injection-tutorial.

عند تصميم أي نظام أو القيام بـ Dependency Management فإنه من المهم أن يكون لديك مخطط ولو بسيط عن أجزاء النظام وعلاقة بعضه ببعض، هذا سيسهل عليك فيما بعد تطبيق مبدأ الـ Dependency Injecton واستخدام أي Framework في حالتنا هذه Dagger.

أجزاء النظام


---

**هذه ربما هي أهم المشاكل الخاصة عند عمل الكائنات داخل الكلاسات التي تحتاجها، لكن لنفهم ذلك بكتابة بعض الكود ..**

في البداية لدينا الكلاس Car

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
ولدينا الكلاس Person
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
المشكلة الآن أن الكلاس Person هي المسؤولة عن صناعة السيارة، ويظهر هذا عند استخدام Person في التطبيق.

```java
public class MainApplication {

    public void main(String[] args) {
        Person person = new Person();
        person.drive();
        person.learnSomeStuff();
    }
}
```
مهمة بناء كائن السيارة الآن يقع على عاتق الكلاس Person وهو ما يعد صعب حتى في الحياة العادية، لست عليك أن تصنع السيارة بنفسك لتقودها، ربما تشتريها أو تؤجرها من طرف آخر .. لكن صناعتها هي مهمة صعبة على Person لديه مهام أخرى يركز عليها.

**لنختبر الوضع الحالي للكود  ..**

- هل يمكنك استخدام الكلاس Person بوضعها الحالي لقيادة سيارة لامبورجيني مثلا؟ بالطبع لا.
-  هل يمكنك اختبار الكلاس Person بمعزلٍ  عن الكلاس Car؟ لا أيضًا.


من إجابة الأسئلة السابقة ومراجعة الكود، تدرك مشكلة بناء كائنات كلاس بداخل الكلاس المستخدمة.


### نسخة أفضل قليلًا Constructor and Setter injection


الكلاس Person تعتمد على كلاس Car، لذا فـ Car بالنسبة لـ Person تعتبر Dependency هذه العلاقة موجودة بغض النظر عن مكان بناء الكائن Car.

النسخة الأفضل للكود السابق هي أن نُحيل عمل الكائن Car للنظام أو الـ Client بمعنى أن طالما العميل سيقوم بعمل Person فليقم أيضًا بعمل سيارة حسب الطلب. الكود التالي يوضح الكيفية ..

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
فوائد النسخة السابقة تظهر  عند كتابة كود التطبيق
```java

    public void main(String[] args) {
        Car fiat = new Car(60, "128");
        Car lambo = new Car(150, "lambo");
        
        Person person = new Person(batMobile);
        person.drive();
        person.learnSomeStuff();
        
        Person anotherPerson = new Person(lambo); //أرزاق
        anotherPerson.drive();
        anotherPerson.learnSomeStuff();
    }
```


في هذه النسخة من الكود Person لا يعلم شيئًا عن صناعة السيارات، ولا يجب له أن يعلم، ولو سألت الأسئلة السابقة فستجد أنه:

- يمكنك الآن أن تجعل Person يقود أي سيارة تريد ..
- يمكنك أن تختبر Person بمعزلٍ عن الكلاس Car بأن تقوم بمحاكاة السيارة حسب حالات الاختبارات.

يمكنك الوصول للنتيجة السابقة عبر Setter injection أيضًا بأن تمرر كائن السيارة لميثود Set بدلاً من الـ Constructor
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
### ما هو الـ Dependency Injection
>In software engineering, dependency injection is a technique whereby one object supplies the dependencies of another object. A dependency is an object that can be used (a service). An injection is the passing of a dependency to a dependent object (a client) that would use it. The service is made part of the client's state.[1] Passing the service to the client, rather than allowing a client to build or find the service, is the fundamental requirement of the pattern.
 [Wikipedia](https://en.wikipedia.org/wiki/Dependency_injection)

هو أسلوب حيث يقوم كائن معين بإمداد كائن آخر بكل ما يحتاجه من Dependencies، و Dependency هو كائن يقوم باستخدامه كائن آخر ليقوم بمهمة ما .. ويتم بناء الـ Dependency كجزء من حالة العميل أو النظام، شرط هذا الأسلوب هو أن يتم تمرير الـ Dependency بدلًا من بنائها داخل الكائن المُستخدِم.

![dependency injection]({{ site.baseurl }}/images/posts/2017-10-31-dependency-injection/Dagger-feature.png "custom fonts Android support library"){:height="450"} 

بكلمات بسيطة جدًا .. هو عمل كلاس خاصة ببناء وإعداد كل الـ Dependencies الذي ستحتاجها أثناء بناء النظام .. في كل مرة تحتاج كائن لعمل كائن آخر .. ستطلبه من هذه الكلاس.

فائدة هذا الأسلوب أن مهمة بناء هذه الكائنات أصبح مُدارًا في مكان واحد (Seperate of concerns) وهو ما سيسهل عملية الاختبار ومحاكاة هذه الكائنات، وحتى تغييرها إذا تطلب الأمر.

**سنقوم الآن بتطبيق هذا الأسلوب على ما سبق  ..**

في البداية نحتاج لتغيير أنواع الكلاسات وجعلها أكثر ديناميكية عبر استخدام interfaces

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
الآن كل الكلاسات القديمة تعتمد على هذه العقود 


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
والآن مع عمل كلاس الـ Injector
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

وأخيرًا عند الاستخدام الفعلي وبرمجة النظام ..

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

في المثال قمت بعمل inject لكلاس Person في الكلاس الرئيسية للتطبيق، وقمت كذلك بعمل inject لكائنات السيارات التي ستحتاجها الأشخاص، وعملية الحقن نفسها يمكن أن تتم في أي مكان تريد Dependencirs يحتاجها كائن آخر.

مشكلة هذا الأسلوب أنه يحتاج الكثير من كتابة الكود المتكرر لكن مع تقنيات مثل Annotation proccessors تستطيع أن تستخدم framework جاهزة تقوم بإنشاء هذا الكود بالنيابة عنك .. وكل ما عليك هو القيام فقط ببعض الإعدادات .. أشهرها في عالم أندرويد وجافا هي Dagger وهو موضوع **مقالة قادمة..**













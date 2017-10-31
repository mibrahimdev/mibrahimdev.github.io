---
layout: post
title: "Dependency Injection: الطريق إلى Dagger"
---
معظمنا في البداية لا يأبه بعدد الكائنات التي يقوم ببنائها ليبدأ ببرمجة النظام .. وما أسهل كلمة new على المحرر ليقوم بتكملة الكود تلقائيًا وبناء Object جديد. لكن نظرة دقيقة على الكود تدرك أنك قد قمت ببناء الكثير من الكائنات الضرورية وغير الضرورية والتي سيدفع ثمنها الحاسوب المشغل من مصادره، خاصة لو كان محدود المصادر كالهاتف الذكي.  

والمشكلة الأكبر هو مقدار الجهد الذي ستتطلبه أنت عند إضافة ميزة جديدة أو فحص مشكلة، فالكلاسات المختلفة أصبحت "معشّقة" Tightly coupled وتأبى أن يفارق إحداها الأخرى .. وكيف لا وبينها العشرات من الكائنات التي تحتاج الرعاية والتربية.  

ناهيك عن صعوبة اختبار هذه الكلاسات، ففي كل مرة تحتاج مثلًا أن تقوم بكتابة Unit test للكلاس A تجد أنها تعتمد على كلاسات B , C ,D ,E و F. فاختبار كل كلاس بمعزلٍ عن الأخرى أصبح صعب .. مما يزيد من صعوبة التطوير والحصول على نظام مستقر.  

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

    public void learningSomeStuff(){
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
        Injector.Person person = injector.getPerson();
        Injector.Person anotherPerson = injector.getPerson();

        Car fiat = injector.getFiat();
        Car lambo = injector.getLambo();
        
        person.drive();
        person.learnSomeStuff();

        person.drive();
        person.learnSomeStuff();
```

في المثال قمت بعمل inject لكلاس Person في الكلاس الرئيسية للتطبيق، وقمت كذلك بعمل inject لكائنات السيارات التي ستحتاجها الأشخاص، وعملية الحقن نفسها يمكن أن تتم في أي مكان تريد Dependencirs يحتاجها كائن آخر.

مشكلة هذا الأسلوب أنه يحتاج الكثير من كتابة الكود المتكرر لكن مع تقنيات مثل Annotation proccessors تستطيع أن تستخدم framework جاهزة تقوم بإنشاء هذا الكود بالنيابة عنك .. وكل ما عليك هو القيام فقط ببعض الإعدادات .. أشهرها في عالم أندرويد وجافا هي Dagger وهو موضوع **مقالة قادمة..**













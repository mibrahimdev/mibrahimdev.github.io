---
layout: post
title: كيفية استخدام الخطوط المُخصصة في أندرويد - custom fonts in Android Support lib 26 
---

إلى وقت قريب لم تكن توجد طريقة رسمية لإضافة الخطوط المخصصة لتطبيقات أندرويد، فقط بضعة حلول قام بابتكارها المجتمع لحل تلك المشلكة، أهما:
### العناصر المُعدلة - custom views
في هذه الطريقة، كل ما عليك هو أن تقوم بكتابة عنصر خاص لاستبدال خطوط النظام، فإذا كنت تريد تغيير عنصر الزر مثلًا، فستقوم ببناء عنصر جديد يرث من العنصر Button، وتقوم بكتابة الكود المسؤول عن إضافة خطوطك الخاصة. الكود التالي يوضح كيفية تحديد خط العنصر، وهذا بعد إضافة الخطوط التي تريد في المسار  **assets**. أو في المسار **assets/fonts** لتنظيم الأمر قليلًا.
```java
Typeface tf = Typeface.createFromAsset(getContext().getAssets(), "assets/" + fontName;
setTypeface(tf);
```
### مكتبة Calligraphy
توجد عدة مكتبات مشهورة للقيام بهذا الأمر، فمشكلة الطريقة السابقة، أن أي عنصر View تريد استبدال خطوطه، سيتوجب عليك بناء عنصر جديد يرث منه خصائصه، ثم تخصيص الخطوط التي تريد إضافتها. لذا فالمكتبة تعتبر حل سريع وعملي للقيام بالأمر، أشهر مكتبة هي [Calligraphy](https://github.com/chrisjenx/Calligraphy).

في مؤتمر Google IO الأخير أعلن فريق تطوير أندرويد عن العديد من المميزات الجديدة في مكتبة الدعم الإصدار 26، من أهمها إمكانية تخصيص الخطوط، وبما أن هذه الميزة تأتي مع مكتبة الدعم، فإن الإصدارات القديمة من أندرويد لن تجد مشكلة في إظهار هذه الخطوط.

### كيفية استخدام الخطوط المخصصة مع مكتبة الدعم Support library 26

لتطبيق الأمر عمليًا قمت بتحميل نموذج لشاشة تسجيل ودخول موجودة مسبقًا وتستخدم الطريقة القديمة في تخصيص الخطوط، [رابط عرض وتحميل النموذج](https://www.uplabs.com/posts/login-signup-ui-kit). بعد تعديل ملفات Gradle وتحديث إصدار مكتبة الدعم، ثم بناء التطبيق تظهر الصورة التالية موضحة الخطوط المستخدمة في النموذج Sample.

![custom fonts Android support library 1]({{ site.baseurl }}/images/posts/2017-10-23-custom-fonts-android/Screenshot_20171023-175232.png "custom fonts Android support library"){:height="450"} 

**الآن سنتبع [خطوات](https://developer.android.com/guide/topics/ui/look-and-feel/fonts-in-xml.html#using-support-lib)  استخدام مكتبة الدعم ..**


- بعد ضغط يمين الماوس على فولدر res ستظهر القائمة لنختار منها New ثم Android resource directory ومن ثم نختار نوع الفولدر font.
- بعد إنشاء هذا الفولدر، سننقل ملفات الخطوط الموجودة في المسار assets/fonts لمسارها الجديد والمعتمد الآن res/font. إذا كنت تستخدم نسخة أندرويد ستوديو 3.0.0 التجريبية فيمكنك الضغط على ملف الخط لاستعراضه .. اشكرني لاحقًا.
- والأن سنقوم بإنشاء font family  وهي تعريف مجموعة من الخطوط وطريقة العرض لكي يتعرف عليها النظام. نضغط على فولدر font ثم New وأخيرًا Font resource file.
- ثم نضيف الكود التالي ..

```
<?xml version="1.0" encoding="utf-8"?>
<font-family xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">

<!--regular-->
<font
      android:font="@font/MavenPro_Regular"
      android:fontStyle="normal"
      android:fontWeight="400"
      
      app:font="@font/MavenPro_Regular"
      app:fontStyle="normal"
      app:fontWeight="400" />

  <!-- italic -->
  <font

      android:font="@font/MavenPro_Regular"
      android:fontStyle="italic"
      android:fontWeight="400"
      
      app:font="@font/MavenPro_Regular"
      app:fontStyle="italic"
      app:fontWeight="400" />

  <!-- bold -->
  <font
      android:font="@font/MavenPro_Bold"
      android:fontStyle="normal"
      android:fontWeight="700"
      
      app:font="@font/MavenPro_Bold"
      app:fontStyle="normal"
      app:fontWeight="700" />


</font-family>
```


**ملحوظة:** يجب إعادة كتابة السطور باستخدام attribute **app** لضمان دعم الإصدارات الأقدم من النظام.

الآن يمكننا استخدام هذه الخطوط برمجيًا أو عبر ملفات xml ..

**استخدامها برمجيًا**  
لا تختلف طريقة استخدام الخطوط برمجيًا عن الطريقة القديمة، الفرق أنك تجدها عبر R.font ، وتحصل عليها عبر **ResourcesCompat**  وعلى سبيل التجربة سنقوم بتغيير تخصيص الخطوط في العناصر المعدلة في النموذج الذي بين أيدينا. تجدها في الفولدر customfonts.

```java
if (!isInEditMode()) {
 	Typeface tf = ResourcesCompat.getFont(getContext(), R.font.app_font);
 	setTypeface(tf);
}
```
إذا قمنا بتشغيل التطبيق الآن، مفترض أن لا شيء سيتغير. لأننا نستخدم نفس الخطوط، المختلف فقط الطريقة.

**استخدامها عبر ملفات Xml**  
يمكننا استخدامها عبر attribute **fontFamily**

```
app:fontFamily="@font/app_font"
```
ولذلك سنقوم بتغيير custom views الموجودة في ملفات xml إلى عناصر النظام أو مكتبة الدعم، وتطبيق السطر السابق، ثم تشغيل التطبيق مرة أخرى. 
كما يمكنك استخدام app أو android للتعريف، لكن  **android:fontFamily** غير متاحة حتى api 16، قبل ذلك يمكنك استخدام **app:fontFamily**. ربما تجد lint warning لكن لا بأس .. فالتعريف صحيح. بعد تطبيق الخطوط في ملفات xml لا حاجة لنا في العناصر المعدلة الموجودة في customfonts ويمكننا حذفها.

**استخدامها عبر  ملف style**  
يمكننا كذلك استخدامها عبر ملف style لتعريف كالآتي

```
<style name="TextAppearance">
        <item name="fontFamily">@font/app_font</item>
</style>
```

**يمكنك إيجاد النموذج عبر [github](https://github.com/MohamedISoliman/Custom-fonts-supportLib-26) ، ومراجعة الخطوات السابقة عبر التنقل بين الـ [commits](https://github.com/MohamedISoliman/Custom-fonts-supportLib-26/commits/master)**

مصادر:  

<https://developer.android.com/guide/topics/ui/look-and-feel/fonts-in-xml.html>  
<https://segunfamisa.com/posts/custom-fonts-with-android-support-library>  














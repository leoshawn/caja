复合赋值运算符返回值不是数字
 ---
 <blockquote>复合复制运算符的结构不是数字（或者+=的结果不是字符串）,违反了ES3规范,简单赋值运算符结果可能不等于右边的值</blockquote>
 
#### 影响
不可读的值变为可读（并可能变成可写）。可以与[EvalArbitraryCodeExecution](https://code.google.com/p/google-caja/wiki/EvalArbitraryCodeExecution)结合使用执行任意代码。

#### 条件
* javascript子集中指定的“数字”型属性是隐式可读（或者可写的）
* javascript的实现子集假定了复合赋值表达式（除了<b style="color:red;">+=</b>)的结构都是数字，<b style="color:red;">+=</b>)的结构总是数字或者字符串，简单赋值表达式的结果一定等于右边
* javascript解释器的赋值实现不正确，以致于赋值运算的返回值被强制转换成了其他类型的值
* javascript子集允许左值计算，可以指向对象的属性

#### 背景

复合赋值运算符（如+=，*=，/=，%=，-=，<<=,>>=,>>>=,&=,^=,|=）用于指定相应运算符的计算结果，通常为数字，或者数字或字符串（运算符为<b style="color:red">+=</b>时）。Caja，ADsafe以及Jacaranda无条件地允许通过“字符串”数字（例如“3”）读取属性值。

例如，在某些版本的SpiderMoneky中，typeof(window.location += ''以及window.location -= 0的结果都不是字符串，而是“object”)。这是因为window对象将location属性强制转换成了object类型。有关SpiderMonkey复合赋值运算符bug，可以参考[本链接](https://bugzilla.mozilla.org/show_bug.cgi?id=312354)查看具体内容。

这意味着向[x.prop -= 0]这样的属性读取方法有可能实际上是在读取本来不可读（或者本来不可写，在左值计算时）的属性

同样的问题也会在简单赋值时出现，如果javascript的实现认定简单赋值的结果与右侧相同。
大部分javascript实现子集都会限制对宿主对象的直接访问，因此本文所讲内容被滥用的可能性较少。但是对于一些非宿主对象，例如SpiderMonkey里的RegExp和Array对象，也会存在危险。
对SpiderMoneky里的非宿主对象（下文有示例）使用[watcher](https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Object/watch)或者setter也会导致相同的后果，但是大部分其他javascript子集都会阻止"watch"和'\_\_defineSetter\_\_'方法。

在Jacaranda里不存在这样的问题（虽然RegExp对象是可读的），因为只有局部变量和this的属性可以用于左值计算，而且this必须指向对象字面量。Caja和ADsafe也不存在此漏洞。

#### 影响的版本
* Firefox Spidermonkey 3.0.4以及更早版本
* SpiderMonky主干代码已修复此问题

#### 示例
```javascript
foo[window.location -= 0];	// 存取foo对象名称为当前URL值的属性
```

```javascript
(<xml/>.x=0) + 0;		// 返回"00",而不是0(E4X)
```

```javascript
 var obj = {};
  obj.watch(
      'foo',
      function (prop, oldval, newval) {
        return typeof newval === 'number' && isNaN(newval) ? oldval : newval;
      });
  obj.foo = 'foo';
  (obj.foo -= 1);  // 返回 'foo',而不是 NaN
```
以下代码来自Mozill的bug报告：
```javascript
var gprop = [];
var p = "length";

function test0()
{
  function inner()
  {
    var r;
    return typeof (r = this[p] = "5");
  }

  var thisp = [];
  return inner.call(thisp);
}

function test1(argvar)
{
  var r;
  return typeof (r = argvar = "5");
}

function test2()
{
  var r;
  return typeof (r = gprop.length = "5");
}

this.__defineSetter__("topSet", function(v) { return 17; });

function test3()
{
  var r;
  return typeof (r = topSet = "5");
}

function test4()
{
  var r, c = [];
  return typeof (r = c[p] = "5");
}

function test5()
{
  var r, local = [];
  return typeof (r = local.length = "5");
}

function test6()
{
  function inner()
  {
    var r;
    return typeof (r = this.length = "5");
  }

  var thisp = [];
  return inner.call(thisp);
}

function test7()
{
  if (typeof (<foo/>.x = 5) == "number")
    return "string";
  return "number got converted!";
}

function test8()
{
  if (typeof (<foo/>.x = true) == "boolean")
    return "string";
  return "boolean got converted!";
}

var allTests = [test0, test1, test2, test3, test4, test5, test6, test7, test8];

for (var i = 0; i < allTests.length; i++)
{         
  if ("string" !== allTests[i]())
    throw "fail test" + i + "()";
}
```
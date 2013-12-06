Eval突破闭包
---
#### 影响
读取和修改SpiderMonkey中闭包的私有状态
---
#### 背景
EcmaScript规范规定了函数的作用域链。所有变量的作用域链都受其所在函数限制。
例如：
<pre><code> function counter(i) {
    return function() { return ++i; }
}
</code></pre>
counter函数中定义了一个局部变量<code>i</code>,并且返回了一个匿名函数，这个匿名函数在counter执行结束后仍然能够读取和设置<code>i</code>的值。因此，这个匿名函数的作用域为[counter(i), global]（即counter函数的作用域和全局作用域，译者注），也就是说在检查改匿名函数中没有定义的变量时，首先会检查<code>counter(i)</code>的作用域，再检查全局作用域。
许多开发者以为一个函数在返回后，其局部变量只能通过这个函数返回的闭包函数来操作，
从而起到保护数据的作用。
eval函数通用也会使用函数执行的当前作用域链来对变量进行解析。
然而，SpiderMonkey破坏了这种假设。eval函数接受第二个可选参数，如果设置了这个参数
，函数变量的作用域解析将会是当前执行的脚本环境而不是当前的作用域链。

##### 假设
不可信代码可以引用作用域链包含了敏感数据的函数而且eval函数可以接收两个参数。

#### 版本
Firefox 2、3，Firefox 3.7将会移除这个参数，通常这被认为是firefox的bug。

#### 示例
<pre><code>
// 用于产生连续的数字
function counter(i) {
    return function() { return ++i; }
}

var myCounter = counter(0);
alert(myCounter());     // =>1
eval('i=4', myCounter);
alert(myCounter());     // =>5 on firefox 2, 2 on other browsers
</code></pre>
>   解释：
>   通过执行eval('i=4')，将i的值变成了4，此时i在全局域内。然后调用myCounter函数，因为Firefox的bug允许将myCounter的作用域链修改为当前的脚本执行的全局作用域，因此myCounter读取到的i值为4，从而执行++i的结果为5

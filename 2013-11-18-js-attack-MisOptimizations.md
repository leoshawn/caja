错误的优化
---
<blockquote>某些javascript解释器在执行代码之前会进行优化，导致了js内置操作符在语义上的细微变化。（例如[后置自增自减操作返回非数值结果](https://code.google.com/p/google-caja/wiki/PostIncrementAndDecrementCanReturnNonNumber)，[英文原文链接](https://code.google.com/p/google-caja/wiki/MisOptimizations)</blockquote>
#### 解释器优化引发难以查找的错误
****
##### 影响
后置加加操作等基本运算会因为上下文代码的不同而存在与规范不一样的语义行为。

##### 背景
遵循EcmaScript标准的解释器厂商都会尽量保证对规范的正确实现，但在实际中，厂商还需要权衡考虑性能、产品发布时间等因素。

虽然javascript解释器的不规范实现存在隐患，但是同源策略仍然能够很好地保证网站的安全。

##### 假设
同源模型不能用于分隔不可信代码和正常代码。如果存在一些依赖于规范语义实现的代码，攻击者就可以通过发现尚未修复部署的不规范实现来进行攻击。

#### 版本
未知

#### 示例
IE6和IE7中：
```javascript
      'string' === (typeof ((function (x) { return x++; })('foo')));
```

IE 6中的运行情况如图所示![image](http://gtms01.alicdn.com/tps/i1/T1r3IcXm0jXXb8nwfK-1364-768.png)

而在chrome中的运行结果为false

但是如果修改成以下代码：
```javascript
'number' === (typeof ((function (x) { return (function () { return x++; })(); })('foo')));
```

在ie6中的运行结果为：
![image](http://gtms01.alicdn.com/tps/i1/T1HNH.Xh8jXXb8nwfK-1364-768.png)
在chrome中的运行结果也为true

请注意，第二段代码中x不是参数，也不是自增操作发生范围内的局部变量。
这里的差异是因为ie6对后置自增自减的实现不规范引起的，更多详情可以看另外一篇[文章](https://code.google.com/p/google-caja/wiki/PostIncrementAndDecrementCanReturnNonNumber)。
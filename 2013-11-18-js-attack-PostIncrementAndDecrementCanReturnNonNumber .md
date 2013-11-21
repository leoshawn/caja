后置自增自减操作可以返回非数值型结果
---
<blockquote>后置自增自减操作符的不规范实现会影响当前被存取的属性。</blockquote>
#### 影响
利用本方法可以读取（甚至写入）不能被读取的属性。可以和[EvalArbitraryCodeExecution](https://code.google.com/p/google-caja/wiki/EvalArbitraryCodeExecution "使用Eval执行恶意代码")方法结合使用进行攻击。

#### 假设
*	
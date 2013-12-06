隐藏的控制权转换危害
---
>   看似安全的caja数据计算有可能引发控制流的转移，造成极大的安全隐患。

#### 介绍
>   由Tyler Close报告

Caja开发者计算<code>x+y</code>时，其中<code>x</code>和<code>y</code>都是有其他
caja模块提供的,可能会将控制权转换给其他模块。这是因为javascript的强制转换规则（
coercion rule）会隐式调用<code>valueOf()</code>和<code>toString()</code>方法。

目前解决这个bug的计划是禁止<code>valueof()</code>函数的绑定，并且仅允许
<code>asSimpleFunc()</code>和<code>asXo4a()</code>等函数绑定<code>toString()</code>方法。
然而，因为我们仍然允许caja代码的<code>toString()</code>方法绑定，仍然存在隐式控
制流转换的危害。

跳过Finally
---
<blockquote>fianlly模块可能没有执行导致script块代码继续</blockquote>

#### 影响

#### 条件
* 敏感数据采用finally来保证正确性
* 控制语句不在带有catch声明的try语句中
* 在finally区块中的关键代码会导致敏感数据引发的异常。栈溢出会导致异常。

#### 浏览器版本
IE 6或更高版本

#### 案例
IE6下
```javascript
try {
	;
} finally {
	alert('Finally');
}
```

会执行alert('Finally')

```javascript
try {
	throw new Error();
} catch (e) {
	throw e;
} finally {
	alert('Finally');
}
```

也会弹出alert窗口，而如下意思相同的代码却不会。
```javascript
try {
	throw new Error();
} finally {
	alert('Finally');
}
```
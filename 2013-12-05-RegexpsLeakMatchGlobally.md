正则表达式泄露匹配字符
---
### 影响
不可信代码获取隐私信息

### 背景
根据EcmaScript 262规范，<code>RegExp.prototype.exec</code>在没有参数时将返回
<code>'undefined'</code>，但是有的脚本解析器并没有遵照规范来实现，在没有传递参数
给<code>RegExp.prototype.exec</code>时，会返回上一次匹配的结果。

### 假设
攻击者可以调用没有参数的字符串匹配函数并且观察到输出结果。上一次的匹配信息有可能
是敏感信息。

### 影响到的浏览器版本
Firefox 2,IE6不受影响，其他浏览器未测试。

#### 示例
<pre><code>
// 特权代码
(function() {
    var queryString = document.location.search; //假设为"?password=1234"    

    function params() {
        return queryString.split(/[&?]/g);
    }

    if (params()[0] === 'debug=on') {
        // ...
    }
})();

// 不能直接读取 document.location 的代码
(function() {
    alert(/.*/.exec());
})()
</code></pre>

解决方法：
<pre><code>
function params() {
    try {
        return queryString.split(/[&?]/g);
    } finally {
        /^/.exec('NOTHING TO SEE HERE. MOVE ALONG.');
    }
}
</code></pre>

# Markdown Test

这是一篇用于测试各种 Markdown 语法特性的博客文章。我们将展示 Markdown 中常用的各种格式化选项。

## 1. 文本格式化

这是普通文本。

**这是粗体文本**

*这是斜体文本*

***这是粗斜体文本***

~~这是删除线文本~~

`这是行内代码`

## 2. 引用

> 这是一级引用
>> 这是嵌套引用
>>> 这是三级引用

## 3. 列表

### 无序列表
* 苹果
    * 红富士
    * 青苹果
* 香蕉
* 橙子

### 有序列表
1. 第一步
2. 第二步
    1. 子步骤 1
    2. 子步骤 2
3. 第三步

### 任务列表
- [x] 已完成任务
- [ ] 未完成任务
- [x] 第三个任务

## 4. 代码块

### JavaScript 代码示例
```javascript
function sayHello(name) {
    console.log(`Hello, ${name}!`);
    return {
        greeting: 'Hello',
        name: name
    };
}

// 测试函数
sayHello('World');
```

### Python 代码示例
```python
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# 生成斐波那契数列的前10个数
[fibonacci(i) for i in range(10)]
```

## 5. 表格

| 功能 | 支持程度 | 备注 |
|------|----------|------|
| 基础语法 | ✅ | 完全支持 |
| 扩展语法 | ⚠️ | 部分支持 |
| 自定义样式 | ❌ | 不支持 |

## 6. 链接与图片

### 链接
[访问 GitHub](https://github.com)

### 图片
![示例图片](https://picsum.photos/800/400)

| ![示例图片](https://picsum.photos/800/400) |
|:--:|
| Beautiful sunset over the ocean |

## 7. 数学公式

当 $a \ne 0$ 时，方程 $ax^2 + bx + c = 0$ 有两个解：

$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}$$

## 8. 分隔线

下面是一条分隔线：

---

## 9. 注释和脚注

这里有一个注释[^1]和另一个注释[^2]。

[^1]: 这是第一个注释的解释
[^2]: 这是第二个注释的解释

## 10. HTML 原生支持

<details>
<summary>点击展开详情</summary>

这是展开后的详细内容。
* 可以包含列表
* 可以包含其他 Markdown 语法

</details>

<div style="padding: 20px; background-color: #f0f0f0; border-radius: 5px;">
  这是一个使用 HTML 和内联样式的自定义块
</div>

## 11. emoji 表情支持

* 👋 Hello
* 🎉 庆祝
* 🐱 猫咪
* 🚀 火箭
* 💡 灵感

## 总结

这篇文章展示了 Markdown 的主要语法特性，你可以：
1. 用它来测试你的 Markdown 渲染器
2. 作为 Markdown 语法的快速参考
3. 检查样式是否正确应用

希望这个示例对你有帮助！

---

*最后更新于：2024年3月*
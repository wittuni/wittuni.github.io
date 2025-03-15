async function loadBlogContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogFile = urlParams.get('blog');

    try {
        const response = await fetch(`/blogs/${blogFile}`);
        if (!response.ok) throw new Error('Blog not found');

        const markdown = await response.text();

        const { Marked } = globalThis.marked;
        const { markedHighlight } = globalThis.markedHighlight;
        const marked = new Marked(
            markedHighlight({
                emptyLangClass: 'hljs',
                langPrefix: 'hljs language-',
                highlight(code, lang, info) {
                    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                    return hljs.highlight(code, { language }).value;
                }
            })
        );

        marked.use({
            extensions: [{
                name: 'math',
                level: 'inline',
                start(src) { return src.match(/\$/)?.index; },
                tokenizer(src) {
                    const match = src.match(/^\$([^$]+)\$/);
                    if (match) {
                        return {
                            type: 'math',
                            raw: match[0],
                            text: match[1].trim()
                        };
                    }
                },
                renderer(token) {
                    return katex.renderToString(token.text, {
                        throwOnError: false,
                        displayMode: false
                    });
                }
            }, {
                name: 'math',
                level: 'block',
                start(src) { return src.match(/\$\$/)?.index; },
                tokenizer(src) {
                    const match = src.match(/^\$\$([^$]+)\$\$/);
                    if (match) {
                        return {
                            type: 'math',
                            raw: match[0],
                            text: match[1].trim()
                        };
                    }
                },
                renderer(token) {
                    return katex.renderToString(token.text, {
                        throwOnError: false,
                        displayMode: true
                    });
                }
            }]
        });

        // 渲染 Markdown
        const content = document.getElementById('content');
        content.innerHTML = marked.parse(markdown);

        // 设置标题
        const h1 = content.querySelector('h1');
        if (h1) {
            document.getElementById('articleTitle').textContent = h1.textContent;
            h1.remove();
        }
    } catch (error) {
        console.error('Error loading blog:', error);
        document.getElementById('content').innerHTML = `<p>${error.message}</p>`;
    }
}

// 切换暗/亮模式
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('light-mode');

    // 切换代码高亮样式
    const isDarkMode = !body.classList.contains('light-mode');

    // 获取当前高亮样式链接
    const highlightStyleLink = document.querySelector('link[href*="highlight.js"]');

    if (isDarkMode) {
        highlightStyleLink.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css";
    } else {
        highlightStyleLink.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css";
    }

    // 重新应用高亮
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });

    // 保存用户偏好
    localStorage.setItem('blogDarkMode', isDarkMode);
}

// 页面加载时检查并应用保存的亮/暗模式设置
document.addEventListener('DOMContentLoaded', () => {
    const savedDarkMode = localStorage.getItem('blogDarkMode');

    if (savedDarkMode !== null) {
        const isDarkMode = savedDarkMode === 'true';

        if (!isDarkMode) {
            // 如果保存的是亮色模式，手动触发一次切换
            toggleDarkMode();
        }
    }
});

// 切换全屏模式
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`全屏错误: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function downloadAsPdf() {
    window.print();
}


document.addEventListener('DOMContentLoaded', loadBlogContent);
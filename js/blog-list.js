// 加载和显示博客列表
async function loadBlogList() {
    const blogListContainer = document.getElementById('blog-list');

    try {
        const response = await fetch('/blogs/list.json');

        if (!response.ok) {
            throw new Error('无法获取博客列表');
        }

        const blogs = await response.json();

        // 清空加载提示
        blogListContainer.innerHTML = '';

        // 显示博客列表
        blogs.forEach(blog => {
            const blogElement = createBlogElement(blog);
            blogListContainer.appendChild(blogElement);
        });

        // 如果没有博客
        if (blogs.length === 0) {
            blogListContainer.innerHTML = '<p class="blog-loading">暂无博客文章</p>';
        }
    } catch (error) {
        console.error('加载博客列表失败:', error);
        blogListContainer.innerHTML = `<p class="blog-loading">加载博客列表失败: ${error.message}</p>`;
    }
}

// 创建单个博客元素
function createBlogElement(blog) {
    const blogItem = document.createElement('div');
    blogItem.className = 'blog-item';
    blogItem.addEventListener('click', () => {
        window.location.href = `reader.html?blog=${encodeURIComponent(blog.file)}`;
    });

    // 构建HTML结构
    blogItem.innerHTML = `
        <div class="blog-item-wrapper">
            ${blog.coverImage ? `<img src="${blog.coverImage}" alt="${blog.title}" class="blog-cover">` : ''}
            <div class="blog-content">
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-description">${blog.description}</p>
                <div class="blog-meta">
                    <span>${blog.date}</span>
                    <span>${blog.author || '/'}</span>
                </div>
            </div>
            ${blog.tags && blog.tags.length > 0 ? `
                <div class="blog-tags-container">
                    ${blog.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `;

    return blogItem;
}

// 页面加载时执行
document.addEventListener('DOMContentLoaded', loadBlogList);
// 本地化处理
class Localizer {
    constructor() {
        this.currentLanguage = 'en'; // 默认语言
        this.translations = {};
        this.init();
    }

    // 初始化
    async init() {
        // 加载浏览器首选语言或保存的语言
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang) {
            this.currentLanguage = savedLang;
        } else {
            // 如果没有保存的语言，检查浏览器语言
            const browserLang = navigator.language.split('-')[0];
            if (browserLang === 'zh') {
                this.currentLanguage = 'zh';
            }
        }

        // 设置选择器初始值
        document.getElementById('language-selector').value = this.currentLanguage;

        // 加载初始语言
        await this.loadTranslation(this.currentLanguage);
        this.updateContent();

        // 添加语言切换事件监听
        document.getElementById('language-selector').addEventListener('change', async (event) => {
            this.currentLanguage = event.target.value;
            localStorage.setItem('preferredLanguage', this.currentLanguage);
            await this.loadTranslation(this.currentLanguage);
            this.updateContent();
        });
    }

    // 加载翻译文件
    async loadTranslation(lang) {
        try {
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            // 如果加载失败，尝试使用默认语言
            if (lang !== 'en') {
                this.currentLanguage = 'en';
                await this.loadTranslation('en');
            }
        }
    }

    // 获取嵌套属性的值
    getNestedTranslation(key) {
        return key.split('.').reduce((obj, i) => (obj && obj[i] !== undefined) ? obj[i] : null, this.translations);
    }

    // 更新页面内容
    updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getNestedTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });

        // 也可以处理属性翻译，例如占位符
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getNestedTranslation(key);
            if (translation) {
                element.setAttribute('placeholder', translation);
            }
        });
    }
}

// 创建本地化处理器实例
const localizer = new Localizer();
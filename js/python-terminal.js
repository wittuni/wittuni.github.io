document.addEventListener('DOMContentLoaded', function () {
    // 获取DOM元素
    const terminal = document.getElementById('python-terminal');
    const runButton = document.getElementById('run-code-btn');
    const clearButton = document.getElementById('clear-terminal-btn');
    const resetButton = document.getElementById('reset-env-btn');
    const maximizeButton = document.getElementById('maximize-terminal-btn');

    // 如果没有找到相关元素，直接返回
    if (!terminal || !runButton) return;

    const customStyle = document.createElement('style');
    customStyle.textContent = `
    /* 弹出窗口样式 */
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: rgba(0,0,0,0);
        transition: background-color 0.2s ease;
    }
    
    .modal.visible {
        background-color: rgba(0,0,0,0.4);
    }
    
    .modal-content {
        background-color: #1E1E1E;
        margin: 5% auto;
        padding: 20px;
        border: 1px solid #444;
        width: 80%;
        height: 80%;
        border-radius: 5px;
        position: relative;
        display: flex;
        flex-direction: column;
        opacity: 0;
        transform: scale(0.97);
        transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .modal.visible .modal-content {
        opacity: 1;
        transform: scale(1);
    }
    
    .modal-header {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;
        position: relative;
    }
    
    .modal-header h2 {
        margin: 0;
        color: #fff;
        text-align: center;
    }
    
    .modal-terminal {
        flex: 1;
        overflow: auto;
        background-color: #1E1E1E;
        color: #fff;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        padding: 10px;
        box-sizing: border-box;
        white-space: pre-wrap;
        border: 1px solid #444;
    }
    
    .close-modal {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        border: 1px solid #aaa;
        background-color: transparent;
        color: #aaa;
        border-radius: 5px;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Andy Bold', sans-serif;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 0;
    }
    
    .close-modal:hover,
    .close-modal:focus {
        color: white;
        border-color: white;
        text-decoration: none;
    }
    
    .CodeMirror {
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
    }
   
`;
    document.head.appendChild(customStyle);

// 创建模态窗口
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
    <div class="modal-content">
        <div class="modal-header">
            <h2>Terminal Output</h2>
            <button class="close-modal">X</button>
        </div>
        <div class="modal-terminal" id="modal-terminal-content"></div>
    </div>
`;

    document.body.appendChild(modal);

    // 获取关闭按钮和模态终端元素
    const closeModalBtn = modal.querySelector('.close-modal');
    const modalTerminal = document.getElementById('modal-terminal-content');

    // 放大按钮点击事件
    addOnButtonClickListener(maximizeButton, function () {
        // 复制终端内容到模态窗口
        modalTerminal.innerHTML = terminal.innerHTML;
        // 显示模态窗口
        modal.style.display = 'block';

        // 触发动画
        setTimeout(() => {
            modal.classList.add('visible');
        }, 10);

        // 滚动到底部
        modalTerminal.scrollTop = modalTerminal.scrollHeight;
    });

    // 关闭模态窗口
    closeModalBtn.addEventListener('click', function () {
        closeModal();
    });

// 点击模态窗口外部时关闭
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

// 按ESC键关闭窗口
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

// 封装关闭模态窗口的功能
    function closeModal() {
        modal.classList.remove('visible');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 200);
    }

    const codeEditor = CodeMirror.fromTextArea(document.getElementById('python-code-editor'), {
        mode: 'python',
        theme: 'zenburn',
        lineNumbers: true,
        indentUnit: 2,
        smartIndent: true,
        indentWithTabs: false,
        lineWrapping: true,
        gutters: ["CodeMirror-linenumbers"],
        extraKeys: {
            "Tab": function (cm) {
                cm.replaceSelection("  ", "end");
            }, 'Ctrl-Enter': runPythonCode
        }
    });

    // Pyodide
    let pyodide = null;
    let isLoadingPyodide = false;

    initialHints();

    // 加载Pyodide
    async function loadPyodide() {
        if (pyodide !== null) return pyodide;
        if (isLoadingPyodide) return null;

        isLoadingPyodide = true;
        appendToTerminal('Loading Python env...', 'terminal-info');

        try {
            pyodide = await globalThis.loadPyodide();
            await pyodide.loadPackage("micropip");
            const micropip = pyodide.pyimport("micropip");
            //await micropip.install('sympy');
            appendToTerminal('Python env ready', 'terminal-success');
        } catch (error) {
            appendToTerminal(`Failed loading Python env: ${error}`, 'terminal-error');
            console.error('Failed loading Python env', error);
        } finally {
            isLoadingPyodide = false;
        }

        return pyodide;
    }

    function appendToTerminal(text, className = '') {
        const output = document.createElement('div');
        output.className = `terminal-output ${className}`;
        output.textContent = text;
        terminal.appendChild(output);
        terminal.scrollTop = terminal.scrollHeight;

        // 如果模态窗口是打开的，也更新模态窗口中的终端内容
        if (modal.style.display === 'block') {
            const modalOutput = document.createElement('div');
            modalOutput.className = `terminal-output ${className}`;
            modalOutput.textContent = text;
            modalTerminal.appendChild(modalOutput);
            modalTerminal.scrollTop = modalTerminal.scrollHeight;
        }
    }

    // 运行Python代码
    async function runPythonCode() {
        const code = codeEditor.getValue();

        if (!code.trim()) {
            return;
        }

        const codeLines = code.split('\n').filter(line => line.trim() !== '');
        const lineCount = codeLines.length;

        if (lineCount === 1) {
            appendToTerminal(`>>> ${codeLines[0]}`, 'terminal-input');
        } else {
            appendToTerminal(`>>> [${lineCount} lines of Python code executed]`, 'terminal-input');
        }

        // 确保Pyodide已加载
        const pyodideInstance = pyodide || await loadPyodide();
        if (!pyodideInstance) {
            appendToTerminal('Python env not ready. Try again later.', 'terminal-error');
            return;
        }

        try {
            // 重定向stdout到终端
            await pyodideInstance.runPythonAsync(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
        sys.stderr = StringIO()
    `);

            // 执行
            await pyodideInstance.runPythonAsync(code);

            // 获取输出
            const stdout = await pyodideInstance.runPythonAsync("sys.stdout.getvalue()");
            const stderr = await pyodideInstance.runPythonAsync("sys.stderr.getvalue()");

            // 重置stdout和stderr
            await pyodideInstance.runPythonAsync(`
        sys.stdout = sys.__stdout__
        sys.stderr = sys.__stderr__
    `);

            if (stdout) appendToTerminal(stdout);
            if (stderr) appendToTerminal(stderr, 'terminal-error');

        } catch (error) {
            appendToTerminal(`Error: ${error.message}`, 'terminal-error');
        }
    }

    function clearTerminal() {
        terminal.innerHTML = '';
        initialHints();
    }

    function initialHints() {
        appendToTerminal("Mini Terminal for Python", "terminal-info");
        if (!pyodide) {
            appendToTerminal("Python env will be loaded on first execution", "terminal-info");
        }
    }

    async function resetPyodideEnv() {
        pyodide = null;
        clearTerminal();
        appendToTerminal('Python env reset', 'terminal-info');
    }

    addOnButtonClickListener(runButton, runPythonCode);

    if (clearButton) {
        addOnButtonClickListener(clearButton, clearTerminal);
    }

    if (resetButton) {
        addOnButtonClickListener(resetButton, resetPyodideEnv);
    }


});
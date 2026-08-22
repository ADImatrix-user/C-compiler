/**
 * AB C Studio | Application Logic
 * Real-Time Inline Interactive Terminal & High-Performance C Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Editor
  const codeEditor = document.getElementById('codeEditor');
  const lineNumbers = document.getElementById('lineNumbers');
  const editorDropZone = document.getElementById('editorDropZone');
  const fileUploadInput = document.getElementById('fileUploadInput');
  const fileTitleDisplay = document.getElementById('fileTitleDisplay');
  const browseFileBtn = document.getElementById('browseFileBtn');
  const runCodeBtn = document.getElementById('runCodeBtn');
  const mobileRunBtn = document.getElementById('mobileRunBtn');
  const runIcon = document.getElementById('runIcon');
  const runBtnLabel = document.getElementById('runBtnLabel');

  const lineCountLabel = document.getElementById('lineCountLabel');
  const charCountLabel = document.getElementById('charCountLabel');

  // DOM Elements - Layout & Mobile Switcher
  const workspaceLayout = document.getElementById('workspaceLayout');
  const panelEditor = document.getElementById('panelEditor');
  const panelOutput = document.getElementById('panelOutput');
  const workspaceResizer = document.getElementById('workspaceResizer');
  const tabViewCode = document.getElementById('tabViewCode');
  const tabViewOutput = document.getElementById('tabViewOutput');
  const outputBadgeDot = document.getElementById('outputBadgeDot');

  // DOM Elements - Output & Menu
  const terminalLogs = document.getElementById('terminalLogs');
  const compilerStatusBadge = document.getElementById('compilerStatusBadge');
  const executionTimeLabel = document.getElementById('executionTimeLabel');
  const exitStatusLabel = document.getElementById('exitStatusLabel');
  const shareCodeBtn = document.getElementById('shareCodeBtn');

  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const studioDropdown = document.getElementById('studioDropdown');
  const fullScreenToggleBtn = document.getElementById('fullScreenToggleBtn');
  const fullScreenIcon = document.getElementById('fullScreenIcon');
  const fullScreenText = document.getElementById('fullScreenText');
  const clearConsoleBtn = document.getElementById('clearConsoleBtn');
  const copyConsoleBtn = document.getElementById('copyConsoleBtn');
  const downloadSourceBtn = document.getElementById('downloadSourceBtn');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // State
  let isExecuting = false;
  let isResizing = false;

  // Starter C Code
  const DEFAULT_STARTER_CODE = `// AB C Studio | Fast, Distraction-Free Online C Compiler
#include <stdio.h>

void displayBanner() {
    printf("⚡ Welcome to AB C Studio!\\n");
    printf("==========================================\\n");
}

int main() {
    displayBanner();
    
    // Demo: Calculate sum of squares
    int n = 5;
    int sum = 0;
    
    printf("Calculating sum of squares (1 to %d):\\n", n);
    for (int i = 1; i <= n; i++) {
        int sq = i * i;
        sum += sq;
        printf(" -> %d^2 = %2d  (Running Sum: %d)\\n", i, sq, sum);
    }
    
    printf("\\n🚀 Total Sum: %d\\n", sum);
    printf("✨ Ready to write your next C program!\\n");
    return 0;
}`;

  // Initial code load from localStorage or default starter code
  const savedCode = localStorage.getItem('ab_c_studio_code');
  codeEditor.value = savedCode !== null ? savedCode : DEFAULT_STARTER_CODE;

  renderInitialOutputGreeting();

  function renderInitialOutputGreeting() {
    terminalLogs.innerHTML = `
      <div class="log-entry info-text">⚡ AB C Studio Online Compiler (GCC 13.2 / C17)</div>
      <div class="log-entry welcome-text">Ready. Press "Run Code" or (Ctrl + Enter) to execute your program.</div>
    `;
  }

  // =========================================================================
  // MOBILE VIEW SWITCHER
  // =========================================================================
  workspaceLayout.classList.add('viewing-editor');

  function setMobileView(view) {
    if (view === 'editor') {
      workspaceLayout.classList.add('viewing-editor');
      workspaceLayout.classList.remove('viewing-output');
      tabViewCode.classList.add('active');
      tabViewOutput.classList.remove('active');
    } else if (view === 'output') {
      workspaceLayout.classList.remove('viewing-editor');
      workspaceLayout.classList.add('viewing-output');
      tabViewCode.classList.remove('active');
      tabViewOutput.classList.add('active');
      outputBadgeDot.classList.remove('has-update');
    }
  }

  tabViewCode.addEventListener('click', () => setMobileView('editor'));
  tabViewOutput.addEventListener('click', () => setMobileView('output'));

  // =========================================================================
  // TOAST NOTIFICATIONS
  // =========================================================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${escapeHTML(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // =========================================================================
  // CODE EDITOR UTILITIES & LINE NUMBERS
  // =========================================================================
  function updateEditorStats() {
    const lines = codeEditor.value.split('\n');
    const lineCount = lines.length;
    let numbers = '';
    for (let i = 1; i <= lineCount; i++) {
      numbers += i + '\n';
    }
    lineNumbers.textContent = numbers;
    lineCountLabel.textContent = lineCount;
    charCountLabel.textContent = codeEditor.value.length;
  }

  codeEditor.addEventListener('input', () => {
    updateEditorStats();
    localStorage.setItem('ab_c_studio_code', codeEditor.value);
  });

  codeEditor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = codeEditor.scrollTop;
  });

  // Tab & Auto-closing Brackets Keydown
  codeEditor.addEventListener('keydown', (e) => {
    // Ctrl + Enter to Compile & Run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
      return;
    }

    // Ctrl + S to Save / Download
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      downloadSource();
      return;
    }

    // Tab key (4 spaces)
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = codeEditor.selectionStart;
      const end = codeEditor.selectionEnd;
      codeEditor.value = codeEditor.value.substring(0, start) + '    ' + codeEditor.value.substring(end);
      codeEditor.selectionStart = codeEditor.selectionEnd = start + 4;
      updateEditorStats();
      return;
    }

    // Auto-close brackets & quotes
    const pairs = {
      '(': ')',
      '{': '}',
      '[': ']',
      '"': '"',
      "'": "'"
    };

    if (pairs[e.key]) {
      const start = codeEditor.selectionStart;
      const end = codeEditor.selectionEnd;
      if (start === end) {
        e.preventDefault();
        const openChar = e.key;
        const closeChar = pairs[e.key];
        codeEditor.value = codeEditor.value.substring(0, start) + openChar + closeChar + codeEditor.value.substring(end);
        codeEditor.selectionStart = codeEditor.selectionEnd = start + 1;
        updateEditorStats();
      }
    }
  });

  // Browse / Open File Trigger
  if (browseFileBtn) {
    browseFileBtn.addEventListener('click', () => {
      fileUploadInput.click();
    });
  }

  // =========================================================================
  // DRAG & DROP FILE SUPPORT
  // =========================================================================
  function loadFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      codeEditor.value = e.target.result;
      fileTitleDisplay.textContent = file.name || 'main.c';
      updateEditorStats();
      localStorage.setItem('ab_c_studio_code', codeEditor.value);
      showToast(`Loaded ${file.name}`, 'success');
    };
    reader.readAsText(file);
  }

  ['dragenter', 'dragover'].forEach(name => {
    editorDropZone.addEventListener(name, (e) => {
      e.preventDefault();
      e.stopPropagation();
      editorDropZone.classList.add('drag-active');
    });
  });

  ['dragleave', 'dragend'].forEach(name => {
    editorDropZone.addEventListener(name, (e) => {
      e.preventDefault();
      e.stopPropagation();
      editorDropZone.classList.remove('drag-active');
    });
  });

  editorDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    editorDropZone.classList.remove('drag-active');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      loadFile(e.dataTransfer.files[0]);
    }
  });

  fileUploadInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      loadFile(e.target.files[0]);
    }
  });

  // =========================================================================
  // WORKSPACE RESIZER (Desktop & Tablets)
  // =========================================================================
  const savedWidth = localStorage.getItem('ab_studio_width_pct');
  if (savedWidth && window.innerWidth > 768) {
    panelEditor.style.width = `${savedWidth}%`;
  }

  workspaceResizer.addEventListener('mousedown', () => {
    isResizing = true;
    workspaceResizer.classList.add('active');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const containerRect = workspaceLayout.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;
    const minWidth = 260;
    const maxWidth = containerRect.width - 260;

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      const percentage = (newWidth / containerRect.width) * 100;
      panelEditor.style.width = `${percentage}%`;
      localStorage.setItem('ab_studio_width_pct', percentage.toFixed(2));
    }
  });

  window.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      workspaceResizer.classList.remove('active');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });

  // =========================================================================
  // THREE-DOTS MENU & STUDIO ACTIONS
  // =========================================================================
  menuToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = studioDropdown.classList.contains('active');
    studioDropdown.classList.toggle('active', !isActive);
    menuToggleBtn.setAttribute('aria-expanded', !isActive);
  });

  document.addEventListener('click', (e) => {
    if (!menuToggleBtn.contains(e.target) && !studioDropdown.contains(e.target)) {
      studioDropdown.classList.remove('active');
      menuToggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // 1. Full Screen Toggle
  function toggleFullScreen() {
    studioDropdown.classList.remove('active');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        showToast('Fullscreen request was blocked', 'error');
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  fullScreenToggleBtn.addEventListener('click', toggleFullScreen);

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      fullScreenIcon.className = 'fa-solid fa-compress';
      fullScreenText.textContent = 'Exit Full Screen';
    } else {
      fullScreenIcon.className = 'fa-solid fa-expand';
      fullScreenText.textContent = 'Full Screen';
    }
  });

  // 2. Clear Console
  clearConsoleBtn.addEventListener('click', () => {
    studioDropdown.classList.remove('active');
    terminalLogs.innerHTML = '';
    compilerStatusBadge.className = 'status-badge ready';
    compilerStatusBadge.textContent = 'Ready';
    executionTimeLabel.textContent = '0 ms';
    exitStatusLabel.textContent = 'Exit: 0';
    showToast('Console cleared', 'info');
  });

  // 3. Copy Output
  copyConsoleBtn.addEventListener('click', () => {
    studioDropdown.classList.remove('active');
    const text = terminalLogs.innerText.trim();
    if (!text) {
      showToast('No output to copy', 'info');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      showToast('Output copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy output', 'error');
    });
  });

  // 4. Download Source Code (.c)
  function downloadSource() {
    studioDropdown.classList.remove('active');
    const code = codeEditor.value;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileTitleDisplay.textContent || 'main.c';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded source code', 'success');
  }

  downloadSourceBtn.addEventListener('click', downloadSource);

  // 5. Share Button
  shareCodeBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeEditor.value).then(() => {
      showToast('Code copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy code', 'error');
    });
  });

  // =========================================================================
  // REAL-TIME INLINE STREAM INTERACTIVE COMPILER ENGINE (GCC C17)
  // =========================================================================

  /**
   * Parse prompt strings preceding scanf in source code
   */
  function extractPromptsAndInputs(source) {
    const steps = [];
    // Tokenize lines to associate printf prompts with scanf
    const lines = source.split('\n');
    let lastPrintf = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check printf
      const pMatch = line.match(/printf\s*\(\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
      if (pMatch) {
        // Decode escaped string
        lastPrintf = pMatch[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t');
      }

      // Check scanf or input functions
      if (/\b(scanf|getchar|gets|fgets|getline)\b/.test(line)) {
        steps.push({
          prompt: lastPrintf,
          lineIndex: i
        });
        lastPrintf = '';
      }
    }

    return steps;
  }

  /**
   * Inline interactive line creation right inside terminal
   */
  function promptInlineTerminal(promptText) {
    return new Promise((resolve) => {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'term-line';

      if (promptText) {
        const promptSpan = document.createElement('span');
        promptSpan.className = 'term-prompt-text';
        promptSpan.textContent = promptText;
        lineDiv.appendChild(promptSpan);
      }

      const inlineInput = document.createElement('input');
      inlineInput.type = 'text';
      inlineInput.className = 'term-inline-input';
      inlineInput.autocomplete = 'off';
      inlineInput.autocorrect = 'off';
      inlineInput.autocapitalize = 'off';
      inlineInput.spellcheck = false;

      lineDiv.appendChild(inlineInput);
      terminalLogs.appendChild(lineDiv);
      terminalLogs.scrollTop = terminalLogs.scrollHeight;

      setTimeout(() => {
        inlineInput.focus();
      }, 50);

      inlineInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = inlineInput.value;
          
          // Replace input with plain static span right after prompt
          const valSpan = document.createElement('span');
          valSpan.className = 'term-user-val';
          valSpan.textContent = val;
          inlineInput.replaceWith(valSpan);
          
          resolve({ val, promptText });
        }
      });
    });
  }

  async function runCode() {
    if (isExecuting) return;

    const source = codeEditor.value.trim();
    if (!source) {
      showToast('Please write some C code to compile', 'error');
      return;
    }

    // Set UI State to Running
    isExecuting = true;
    runCodeBtn.classList.add('is-running');
    runCodeBtn.disabled = true;
    mobileRunBtn.disabled = true;
    runIcon.className = 'fa-solid fa-spinner fa-spin';
    runBtnLabel.textContent = 'Running...';
    
    compilerStatusBadge.className = 'status-badge running';
    compilerStatusBadge.textContent = 'Running...';

    terminalLogs.innerHTML = '';

    // On mobile, switch smoothly to the Output view
    if (window.innerWidth <= 768) {
      setMobileView('output');
    }

    const startTime = performance.now();

    try {
      // Analyze if program has interactive input steps
      const inputSteps = extractPromptsAndInputs(source);
      let capturedStdin = '';
      const displayedPrompts = [];

      if (inputSteps.length > 0) {
        compilerStatusBadge.textContent = 'Waiting Input';

        for (const step of inputSteps) {
          const res = await promptInlineTerminal(step.prompt);
          capturedStdin += (capturedStdin ? '\n' : '') + res.val;
          if (res.promptText) {
            displayedPrompts.push(res.promptText);
          }
        }
      }

      compilerStatusBadge.textContent = 'Compiling...';

      // Call GCC Backend
      const result = await executeCCode(source, capturedStdin);
      const elapsedMs = Math.round(performance.now() - startTime);
      executionTimeLabel.textContent = `${elapsedMs} ms`;

      if (result.compilerError) {
        compilerStatusBadge.className = 'status-badge error';
        compilerStatusBadge.textContent = 'Error';
        exitStatusLabel.textContent = 'Exit: 1';
        appendLogEntry(result.compilerError, 'error-text');
      } else {
        compilerStatusBadge.className = 'status-badge ready';
        compilerStatusBadge.textContent = 'Success';
        exitStatusLabel.textContent = 'Exit: 0';

        let cleanStdout = result.stdout || '';

        // If prompts were already displayed interactively inline, clean initial duplicate prompt stream
        if (displayedPrompts.length > 0) {
          for (const p of displayedPrompts) {
            const cleanP = p.trim();
            if (cleanP && cleanStdout.includes(cleanP)) {
              // Remove the prompt portion that was already shown
              cleanStdout = cleanStdout.replace(cleanP, '').trimStart();
            }
          }
        }

        // Render clean output lines
        if (cleanStdout) {
          appendLogEntry(cleanStdout, 'welcome-text');
        }

        if (result.stderr) {
          appendLogEntry(result.stderr, 'error-text');
        }

        appendExecutionBanner(`=== Program Finished in ${elapsedMs}ms (GCC Exit Code 0) ===`);
        outputBadgeDot.classList.add('has-update');
      }

    } catch (err) {
      console.error('Execution failure:', err);
      compilerStatusBadge.className = 'status-badge error';
      compilerStatusBadge.textContent = 'Error';
      exitStatusLabel.textContent = 'Exit: 1';
      appendLogEntry(`Execution Error: ${err.message || String(err)}`, 'error-text');
    } finally {
      isExecuting = false;
      runCodeBtn.classList.remove('is-running');
      runCodeBtn.disabled = false;
      mobileRunBtn.disabled = false;
      runIcon.className = 'fa-solid fa-play';
      runBtnLabel.textContent = 'Run Code';
    }
  }

  // Execution Backend: Wandbox GCC Primary with Piston GCC Fallback
  async function executeCCode(source, stdin) {
    // Attempt 1: Wandbox GCC API
    try {
      const wandboxResponse = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: source,
          compiler: 'gcc-head',
          stdin: stdin || '',
          options: '-O2 -std=c17'
        })
      });

      if (wandboxResponse.ok) {
        const data = await wandboxResponse.json();
        const status = parseInt(data.status || '0', 10);
        const compilerError = data.compiler_error || data.compiler_message || '';
        const stdout = data.program_output || '';
        const stderr = data.program_error || '';

        if (compilerError && status !== 0 && !stdout) {
          return { compilerError, stdout: '', stderr: '' };
        }

        return { compilerError: '', stdout, stderr };
      }
    } catch (wandboxErr) {
      console.warn('Wandbox unavailable, falling back to Piston API...', wandboxErr);
    }

    // Attempt 2: Piston API Fallback
    try {
      const pistonResponse = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'c',
          version: '10.2.0',
          files: [{ name: 'main.c', content: source }],
          stdin: stdin || ''
        })
      });

      if (pistonResponse.ok) {
        const data = await pistonResponse.json();
        const run = data.run || {};
        const compile = data.compile || {};

        if (compile.stderr && compile.code !== 0) {
          return { compilerError: compile.stderr, stdout: '', stderr: '' };
        }

        return {
          compilerError: '',
          stdout: run.stdout || '',
          stderr: run.stderr || ''
        };
      }
    } catch (pistonErr) {
      console.error('Piston execution failed:', pistonErr);
    }

    throw new Error('Compilation servers currently unreachable. Please check network connection.');
  }

  function appendLogEntry(text, className = '') {
    const div = document.createElement('div');
    div.className = `log-entry ${className}`.trim();
    div.textContent = text;
    terminalLogs.appendChild(div);
    terminalLogs.scrollTop = terminalLogs.scrollHeight;
  }

  function appendExecutionBanner(text) {
    const div = document.createElement('div');
    div.className = 'execution-banner';
    div.textContent = text;
    terminalLogs.appendChild(div);
    terminalLogs.scrollTop = terminalLogs.scrollHeight;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // DEVELOPER CONTACTS & SOCIALS MODAL
  // =========================================================================
  const userChip = document.getElementById('userChip');
  const contactDevBtn = document.getElementById('contactDevBtn');
  const footerContactBtn = document.getElementById('footerContactBtn');
  const contactModal = document.getElementById('contactModal');
  const closeContactModalBtn = document.getElementById('closeContactModalBtn');
  const copyEmailBtn = document.getElementById('copyEmailBtn');

  function openContactModal() {
    if (studioDropdown) studioDropdown.classList.remove('active');
    contactModal.classList.add('active');
  }

  function closeContactModal() {
    contactModal.classList.remove('active');
  }

  if (userChip) userChip.addEventListener('click', openContactModal);
  if (contactDevBtn) contactDevBtn.addEventListener('click', openContactModal);
  if (footerContactBtn) footerContactBtn.addEventListener('click', openContactModal);
  if (closeContactModalBtn) closeContactModalBtn.addEventListener('click', closeContactModal);

  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      closeContactModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal.classList.contains('active')) {
      closeContactModal();
    }
  });

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const email = 'bakodiyaadi@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email (bakodiyaadi@gmail.com) copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Failed to copy email', 'error');
      });
    });
  }

  // Bind Run Buttons
  runCodeBtn.addEventListener('click', runCode);
  mobileRunBtn.addEventListener('click', runCode);

  // Initialize
  updateEditorStats();
});

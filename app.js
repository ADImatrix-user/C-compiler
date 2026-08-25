/**
 * ============================================================================
 * AB C STUDIO (v2.5) | CORE JAVASCRIPT ENGINE
 * ============================================================================
 * Features:
 *  - Single Slim Header with View Switcher & Quick Run
 *  - "Line-Line" Main Menu Drawer (Compiler Name, Browse, Edit, Personalization, Contact)
 *  - High-performance C Editor with tab indent & bracket auto-close
 *  - 10 Pro Color Themes (5 Dark, 5 Light) with Category Filters
 *  - In-Editor Find & Replace Bar (Ctrl+F)
 *  - Consolidated Developer Contact Modal
 *  - Dual-Engine C17 Execution (Wandbox GCC 13.2 / Piston GCC 10.2)
 *  - Real-Time Interactive Terminal Input System for scanf() & gets()
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. CONSTANTS & THEME REGISTRY
     ========================================================================== */
  const DEFAULT_STARTER_CODE = `#include <stdio.h>

int main() {
    int a, b, sum;
    
    printf("Enter first number: ");
    scanf("%d", &a);
    
    printf("Enter second number: ");
    scanf("%d", &b);
    
    sum = a + b;
    printf("Sum = %d\\n", sum);
    
    return 0;
}
`;

  const THEMES_CATALOG = [
    {
      id: 'cyber-night',
      name: 'Cyber Night',
      category: 'dark',
      description: 'Default deep navy neon studio theme',
      colors: ['#090a10', '#12141f', '#3b82f6', '#38bdf8']
    },
    {
      id: 'dracula-midnight',
      name: 'Dracula Midnight',
      category: 'dark',
      description: 'Classic gothic purple with vibrant accents',
      colors: ['#181920', '#282a36', '#bd93f9', '#50fa7b']
    },
    {
      id: 'monokai-pro',
      name: 'Monokai Pro',
      category: 'dark',
      description: 'Warm charcoal with radiant gold & rose',
      colors: ['#19181a', '#2d2a2e', '#ffd866', '#ff6188']
    },
    {
      id: 'nordic-frost',
      name: 'Nordic Frost',
      category: 'dark',
      description: 'Arctic twilight blues and cool slate',
      colors: ['#1e222a', '#2e3440', '#88c0d0', '#a3be8c']
    },
    {
      id: 'emerald-matrix',
      name: 'Emerald Matrix',
      category: 'dark',
      description: 'Hacker aesthetic deep green phosphor',
      colors: ['#080d0a', '#121e17', '#10b981', '#00ff9d']
    },
    {
      id: 'clean-slate',
      name: 'Clean Slate',
      category: 'light',
      description: 'Crisp, high-contrast modern light blue',
      colors: ['#eef2f6', '#ffffff', '#2563eb', '#059669']
    },
    {
      id: 'solarized-light',
      name: 'Solarized Light',
      category: 'light',
      description: 'Warm parchment with balanced earth tones',
      colors: ['#ede4cd', '#fdf6e3', '#268bd2', '#2aa198']
    },
    {
      id: 'github-light',
      name: 'GitHub Light',
      category: 'light',
      description: 'Official clean developer documentation style',
      colors: ['#ebeef2', '#ffffff', '#0969da', '#1a7f37']
    },
    {
      id: 'rose-dawn',
      name: 'Rosé Dawn',
      category: 'light',
      description: 'Soft pastel warmth with vintage rose tints',
      colors: ['#f2e9de', '#fffaf3', '#d7827e', '#ea9d34']
    },
    {
      id: 'nordic-snow',
      name: 'Nordic Snow',
      category: 'light',
      description: 'Glacial daylight with cool muted blue-greys',
      colors: ['#d8dee9', '#ffffff', '#5e81ac', '#81a1c1']
    }
  ];

  /* ==========================================================================
     2. DOM ELEMENT REFERENCES
     ========================================================================== */
  const codeEditor = document.getElementById('codeEditor');
  const lineNumbers = document.getElementById('lineNumbers');
  const lineCountLabel = document.getElementById('lineCountLabel');
  const charCountLabel = document.getElementById('charCountLabel');
  const fileTitleDisplay = document.getElementById('fileTitleDisplay');
  const fileUploadInput = document.getElementById('fileUploadInput');
  const editorDropZone = document.getElementById('editorDropZone');

  // Top Navbar Elements
  const menuDrawerOpenBtn = document.getElementById('menuDrawerOpenBtn');
  const runCodeBtn = document.getElementById('runCodeBtn');
  const runIcon = document.getElementById('runIcon');
  const runBtnLabel = document.getElementById('runBtnLabel');
  const tabViewCode = document.getElementById('tabViewCode');
  const tabViewOutput = document.getElementById('tabViewOutput');
  const outputBadgeDot = document.getElementById('outputBadgeDot');

  // Main Menu Drawer
  const mainMenuDrawer = document.getElementById('mainMenuDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const menuDrawerCloseBtn = document.getElementById('menuDrawerCloseBtn');

  // Drawer - Browse Actions
  const openNewProgramBtn = document.getElementById('openNewProgramBtn');
  const browseOpenFileBtn = document.getElementById('browseOpenFileBtn');
  const saveProgramBtn = document.getElementById('saveProgramBtn');
  const saveAsProgramBtn = document.getElementById('saveAsProgramBtn');
  const shareProgramBtn = document.getElementById('shareProgramBtn');

  // Drawer - Edit Actions
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  const cutBtn = document.getElementById('cutBtn');
  const copyBtn = document.getElementById('copyBtn');
  const pasteBtn = document.getElementById('pasteBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  const selectAllBtn = document.getElementById('selectAllBtn');
  const findReplaceBtn = document.getElementById('findReplaceBtn');
  const showShortcutsBtn = document.getElementById('showShortcutsBtn');

  // Drawer - Personalization Controls
  const openThemesModalBtn = document.getElementById('openThemesModalBtn');
  const currentThemeBadge = document.getElementById('currentThemeBadge');
  const fontSizeSelector = document.getElementById('fontSizeSelector');
  const tabSizeSelector = document.getElementById('tabSizeSelector');
  const toggleLineNumbersCheckbox = document.getElementById('toggleLineNumbersCheckbox');

  // Drawer - My Contact
  const myContactBtn = document.getElementById('myContactBtn');

  // Find & Replace Panel
  const findReplacePanel = document.getElementById('findReplacePanel');
  const findInput = document.getElementById('findInput');
  const replaceInput = document.getElementById('replaceInput');
  const findMatchCount = document.getElementById('findMatchCount');
  const findPrevBtn = document.getElementById('findPrevBtn');
  const findNextBtn = document.getElementById('findNextBtn');
  const closeFindBtn = document.getElementById('closeFindBtn');
  const replaceOneBtn = document.getElementById('replaceOneBtn');
  const replaceAllBtn = document.getElementById('replaceAllBtn');

  // Output & Terminal
  const terminalLogs = document.getElementById('terminalLogs');
  const compilerStatusBadge = document.getElementById('compilerStatusBadge');
  const executionTimeLabel = document.getElementById('executionTimeLabel');
  const exitStatusLabel = document.getElementById('exitStatusLabel');
  const clearConsoleBtn = document.getElementById('clearConsoleBtn');
  const copyConsoleBtn = document.getElementById('copyConsoleBtn');
  const fullScreenToggleBtn = document.getElementById('fullScreenToggleBtn');
  const fullScreenIcon = document.getElementById('fullScreenIcon');

  // Workspace Layout & Resizer
  const workspaceLayout = document.getElementById('workspaceLayout');
  const panelEditor = document.getElementById('panelEditor');
  const workspaceResizer = document.getElementById('workspaceResizer');

  // Modals
  const themeModal = document.getElementById('themeModal');
  const closeThemeModalBtn = document.getElementById('closeThemeModalBtn');
  const themesGrid = document.getElementById('themesGrid');

  const saveAsModal = document.getElementById('saveAsModal');
  const closeSaveAsModalBtn = document.getElementById('closeSaveAsModalBtn');
  const cancelSaveAsBtn = document.getElementById('cancelSaveAsBtn');
  const confirmSaveAsBtn = document.getElementById('confirmSaveAsBtn');
  const saveAsFileNameInput = document.getElementById('saveAsFileNameInput');

  const shortcutsModal = document.getElementById('shortcutsModal');
  const closeShortcutsModalBtn = document.getElementById('closeShortcutsModalBtn');

  const contactModal = document.getElementById('contactModal');
  const closeContactModalBtn = document.getElementById('closeContactModalBtn');
  const copyEmailBtn = document.getElementById('copyEmailBtn');

  const toastContainer = document.getElementById('toastContainer');

  /* ==========================================================================
     3. STATE MANAGEMENT
     ========================================================================== */
  let isExecuting = false;
  let activeTheme = localStorage.getItem('ab_c_theme') || 'cyber-night';
  let activeFontSize = parseInt(localStorage.getItem('ab_c_fontsize') || '14', 10);
  let activeTabSize = parseInt(localStorage.getItem('ab_c_tabsize') || '4', 10);
  let showLineNumbers = localStorage.getItem('ab_c_linenumbers') !== 'false';
  let currentFileName = 'main.c';

  // Undo / Redo history
  const undoStack = [];
  const redoStack = [];
  const MAX_HISTORY = 40;
  let isUndoRedoAction = false;

  // Find & Replace State
  let findMatches = [];
  let currentMatchIndex = -1;

  /* ==========================================================================
     4. INITIALIZATION
     ========================================================================== */
  function initializeStudio() {
    // 1. Restore code or load starter
    const savedCode = localStorage.getItem('ab_c_source');
    codeEditor.value = savedCode !== null ? savedCode : DEFAULT_STARTER_CODE;
    pushToUndoStack(codeEditor.value);

    // 2. Apply theme
    applyTheme(activeTheme);
    renderThemesGrid('all');

    // 3. Apply personalization settings
    applyFontSize(activeFontSize);
    applyTabSize(activeTabSize);
    applyLineNumbers(showLineNumbers);

    // 4. Initial stats
    updateLineNumbers();
    updateEditorStats();

    // 5. Initial terminal welcome message
    renderWelcomeTerminal();

    // 6. Mobile view initialization
    if (window.innerWidth <= 768) {
      setMobileView('editor');
    }
  }

  /* ==========================================================================
     5. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  function showToast(message, type = 'info', duration = 3000) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';

    toast.innerHTML = `
      <i class="${iconClass}"></i>
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ==========================================================================
     6. "LINE LINE" MAIN MENU DRAWER CONTROLS & ACCORDIONS
     ========================================================================== */
  function openDrawer() {
    if (mainMenuDrawer) mainMenuDrawer.classList.add('active');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
  }

  function closeDrawer() {
    if (mainMenuDrawer) mainMenuDrawer.classList.remove('active');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
  }

  if (menuDrawerOpenBtn) {
    menuDrawerOpenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer();
    });
  }

  if (menuDrawerCloseBtn) {
    menuDrawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  // Accordion Expand / Collapse Handlers
  document.querySelectorAll('.drawer-accordion-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('data-target');
      const content = document.getElementById(targetId);
      if (!content) return;

      const isOpen = content.classList.contains('open');

      // Optional: Close other accordions for clean single-expand behavior
      // Or toggle current
      if (isOpen) {
        content.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        content.classList.add('open');
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ==========================================================================
     7. THEME ENGINE & MODAL
     ========================================================================== */
  function applyTheme(themeId) {
    const foundTheme = THEMES_CATALOG.find(t => t.id === themeId);
    if (!foundTheme) themeId = 'cyber-night';

    document.documentElement.setAttribute('data-theme', themeId);
    activeTheme = themeId;
    localStorage.setItem('ab_c_theme', themeId);

    const themeName = (foundTheme || THEMES_CATALOG[0]).name;
    if (currentThemeBadge) currentThemeBadge.textContent = themeName;

    // Highlight active card
    document.querySelectorAll('.theme-card').forEach(card => {
      if (card.getAttribute('data-theme-id') === themeId) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  function renderThemesGrid(categoryFilter = 'all') {
    if (!themesGrid) return;
    themesGrid.innerHTML = '';

    const filtered = THEMES_CATALOG.filter(t => {
      if (categoryFilter === 'all') return true;
      return t.category === categoryFilter;
    });

    filtered.forEach(theme => {
      const card = document.createElement('div');
      card.className = `theme-card ${theme.id === activeTheme ? 'active' : ''}`;
      card.setAttribute('data-theme-id', theme.id);

      const swatchesHtml = theme.colors
        .map(color => `<span class="swatch-dot" style="background-color: ${color};"></span>`)
        .join('');

      card.innerHTML = `
        <div class="theme-card-top">
          <div class="theme-card-info">
            <h4>${escapeHtml(theme.name)}</h4>
            <p>${escapeHtml(theme.description)}</p>
          </div>
          <span class="theme-type-tag ${theme.category}">${theme.category}</span>
        </div>
        <div class="theme-palette-swatches">
          ${swatchesHtml}
        </div>
        <div class="theme-active-indicator">
          <i class="fa-solid fa-check"></i>
        </div>
      `;

      card.addEventListener('click', () => {
        applyTheme(theme.id);
        showToast(`Theme changed to ${theme.name}`, 'success');
      });

      themesGrid.appendChild(card);
    });
  }

  // Category filter tabs
  document.querySelectorAll('.category-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderThemesGrid(btn.getAttribute('data-category'));
    });
  });

  /* ==========================================================================
     8. PERSONALIZATION CONTROLS
     ========================================================================== */
  function applyFontSize(size) {
    activeFontSize = size;
    document.documentElement.style.setProperty('--editor-font-size', `${size}px`);
    localStorage.setItem('ab_c_fontsize', size);

    if (fontSizeSelector) {
      fontSizeSelector.querySelectorAll('.drawer-pill').forEach(btn => {
        if (parseInt(btn.getAttribute('data-size'), 10) === size) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  function applyTabSize(size) {
    activeTabSize = size;
    document.documentElement.style.setProperty('--editor-tab-size', size);
    if (codeEditor) codeEditor.style.tabSize = size;
    localStorage.setItem('ab_c_tabsize', size);

    if (tabSizeSelector) {
      tabSizeSelector.querySelectorAll('.drawer-pill').forEach(btn => {
        if (parseInt(btn.getAttribute('data-tab'), 10) === size) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  function applyLineNumbers(show) {
    showLineNumbers = show;
    if (lineNumbers) {
      if (show) {
        lineNumbers.classList.remove('hidden');
      } else {
        lineNumbers.classList.add('hidden');
      }
    }
    if (toggleLineNumbersCheckbox) toggleLineNumbersCheckbox.checked = show;
    localStorage.setItem('ab_c_linenumbers', show);
  }

  // Font size pills
  if (fontSizeSelector) {
    fontSizeSelector.querySelectorAll('.drawer-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        applyFontSize(parseInt(btn.getAttribute('data-size'), 10));
      });
    });
  }

  // Tab size pills
  if (tabSizeSelector) {
    tabSizeSelector.querySelectorAll('.drawer-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        applyTabSize(parseInt(btn.getAttribute('data-tab'), 10));
      });
    });
  }

  // Line numbers checkbox toggle
  if (toggleLineNumbersCheckbox) {
    toggleLineNumbersCheckbox.addEventListener('change', (e) => {
      applyLineNumbers(e.target.checked);
    });
  }

  /* ==========================================================================
     9. MODAL CONTROLS
     ========================================================================== */
  function openModal(modal) {
    if (!modal) return;
    closeDrawer();
    modal.classList.add('active');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
  }

  // Theme modal
  if (openThemesModalBtn) {
    openThemesModalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(themeModal);
    });
  }
  if (closeThemeModalBtn) {
    closeThemeModalBtn.addEventListener('click', () => closeModal(themeModal));
  }

  // Save As modal
  if (saveAsProgramBtn) {
    saveAsProgramBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (saveAsFileNameInput) saveAsFileNameInput.value = currentFileName;
      openModal(saveAsModal);
      if (saveAsFileNameInput) {
        setTimeout(() => {
          saveAsFileNameInput.focus();
          saveAsFileNameInput.select();
        }, 100);
      }
    });
  }
  if (closeSaveAsModalBtn) closeSaveAsModalBtn.addEventListener('click', () => closeModal(saveAsModal));
  if (cancelSaveAsBtn) cancelSaveAsBtn.addEventListener('click', () => closeModal(saveAsModal));
  if (confirmSaveAsBtn) {
    confirmSaveAsBtn.addEventListener('click', () => {
      let fileName = (saveAsFileNameInput ? saveAsFileNameInput.value.trim() : '') || 'program.c';
      if (!fileName.endsWith('.c') && !fileName.endsWith('.h')) fileName += '.c';
      downloadFile(fileName, codeEditor.value);
      currentFileName = fileName;
      if (fileTitleDisplay) fileTitleDisplay.textContent = fileName;
      closeModal(saveAsModal);
      showToast(`Saved and downloaded "${fileName}"`, 'success');
    });
  }

  // Shortcuts modal
  if (showShortcutsBtn) {
    showShortcutsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(shortcutsModal);
    });
  }
  if (closeShortcutsModalBtn) closeShortcutsModalBtn.addEventListener('click', () => closeModal(shortcutsModal));

  // Single My Contact modal
  if (myContactBtn) {
    myContactBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(contactModal);
    });
  }
  if (closeContactModalBtn) closeContactModalBtn.addEventListener('click', () => closeModal(contactModal));

  // Copy email in contact modal
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigator.clipboard.writeText('bakodiyaadi@gmail.com').then(() => {
        showToast('Email address copied to clipboard!', 'success');
      });
    });
  }

  // Close modals on backdrop click
  [themeModal, saveAsModal, shortcutsModal, contactModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    }
  });

  // Global Escape key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal(themeModal);
      closeModal(saveAsModal);
      closeModal(shortcutsModal);
      closeModal(contactModal);
      hideFindReplace();
    }
  });

  /* ==========================================================================
     10. DRAWER BROWSE ACTIONS
     ========================================================================== */
  // 1. Open New Program
  if (openNewProgramBtn) {
    openNewProgramBtn.addEventListener('click', () => {
      closeDrawer();
      codeEditor.value = DEFAULT_STARTER_CODE;
      currentFileName = 'main.c';
      if (fileTitleDisplay) fileTitleDisplay.textContent = 'main.c';
      pushToUndoStack(codeEditor.value);
      updateLineNumbers();
      updateEditorStats();
      saveSourceCode();
      showToast('Created new starter C program', 'info');
    });
  }

  // 2. Open File...
  if (browseOpenFileBtn) {
    browseOpenFileBtn.addEventListener('click', () => {
      closeDrawer();
      if (fileUploadInput) fileUploadInput.click();
    });
  }

  if (fileUploadInput) {
    fileUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      readFileContent(file);
      fileUploadInput.value = '';
    });
  }

  function readFileContent(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      codeEditor.value = event.target.result;
      currentFileName = file.name;
      if (fileTitleDisplay) fileTitleDisplay.textContent = file.name;
      pushToUndoStack(codeEditor.value);
      updateLineNumbers();
      updateEditorStats();
      saveSourceCode();
      showToast(`Loaded "${file.name}"`, 'success');
    };
    reader.readAsText(file);
  }

  // 3. Save (Ctrl+S)
  if (saveProgramBtn) {
    saveProgramBtn.addEventListener('click', () => {
      closeDrawer();
      saveSourceCode();
      showToast('Code saved successfully!', 'success');
    });
  }

  function saveSourceCode() {
    localStorage.setItem('ab_c_source', codeEditor.value);
  }

  // 4. Share Code
  if (shareProgramBtn) {
    shareProgramBtn.addEventListener('click', () => {
      closeDrawer();
      navigator.clipboard.writeText(codeEditor.value).then(() => {
        showToast('Source code copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Unable to copy code to clipboard', 'error');
      });
    });
  }

  function downloadFile(filename, text) {
    const blob = new Blob([text], { type: 'text/x-c;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  /* ==========================================================================
     11. DRAWER EDIT ACTIONS
     ========================================================================== */
  function pushToUndoStack(val) {
    if (isUndoRedoAction) return;
    if (undoStack.length === 0 || undoStack[undoStack.length - 1] !== val) {
      undoStack.push(val);
      if (undoStack.length > MAX_HISTORY) undoStack.shift();
      redoStack.length = 0; // Clear redo
    }
  }

  function performUndo() {
    if (undoStack.length > 1) {
      isUndoRedoAction = true;
      const current = undoStack.pop();
      redoStack.push(current);
      const prev = undoStack[undoStack.length - 1];
      codeEditor.value = prev;
      updateLineNumbers();
      updateEditorStats();
      saveSourceCode();
      isUndoRedoAction = false;
    }
  }

  function performRedo() {
    if (redoStack.length > 0) {
      isUndoRedoAction = true;
      const next = redoStack.pop();
      undoStack.push(next);
      codeEditor.value = next;
      updateLineNumbers();
      updateEditorStats();
      saveSourceCode();
      isUndoRedoAction = false;
    }
  }

  if (undoBtn) undoBtn.addEventListener('click', () => { closeDrawer(); performUndo(); });
  if (redoBtn) redoBtn.addEventListener('click', () => { closeDrawer(); performRedo(); });

  if (cutBtn) {
    cutBtn.addEventListener('click', () => {
      closeDrawer();
      codeEditor.focus();
      const selStart = codeEditor.selectionStart;
      const selEnd = codeEditor.selectionEnd;
      if (selStart !== selEnd) {
        const text = codeEditor.value.substring(selStart, selEnd);
        navigator.clipboard.writeText(text).then(() => {
          codeEditor.setRangeText('', selStart, selEnd, 'end');
          pushToUndoStack(codeEditor.value);
          updateLineNumbers();
          updateEditorStats();
          saveSourceCode();
        });
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      closeDrawer();
      codeEditor.focus();
      const selStart = codeEditor.selectionStart;
      const selEnd = codeEditor.selectionEnd;
      const text = selStart !== selEnd ? codeEditor.value.substring(selStart, selEnd) : codeEditor.value;
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'info');
      });
    });
  }

  if (pasteBtn) {
    pasteBtn.addEventListener('click', () => {
      closeDrawer();
      codeEditor.focus();
      navigator.clipboard.readText().then(text => {
        if (!text) return;
        const selStart = codeEditor.selectionStart;
        const selEnd = codeEditor.selectionEnd;
        codeEditor.setRangeText(text, selStart, selEnd, 'end');
        pushToUndoStack(codeEditor.value);
        updateLineNumbers();
        updateEditorStats();
        saveSourceCode();
      }).catch(() => {
        showToast('Use Ctrl+V to paste directly into editor', 'info');
      });
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      closeDrawer();
      codeEditor.focus();
      const selStart = codeEditor.selectionStart;
      const selEnd = codeEditor.selectionEnd;
      if (selStart !== selEnd) {
        codeEditor.setRangeText('', selStart, selEnd, 'end');
      } else if (selStart < codeEditor.value.length) {
        codeEditor.setRangeText('', selStart, selStart + 1, 'end');
      }
      pushToUndoStack(codeEditor.value);
      updateLineNumbers();
      updateEditorStats();
      saveSourceCode();
    });
  }

  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', () => {
      closeDrawer();
      codeEditor.focus();
      codeEditor.select();
    });
  }

  /* ==========================================================================
     12. IN-EDITOR FIND & REPLACE
     ========================================================================== */
  function showFindReplace() {
    closeDrawer();
    if (findReplacePanel) {
      findReplacePanel.classList.add('active');
      if (findInput) {
        const selected = codeEditor.value.substring(codeEditor.selectionStart, codeEditor.selectionEnd);
        if (selected && !selected.includes('\n')) {
          findInput.value = selected;
        }
        findInput.focus();
        findInput.select();
        performFind();
      }
    }
  }

  function hideFindReplace() {
    if (findReplacePanel) findReplacePanel.classList.remove('active');
    findMatches = [];
    currentMatchIndex = -1;
    codeEditor.focus();
  }

  function performFind() {
    if (!findInput) return;
    const query = findInput.value;
    findMatches = [];
    currentMatchIndex = -1;

    if (!query) {
      if (findMatchCount) findMatchCount.textContent = '0/0';
      return;
    }

    const text = codeEditor.value;
    let pos = 0;
    while ((pos = text.indexOf(query, pos)) !== -1) {
      findMatches.push(pos);
      pos += query.length;
    }

    if (findMatches.length > 0) {
      const cursor = codeEditor.selectionStart;
      const nextIdx = findMatches.findIndex(m => m >= cursor);
      currentMatchIndex = nextIdx !== -1 ? nextIdx : 0;
      highlightCurrentMatch();
    }

    if (findMatchCount) {
      findMatchCount.textContent = findMatches.length > 0 ? `${currentMatchIndex + 1}/${findMatches.length}` : '0/0';
    }
  }

  function highlightCurrentMatch() {
    if (currentMatchIndex < 0 || currentMatchIndex >= findMatches.length) return;
    const matchPos = findMatches[currentMatchIndex];
    const queryLen = findInput.value.length;
    codeEditor.focus();
    codeEditor.setSelectionRange(matchPos, matchPos + queryLen);

    if (findMatchCount) {
      findMatchCount.textContent = `${currentMatchIndex + 1}/${findMatches.length}`;
    }
  }

  function findNext() {
    if (findMatches.length === 0) {
      performFind();
      return;
    }
    currentMatchIndex = (currentMatchIndex + 1) % findMatches.length;
    highlightCurrentMatch();
  }

  function findPrev() {
    if (findMatches.length === 0) {
      performFind();
      return;
    }
    currentMatchIndex = (currentMatchIndex - 1 + findMatches.length) % findMatches.length;
    highlightCurrentMatch();
  }

  function replaceOne() {
    if (!findInput || !replaceInput || findMatches.length === 0 || currentMatchIndex === -1) return;
    const matchPos = findMatches[currentMatchIndex];
    const queryLen = findInput.value.length;
    const repText = replaceInput.value;

    codeEditor.setRangeText(repText, matchPos, matchPos + queryLen, 'end');
    pushToUndoStack(codeEditor.value);
    updateLineNumbers();
    updateEditorStats();
    saveSourceCode();
    performFind();
  }

  function replaceAll() {
    if (!findInput || !replaceInput || !findInput.value) return;
    const query = findInput.value;
    const repText = replaceInput.value;
    const count = (codeEditor.value.split(query).length - 1);
    if (count === 0) return;

    codeEditor.value = codeEditor.value.split(query).join(repText);
    pushToUndoStack(codeEditor.value);
    updateLineNumbers();
    updateEditorStats();
    saveSourceCode();
    performFind();
    showToast(`Replaced ${count} occurrence${count > 1 ? 's' : ''}`, 'success');
  }

  if (findReplaceBtn) findReplaceBtn.addEventListener('click', showFindReplace);
  if (closeFindBtn) closeFindBtn.addEventListener('click', hideFindReplace);
  if (findInput) findInput.addEventListener('input', performFind);
  if (findNextBtn) findNextBtn.addEventListener('click', findNext);
  if (findPrevBtn) findPrevBtn.addEventListener('click', findPrev);
  if (replaceOneBtn) replaceOneBtn.addEventListener('click', replaceOne);
  if (replaceAllBtn) replaceAllBtn.addEventListener('click', replaceAll);

  if (findInput) {
    findInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) findPrev();
        else findNext();
      }
    });
  }

  /* ==========================================================================
     13. CODE EDITOR LOGIC & KEYBOARD HANDLERS
     ========================================================================== */
  function updateLineNumbers() {
    if (!lineNumbers) return;
    const lines = codeEditor.value.split('\n').length;
    lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  }

  function updateEditorStats() {
    const val = codeEditor.value;
    const lines = val.split('\n').length;
    const chars = val.length;
    if (lineCountLabel) lineCountLabel.textContent = lines;
    if (charCountLabel) charCountLabel.textContent = chars;
  }

  codeEditor.addEventListener('input', () => {
    updateLineNumbers();
    updateEditorStats();
    saveSourceCode();
    pushToUndoStack(codeEditor.value);
  });

  // Sync scrolling between line numbers and editor
  codeEditor.addEventListener('scroll', () => {
    if (lineNumbers) lineNumbers.scrollTop = codeEditor.scrollTop;
  });

  // Keyboard accelerators
  codeEditor.addEventListener('keydown', (e) => {
    // 1. Run (Ctrl+Enter)
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      executeCCode();
      return;
    }

    // 2. Save (Ctrl+S)
    if (e.ctrlKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveSourceCode();
      showToast('Code saved successfully!', 'success');
      return;
    }

    // 3. Find (Ctrl+F)
    if (e.ctrlKey && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      showFindReplace();
      return;
    }

    // 4. Undo (Ctrl+Z) & Redo (Ctrl+Y)
    if (e.ctrlKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      performUndo();
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      performRedo();
      return;
    }

    // 5. Tab key indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const tabSpaces = ' '.repeat(activeTabSize);
      const start = codeEditor.selectionStart;
      const end = codeEditor.selectionEnd;

      if (!e.shiftKey) {
        if (start === end) {
          codeEditor.setRangeText(tabSpaces, start, end, 'end');
        } else {
          const lines = codeEditor.value.substring(start, end).split('\n');
          const indented = lines.map(l => tabSpaces + l).join('\n');
          codeEditor.setRangeText(indented, start, end, 'select');
        }
      } else {
        const lines = codeEditor.value.substring(start, end).split('\n');
        const unindented = lines.map(l => l.startsWith(tabSpaces) ? l.slice(activeTabSize) : l).join('\n');
        codeEditor.setRangeText(unindented, start, end, 'select');
      }
      pushToUndoStack(codeEditor.value);
      updateLineNumbers();
      updateEditorStats();
      saveSourceCode();
      return;
    }

    // 6. Auto-close brackets and quotes
    const PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };
    if (PAIRS[e.key]) {
      const start = codeEditor.selectionStart;
      const end = codeEditor.selectionEnd;
      if (start !== end) {
        e.preventDefault();
        const selected = codeEditor.value.substring(start, end);
        const wrapped = e.key + selected + PAIRS[e.key];
        codeEditor.setRangeText(wrapped, start, end, 'select');
        pushToUndoStack(codeEditor.value);
        return;
      }
    }
  });

  /* ==========================================================================
     14. DRAG & DROP FILE LOADING
     ========================================================================== */
  if (editorDropZone) {
    ['dragenter', 'dragover'].forEach(name => {
      editorDropZone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        editorDropZone.classList.add('drag-active');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      editorDropZone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        editorDropZone.classList.remove('drag-active');
      });
    });

    editorDropZone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        readFileContent(files[0]);
      }
    });
  }

  /* ==========================================================================
     15. TERMINAL & INTERACTIVE INPUT ENGINE
     ========================================================================== */
  function renderWelcomeTerminal() {
    if (!terminalLogs) return;
    terminalLogs.innerHTML = `
      <div class="log-entry welcome-text">
        <span style="color: var(--brand-primary); font-weight: 700;">★ AB C Studio v2.5 Online IDE</span>
        <br>
        <span style="color: var(--text-secondary);">GCC 13.2 (C17 Standard) • Real-time interactive scanf() execution engine.</span>
        <br>
        <span style="color: var(--text-muted); font-size: 0.8rem;">Click [Run] in the top bar or press Ctrl + Enter to compile.</span>
      </div>
    `;
    setCompilerStatus('ready');
  }

  function setCompilerStatus(status) {
    if (!compilerStatusBadge) return;
    compilerStatusBadge.className = `status-badge ${status}`;
    compilerStatusBadge.textContent = status.toUpperCase();
  }

  function setExecutionStats(timeMs, exitCode = 0) {
    if (executionTimeLabel) executionTimeLabel.textContent = `${timeMs} ms`;
    if (exitStatusLabel) exitStatusLabel.textContent = `Exit: ${exitCode}`;
  }

  /* Extract interactive scanf prompts from C code */
  function extractPromptsAndInputs(source) {
    const prompts = [];
    const cleanLines = source.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').split('\n');

    let pendingPrompt = '';
    cleanLines.forEach(line => {
      const pMatch = line.match(/printf\s*\(\s*"([^"]*)"/);
      if (pMatch) {
        pendingPrompt += pMatch[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t');
      }

      const sMatch = line.match(/scanf\s*\(\s*"([^"]*)"/);
      if (sMatch) {
        const specifiers = (sMatch[1].match(/%[0-9]*[a-zA-Z]/g) || []).length;
        const count = Math.max(1, specifiers);
        prompts.push({
          promptText: pendingPrompt || 'Enter input: ',
          count: count
        });
        pendingPrompt = '';
      }
    });

    return prompts;
  }

  /* Execute C Code with Interactive Prompt Step-Through */
  async function executeCCode() {
    if (isExecuting) return;

    const source = codeEditor.value.trim();
    if (!source) {
      showToast('Please write some C code before running!', 'error');
      return;
    }

    isExecuting = true;
    setCompilerStatus('running');
    if (runCodeBtn) runCodeBtn.classList.add('is-running');
    if (runIcon) runIcon.className = 'fa-solid fa-spinner fa-spin';
    if (runBtnLabel) runBtnLabel.textContent = 'Compiling...';

    // Switch to output tab on mobile
    if (window.innerWidth <= 768) {
      setMobileView('output');
    }

    terminalLogs.innerHTML = '';
    const startTime = performance.now();

    // Check if code requires interactive input
    const interactivePrompts = extractPromptsAndInputs(source);

    if (interactivePrompts.length > 0) {
      const collectedInputs = [];

      for (let i = 0; i < interactivePrompts.length; i++) {
        const promptInfo = interactivePrompts[i];
        const val = await promptUserTerminal(promptInfo.promptText);
        collectedInputs.push(val);
      }

      const stdinPayload = collectedInputs.join('\n');
      await dispatchCompilerRequest(source, stdinPayload, startTime, interactivePrompts);
    } else {
      await dispatchCompilerRequest(source, '', startTime, []);
    }

    isExecuting = false;
    if (runCodeBtn) runCodeBtn.classList.remove('is-running');
    if (runIcon) runIcon.className = 'fa-solid fa-play';
    if (runBtnLabel) runBtnLabel.textContent = 'Run';
  }

  function promptUserTerminal(promptText) {
    return new Promise(resolve => {
      const lineWrap = document.createElement('div');
      lineWrap.className = 'term-line';

      const promptSpan = document.createElement('span');
      promptSpan.className = 'term-prompt-text';
      promptSpan.textContent = promptText;

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'term-inline-input';
      input.autocomplete = 'off';
      input.spellcheck = false;

      lineWrap.appendChild(promptSpan);
      lineWrap.appendChild(input);
      terminalLogs.appendChild(lineWrap);
      terminalLogs.scrollTop = terminalLogs.scrollHeight;

      input.focus();

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = input.value;
          input.disabled = true;
          input.className = 'term-user-val';
          input.replaceWith(document.createTextNode(val + '\n'));
          resolve(val);
        }
      });
    });
  }

  /* Helper to strip already-asked interactive prompts from backend stdout */
  function cleanProgramOutput(rawOutput, prompts) {
    if (!rawOutput) return '';
    if (!prompts || prompts.length === 0) return rawOutput;

    let cleaned = rawOutput;
    for (const p of prompts) {
      if (!p) continue;
      const rawP = p.promptText || '';
      if (rawP && cleaned.includes(rawP)) {
        cleaned = cleaned.replace(rawP, '');
      } else {
        const trimmedP = rawP.trim();
        if (trimmedP && cleaned.includes(trimmedP)) {
          cleaned = cleaned.replace(trimmedP, '');
        }
      }
    }

    return cleaned.replace(/^[\r\n\s]+/, '');
  }

  async function dispatchCompilerRequest(source, stdinPayload, startTime, interactivePrompts = []) {
    const payload = {
      compiler: 'gcc-13.2.0-c',
      code: source,
      stdin: stdinPayload,
      options: 'warning,gnu17'
    };

    try {
      // Primary: Wandbox GCC API
      const response = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const elapsed = Math.round(performance.now() - startTime);

      renderExecutionOutput(data, elapsed, interactivePrompts);
    } catch (err) {
      // Fallback: Piston GCC API
      try {
        const pistonPayload = {
          language: 'c',
          version: '10.2.0',
          files: [{ content: source }],
          stdin: stdinPayload
        };

        const resPiston = await fetch('https://emkc.org/api/v2/piston/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pistonPayload)
        });

        if (!resPiston.ok) throw new Error(`Piston HTTP ${resPiston.status}`);
        const dataPiston = await resPiston.json();
        const elapsed = Math.round(performance.now() - startTime);

        renderPistonOutput(dataPiston, elapsed, interactivePrompts);
      } catch (fallbackErr) {
        const elapsed = Math.round(performance.now() - startTime);
        setCompilerStatus('error');
        setExecutionStats(elapsed, 1);
        terminalLogs.innerHTML += `
          <div class="log-entry error-text">
            <strong>Execution Error:</strong> Unable to reach compilation servers. Please check your internet connection.
          </div>
        `;
      }
    }
  }

  function renderExecutionOutput(data, elapsed, interactivePrompts = []) {
    const exitCode = parseInt(data.status || '0', 10);
    const hasError = exitCode !== 0 || data.compiler_error;

    if (hasError) {
      setCompilerStatus('error');
    } else {
      setCompilerStatus('ready');
    }
    setExecutionStats(elapsed, exitCode);

    // Compiler errors / warnings
    if (data.compiler_error) {
      const errDiv = document.createElement('div');
      errDiv.className = 'log-entry error-text';
      errDiv.textContent = data.compiler_error;
      terminalLogs.appendChild(errDiv);
    }

    if (data.compiler_message && !data.compiler_error) {
      const warnDiv = document.createElement('div');
      warnDiv.className = 'log-entry warning-text';
      warnDiv.textContent = data.compiler_message;
      terminalLogs.appendChild(warnDiv);
    }

    // Program stdout
    const cleanedOutput = cleanProgramOutput(data.program_output, interactivePrompts);
    if (cleanedOutput && cleanedOutput.trim().length > 0) {
      const outDiv = document.createElement('div');
      outDiv.className = 'log-entry';
      outDiv.textContent = cleanedOutput;
      terminalLogs.appendChild(outDiv);
    }

    // Program stderr
    if (data.program_error) {
      const errOut = document.createElement('div');
      errOut.className = 'log-entry error-text';
      errOut.textContent = data.program_error;
      terminalLogs.appendChild(errOut);
    }

    // Completion banner
    const banner = document.createElement('div');
    banner.className = 'execution-banner';
    banner.textContent = `\n--------------------------------\nProcess exited with status ${exitCode} (${elapsed}ms)`;
    terminalLogs.appendChild(banner);
    terminalLogs.scrollTop = terminalLogs.scrollHeight;

    if (outputBadgeDot) outputBadgeDot.classList.add('has-update');
  }

  function renderPistonOutput(data, elapsed, interactivePrompts = []) {
    const runResult = data.run || {};
    const exitCode = runResult.code || 0;
    const hasError = exitCode !== 0 || runResult.stderr;

    if (hasError) setCompilerStatus('error');
    else setCompilerStatus('ready');
    setExecutionStats(elapsed, exitCode);

    // Program stdout
    const cleanedOutput = cleanProgramOutput(runResult.stdout, interactivePrompts);
    if (cleanedOutput && cleanedOutput.trim().length > 0) {
      const outDiv = document.createElement('div');
      outDiv.className = 'log-entry';
      outDiv.textContent = cleanedOutput;
      terminalLogs.appendChild(outDiv);
    }

    if (runResult.stderr) {
      const errDiv = document.createElement('div');
      errDiv.className = 'log-entry error-text';
      errDiv.textContent = runResult.stderr;
      terminalLogs.appendChild(errDiv);
    }

    const banner = document.createElement('div');
    banner.className = 'execution-banner';
    banner.textContent = `\n--------------------------------\nProcess exited with status ${exitCode} (${elapsed}ms)`;
    terminalLogs.appendChild(banner);
    terminalLogs.scrollTop = terminalLogs.scrollHeight;

    if (outputBadgeDot) outputBadgeDot.classList.add('has-update');
  }

  if (runCodeBtn) runCodeBtn.addEventListener('click', executeCCode);

  if (clearConsoleBtn) {
    clearConsoleBtn.addEventListener('click', () => {
      renderWelcomeTerminal();
      setExecutionStats(0, 0);
      showToast('Output console cleared', 'info');
    });
  }

  if (copyConsoleBtn) {
    copyConsoleBtn.addEventListener('click', () => {
      if (!terminalLogs) return;
      navigator.clipboard.writeText(terminalLogs.innerText).then(() => {
        showToast('Console output copied!', 'success');
      });
    });
  }

  if (fullScreenToggleBtn) {
    fullScreenToggleBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        if (fullScreenIcon) fullScreenIcon.className = 'fa-solid fa-compress';
      } else {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        if (fullScreenIcon) fullScreenIcon.className = 'fa-solid fa-expand';
      }
    });
  }

  /* ==========================================================================
     16. WORKSPACE RESIZER (DESKTOP)
     ========================================================================== */
  if (workspaceResizer && panelEditor && workspaceLayout) {
    let isResizing = false;

    workspaceResizer.addEventListener('mousedown', () => {
      isResizing = true;
      workspaceResizer.classList.add('active');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const rect = workspaceLayout.getBoundingClientRect();
      const offset = e.clientX - rect.left;
      const pct = Math.max(25, Math.min(75, (offset / rect.width) * 100));
      panelEditor.style.width = `${pct}%`;
    });

    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        workspaceResizer.classList.remove('active');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });
  }

  /* ==========================================================================
     17. VIEW SWITCHER (EDITOR / OUTPUT)
     ========================================================================== */
  function setMobileView(view) {
    if (!workspaceLayout) return;
    if (view === 'editor') {
      workspaceLayout.className = 'workspace-layout viewing-editor';
      if (tabViewCode) tabViewCode.classList.add('active');
      if (tabViewOutput) tabViewOutput.classList.remove('active');
    } else {
      workspaceLayout.className = 'workspace-layout viewing-output';
      if (tabViewCode) tabViewCode.classList.remove('active');
      if (tabViewOutput) tabViewOutput.classList.add('active');
      if (outputBadgeDot) outputBadgeDot.classList.remove('has-update');
    }
  }

  if (tabViewCode) tabViewCode.addEventListener('click', () => setMobileView('editor'));
  if (tabViewOutput) tabViewOutput.addEventListener('click', () => setMobileView('output'));

  /* ==========================================================================
     18. BOOTSTRAP
     ========================================================================== */
  initializeStudio();
});

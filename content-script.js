// Ce script met en surbrillance les boxes interactives de la liste au hover, avec un fond bleu classique.

const HIGHLIGHT_CLASS = 'hover-highlighter-extension-highlight';
const GLOBAL_HIGHLIGHT_CLASS = 'global-highlight';
const HIGHLIGHT_COLOR = '#3b82f6'; // Bleu classique

function injectHighlightStyle() {
  if (document.getElementById('hover-highlighter-style')) return;
  const style = document.createElement('style');
  style.id = 'hover-highlighter-style';
  style.textContent = `
    .${HIGHLIGHT_CLASS} {
      outline: none !important;
      background: ${HIGHLIGHT_COLOR}80 !important;
      transition: background 0.1s;
    }
    .${HIGHLIGHT_CLASS}.${GLOBAL_HIGHLIGHT_CLASS} {
      background: ${HIGHLIGHT_COLOR}80 !important;
      transition: background 0.1s;
    }
  `;
  document.head.appendChild(style);
}

function observeGlowOnAllBoxes() {
  // Cible uniquement les boxes interactives de la liste
  const selector = '.bg-backgroundSecondary.cursor-pointer.group';
  const attachGlow = (box) => {
    if (box.dataset.globalGlowAttached === '1') return;
    let hoverCount = 0;
    const addGlow = () => {
      hoverCount++;
      box.classList.add(HIGHLIGHT_CLASS, GLOBAL_HIGHLIGHT_CLASS);
    };
    const removeGlow = () => {
      hoverCount--;
      if (hoverCount <= 0) {
        box.classList.remove(HIGHLIGHT_CLASS, GLOBAL_HIGHLIGHT_CLASS);
        hoverCount = 0;
      }
    };
    box.addEventListener('mouseenter', addGlow, true);
    box.addEventListener('mouseleave', removeGlow, true);
    box.dataset.globalGlowAttached = '1';
  };

  // Premier passage
  document.querySelectorAll(selector).forEach(attachGlow);

  // Observe dynamiquement les ajouts dans le body
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches(selector)) {
          attachGlow(node);
        }
        node.querySelectorAll?.(selector)?.forEach(attachGlow);
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function main() {
  injectHighlightStyle();
  observeGlowOnAllBoxes();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
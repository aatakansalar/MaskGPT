
let maskerEnabled = true;
chrome.storage.sync.get('enabled', ({ enabled }) => {
  maskerEnabled = enabled !== false;
});

const originalMap = new Map();
function restoreAll() {
  for (const [node, orig] of originalMap.entries()) {
    if (node instanceof Node && node.nodeType === Node.TEXT_NODE) {
      node.nodeValue = orig;
    } else if (node instanceof HTMLTextAreaElement) {
      node.value = orig;
    }
  }
  originalMap.clear();
}
function maskSensitive(text) {
  return text
    .replace(/sk-[A-Za-z0-9_-]{20,}/g, '[MASKED]')
    .replace(/\bAKIA[0-9A-Z]{16}\b/g, '[MASKED]')
    .replace(/(\b(?:password|pwd|pass)\s*:\s*)(["']?)[^"'\s]+\2/gi, '$1$2[MASKED]$2')
    .replace(/\b([A-Za-z0-9_]*(?:key|secret|token)[A-Za-z0-9_]*)\s*=\s*[^\s;]+/gi, '$1=[MASKED]')
    .replace(/("?(?:password|apiKey|authToken|accessToken|refreshToken)"?\s*:\s*)"([^"]+)"/gi, '$1"[MASKED]"')
    .replace(/([?&](?:token|api_key|apiKey|auth)[=])[^&\s]+/gi, '$1[MASKED]')
    .replace(/(Authorization\s*:\s*Bearer\s+)[A-Za-z0-9\-\._~\+\/]+=*/gi, '$1[MASKED]')
    .replace(/\b[A-Za-z0-9+/]{40,}={0,2}\b/g, '[MASKED]')
    .replace(/sk-[A-Za-z0-9_-]{20,}/g, '[MASKED]')
    .replace(/\bAKIA[0-9A-Z]{16}\b/g, '[MASKED]')
    .replace(/(\b(?:password|pwd|pass)\s*:\s*)(["']?)[^"'\s]+\2/gi, '$1$2[MASKED]$2')
    .replace(/\b([A-Za-z0-9_]*(?:key|secret|token)[A-Za-z0-9_]*)\s*=\s*[^\s;]+/gi, '$1=[MASKED]')
    .replace(/("?(?:password|apiKey|authToken|accessToken|refreshToken)"?\s*:\s*)"([^"]+)"/gi, '$1"[MASKED]"')
    .replace(/([?&](?:token|api_key|apiKey|auth)[=])[^&\s]+/gi, '$1[MASKED]')
    .replace(/(Authorization\s*:\s*Bearer\s+)[A-Za-z0-9\-\._~\+\/]+=*/gi, '$1[MASKED]')
    .replace(/\b[A-Za-z0-9+/]{40,}={0,2}\b/g, '[MASKED]')
    .replace(
      /^([A-Z][A-Z0-9_]*)=(["']?)[^"'\r\n]+?\2$/gm,
      '$1=$2[MASKED]$2'
    )
    .replace(
      /(\b[A-Za-z_][A-Za-z0-9_]*)(=)(["']?)([^"'\s;]+)\3/g,
      '$1$2$3[MASKED]$3'
    )
}
function maskTextNodes(root) {
  if (!maskerEnabled) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  let node;
  while (node = walker.nextNode()) {
    const orig = node.nodeValue;
    const masked = maskSensitive(orig);
    if (orig !== masked) {
      if (!originalMap.has(node)) originalMap.set(node, orig);
      node.nodeValue = masked;
    }
  }
}

function hookContentEditable(div) {
  if (div.__maskerHooked) return;
  div.__maskerHooked = true;
  div.addEventListener('paste', () => setTimeout(() => maskTextNodes(div), 0));
}

function hookTextarea(ta) {
  if (ta.__maskerHooked) return;
  ta.__maskerHooked = true;
  ta.addEventListener('paste', () => {
    setTimeout(() => {
      if (!maskerEnabled) return;
      const orig = ta.value;
      const masked = maskSensitive(orig);
      if (orig !== masked) {
        if (!originalMap.has(ta)) originalMap.set(ta, orig);
        ta.value = masked;
      }
    }, 0);
  });
}

document.querySelectorAll('div[contenteditable="true"]').forEach(hookContentEditable);
document.querySelectorAll('textarea').forEach(hookTextarea);

new MutationObserver(muts => {
  muts.forEach(m => {
    m.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;
      if (node.matches('div[contenteditable="true"]')) hookContentEditable(node);
      if (node.matches('textarea')) hookTextarea(node);
      const ce = node.querySelector?.('div[contenteditable="true"]');
      if (ce) hookContentEditable(ce);
      const ta = node.querySelector?.('textarea');
      if (ta) hookTextarea(ta);
    });
  });
}).observe(document.body, { childList: true, subtree: true });

function applyToggle(prevEnabled, newEnabled) {
  if (prevEnabled && !newEnabled) {
    restoreAll();
  } else if (!prevEnabled && newEnabled) {
    maskTextNodes(document.body);
    document.querySelectorAll('textarea').forEach(ta => {
      const orig = ta.value;
      const masked = maskSensitive(orig);
      if (orig !== masked) {
        originalMap.set(ta, orig);
        ta.value = masked;
      }
    });
  }
}


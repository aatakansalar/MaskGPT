
let isExtensionActive = true;

function showNotification(message, type = 'success') {
  const n = document.getElementById('notification');
  n.textContent = message;
  n.className = `notification ${type} show`;
  setTimeout(() => n.classList.remove('show'), 2000);
}

function renderToggle() {
  const toggle = document.getElementById('toggleSwitch');
  toggle.classList.toggle('active', isExtensionActive);
  const statusText = document.getElementById('statusText');
  statusText.textContent = isExtensionActive ? 'Active' : 'Disabled';
}

function toggleExtension() {
  isExtensionActive = !isExtensionActive;
  chrome.storage.sync.set({ enabled: isExtensionActive });
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'toggleExtension',
      enabled: isExtensionActive
    });
  });
  renderToggle();
  showNotification(
    isExtensionActive ? 'MaskGPT enabled' : 'MaskGPT disabled',
    isExtensionActive ? 'success' : 'error'
  );
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('enabled', ({ enabled }) => {
    isExtensionActive = enabled !== false;
    renderToggle();
  });

  document.getElementById('toggleSwitch')
    .addEventListener('click', toggleExtension);
});

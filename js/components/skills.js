// Initialize once on page load
export function initializeSkills() {
  const groups = document.querySelectorAll('.chip-list');

  groups.forEach(group => {
    const chips = Array.from(group.querySelectorAll('.skill-chip'));

    // Arrow key navigation within a group
    group.addEventListener('keydown', (e) => {
      const i = chips.indexOf(document.activeElement);
      if (i === -1) return;

      let next = null;
      // estimate columns for up/down navigation
      const col = Math.max(1, Math.floor(group.clientWidth / (chips[0].offsetWidth + 12)));

      switch (e.key) {
        case 'ArrowRight': next = (i + 1) % chips.length; break;
        case 'ArrowLeft':  next = (i - 1 + chips.length) % chips.length; break;
        case 'ArrowDown':  next = Math.min(i + col, chips.length - 1); break;
        case 'ArrowUp':    next = Math.max(i - col, 0); break;
        default: return;
      }
      e.preventDefault();
      chips[next].focus();
    });

    // Better TalkBack announcement
    chips.forEach(chip => {
      chip.setAttribute('aria-pressed','false');
      chip.addEventListener('focus', () => {
        chip.setAttribute('aria-description', `${chip.textContent.trim()} skill`);
      });
    });
  });
}


// 92b@2#!efumUmT.
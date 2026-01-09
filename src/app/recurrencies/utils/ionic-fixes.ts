export function blurActiveElement() {
  const activeEl = document.activeElement as HTMLElement
  activeEl.blur()
}
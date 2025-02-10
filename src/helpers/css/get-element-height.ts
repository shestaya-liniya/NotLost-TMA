export function getElementHeightById(id: string) {
  const element = document.getElementById(id);
  if (element) {
    return element.offsetHeight;
  } else {
    console.error(`Element with ID "${id}" not found.`);
    return null;
  }
}

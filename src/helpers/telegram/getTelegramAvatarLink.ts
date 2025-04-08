export default function getTelegramAvatarLink(username: string) {
  return `https://t.me/i/userpic/320/${username}.svg`;
}

export function checkUserExist(username: string): Promise<{ exists: boolean }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = getTelegramAvatarLink(username);

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      // Telegram send an "image" 1x1 pixels when user is not found
      const exists = width > 1 && height > 1;

      resolve({ exists });
    };

    img.onerror = () => {
      resolve({ exists: false });
    };
  });
}

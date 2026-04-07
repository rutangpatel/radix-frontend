export function getUserIdentifier(): string {
  if (typeof window === 'undefined') return '';
  const token = localStorage.getItem('access_token');
  if (!token) return '';

  try {
    const payloadStr = token.split('.')[1];
    const payload = JSON.parse(atob(payloadStr));
    // Check standard FastAPI sub claim or custom user_id claim
    const id = payload.sub || payload.user_id || payload.username || '';
    return id;
  } catch (e) {
    console.error('Failed to parse JWT token', e);
    return '';
  }
}

export function getUserName(): string {
  if (typeof window === 'undefined') return 'Radix User';
  const token = localStorage.getItem('access_token');
  if (!token) return 'Radix User';

  try {
    const payloadStr = token.split('.')[1];
    const payload = JSON.parse(atob(payloadStr));
    return payload.name || payload.sub || 'Radix User';
  } catch (e) {
    console.error('Failed to parse JWT token for name', e);
    return 'Radix User';
  }
}

export function getUserInitials(name: string): string {
  if (!name || name === 'Radix User' || name === '') return 'RU';
  
  const words = name.trim().split(/\s+/);
  if (words.length > 1) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  const cleanId = name.replace('@radix', '');
  return cleanId.substring(0, 2).toUpperCase();
}
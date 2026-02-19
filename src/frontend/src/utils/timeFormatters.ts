export function formatMessageTime(timestamp: bigint): string {
  // Backend returns 0 for timestamps, so we'll use current time for display
  // In a real implementation, the backend would provide actual timestamps
  const date = timestamp === BigInt(0) ? new Date() : new Date(Number(timestamp) / 1000000);
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

export function formatRelativeTime(timestamp: bigint): string {
  if (timestamp === BigInt(0)) {
    return 'agora';
  }
  
  const now = Date.now();
  const messageTime = Number(timestamp) / 1000000;
  const diffMs = now - messageTime;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMinutes < 1) return 'agora';
  if (diffMinutes < 60) return `${diffMinutes} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays === 1) return 'ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  
  return formatMessageTime(timestamp);
}

export function getTimestampDisplay(timestamp: bigint): string {
  // For messages less than 24 hours old, show relative time
  // Otherwise show absolute time
  if (timestamp === BigInt(0)) {
    return formatMessageTime(timestamp);
  }
  
  const now = Date.now();
  const messageTime = Number(timestamp) / 1000000;
  const diffHours = Math.floor((now - messageTime) / 3600000);
  
  if (diffHours < 24) {
    return formatRelativeTime(timestamp);
  }
  
  return formatMessageTime(timestamp);
}

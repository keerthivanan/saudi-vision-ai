/**
 * Conversation export utilities
 */

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  confidence?: number;
  sources?: string[];
  query_type?: string;
  classification_reason?: string;
  saudi_context?: boolean;
  response_type?: string;
  model_used?: string;
}

export interface ExportOptions {
  format: 'json' | 'txt' | 'markdown';
  includeMetadata: boolean;
  includeTimestamps: boolean;
  anonymizeData: boolean;
}

/**
 * Export conversation to JSON format
 */
export function exportToJson(conversation: Conversation, options: ExportOptions): string {
  const exportData = {
    metadata: options.includeMetadata ? {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt.toISOString(),
      exportedAt: new Date().toISOString(),
      messageCount: conversation.messages.length,
      platform: 'Saudi AI Platform'
    } : undefined,
    messages: conversation.messages.map(message => ({
      ...(options.includeTimestamps && { timestamp: message.timestamp.toISOString() }),
      role: message.role,
      content: options.anonymizeData ? anonymizeContent(message.content) : message.content,
      ...(options.includeMetadata && message.confidence && { confidence: message.confidence }),
      ...(options.includeMetadata && message.sources && { sources: message.sources }),
      ...(options.includeMetadata && message.query_type && { queryType: message.query_type }),
      ...(options.includeMetadata && message.saudi_context !== undefined && { saudiContext: message.saudi_context }),
      ...(options.includeMetadata && message.model_used && { modelUsed: message.model_used })
    }))
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Export conversation to plain text format
 */
export function exportToText(conversation: Conversation, options: ExportOptions): string {
  let content = '';

  if (options.includeMetadata) {
    content += `Saudi AI Platform - Conversation Export\n`;
    content += `Title: ${conversation.title}\n`;
    content += `Created: ${conversation.createdAt.toLocaleString()}\n`;
    content += `Exported: ${new Date().toLocaleString()}\n`;
    content += `Messages: ${conversation.messages.length}\n`;
    content += '=' .repeat(50) + '\n\n';
  }

  conversation.messages.forEach((message, index) => {
    const role = message.role.charAt(0).toUpperCase() + message.role.slice(1);
    content += `${role}: `;

    if (options.anonymizeData) {
      content += anonymizeContent(message.content);
    } else {
      content += message.content;
    }

    if (options.includeTimestamps) {
      content += ` [${message.timestamp.toLocaleString()}]`;
    }

    if (options.includeMetadata && message.sources && message.sources.length > 0) {
      content += `\nSources: ${message.sources.join(', ')}`;
    }

    if (options.includeMetadata && message.confidence) {
      content += `\nConfidence: ${Math.round(message.confidence * 100)}%`;
    }

    content += '\n\n';
  });

  return content;
}

/**
 * Export conversation to Markdown format
 */
export function exportToMarkdown(conversation: Conversation, options: ExportOptions): string {
  let content = '';

  if (options.includeMetadata) {
    content += `# Saudi AI Platform - Conversation Export\n\n`;
    content += `**Title:** ${conversation.title}\n`;
    content += `**Created:** ${conversation.createdAt.toLocaleString()}\n`;
    content += `**Exported:** ${new Date().toLocaleString()}\n`;
    content += `**Messages:** ${conversation.messages.length}\n\n`;
    content += '---\n\n';
  }

  conversation.messages.forEach((message, index) => {
    const role = message.role.charAt(0).toUpperCase() + message.role.slice(1);

    if (message.role === 'user') {
      content += `## 👤 User\n\n`;
    } else if (message.role === 'assistant') {
      content += `## 🤖 AI Assistant\n\n`;
    } else {
      content += `## ⚙️ System\n\n`;
    }

    if (options.anonymizeData) {
      content += anonymizeContent(message.content);
    } else {
      content += message.content;
    }

    content += '\n\n';

    if (options.includeTimestamps) {
      content += `*${message.timestamp.toLocaleString()}*\n\n`;
    }

    if (options.includeMetadata) {
      if (message.sources && message.sources.length > 0) {
        content += `**Sources:** ${message.sources.join(', ')}\n\n`;
      }

      if (message.confidence) {
        content += `**Confidence:** ${Math.round(message.confidence * 100)}%\n\n`;
      }

      if (message.query_type) {
        content += `**Query Type:** ${message.query_type}\n\n`;
      }

      if (message.saudi_context) {
        content += `**🇸🇦 Saudi Context:** Yes\n\n`;
      }

      if (message.model_used) {
        content += `**Model:** ${message.model_used}\n\n`;
      }
    }

    content += '---\n\n';
  });

  return content;
}

/**
 * Anonymize sensitive content in messages
 */
function anonymizeContent(content: string): string {
  // Remove potential email addresses
  content = content.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL REDACTED]');

  // Remove potential phone numbers
  content = content.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE REDACTED]');

  // Remove potential URLs
  content = content.replace(/https?:\/\/[^\s]+/g, '[URL REDACTED]');

  return content;
}

/**
 * Download exported content as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Main export function
 */
export function exportConversation(
  conversation: Conversation,
  format: ExportOptions['format'],
  options: Partial<Omit<ExportOptions, 'format'>> = {}
): void {
  const exportOptions: ExportOptions = {
    format,
    includeMetadata: options.includeMetadata ?? true,
    includeTimestamps: options.includeTimestamps ?? true,
    anonymizeData: options.anonymizeData ?? false
  };

  let content: string;
  let filename: string;
  let mimeType: string;

  switch (format) {
    case 'json':
      content = exportToJson(conversation, exportOptions);
      filename = `conversation-${conversation.id}.json`;
      mimeType = 'application/json';
      break;

    case 'txt':
      content = exportToText(conversation, exportOptions);
      filename = `conversation-${conversation.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
      mimeType = 'text/plain';
      break;

    case 'markdown':
      content = exportToMarkdown(conversation, exportOptions);
      filename = `conversation-${conversation.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
      mimeType = 'text/markdown';
      break;

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }

  downloadFile(content, filename, mimeType);
}

/**
 * Share conversation (future feature)
 */
export async function shareConversation(conversation: Conversation): Promise<boolean> {
  // Check if Web Share API is available
  if (!navigator.share) {
    return false;
  }

  try {
    const shareData = {
      title: conversation.title,
      text: `Check out this conversation from Saudi AI Platform: ${conversation.title}`,
      url: window.location.href
    };

    await navigator.share(shareData);
    return true;
  } catch (error) {
    console.error('Error sharing conversation:', error);
    return false;
  }
}

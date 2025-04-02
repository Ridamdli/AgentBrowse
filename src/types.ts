// Message types
export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

// Agent types
export type Agent = {
  id: string;
  name: string;
  description: string;
  provider: 'openai' | 'anthropic' | 'azure-openai' | 'gemini' | 'deepseek' | 'auto';
  isMax?: boolean;
};

// Action types
export type Action = {
  id: string;
  type: 'web-navigation' | 'code-execution' | 'file-operation';
  description: string;
  status: 'pending' | 'completed' | 'error';
  result?: string;
  timestamp: Date;
}; 
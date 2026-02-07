
export interface ChatbotAnswer {
  symptoms: string;
  causes: string;
  prevention: string;
  treatment: string;
}

export interface AnalysisResult {
  predicted_class: string;
  confidence: number;
  chatbot_answer: ChatbotAnswer;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

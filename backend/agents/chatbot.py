from enum import Enum
from dataclasses import dataclass
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate

class MessageType(Enum):
    SYSTEM = "system"
    HUMAN = "human"
    AI = "ai"

@dataclass
class ChatMessage:
    messageType: MessageType
    content: str

class ChatBot:
    def __init__(self, config: dict[str, str], context: dict[str, str]):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini" if config['model'] is None else config['model'],
            temperature=0 if config['temperature'] is None else config['temperature'],
            max_tokens=2048 if config['max_tokens'] is None else config['max_tokens'],
            timeout=None,
            max_retries=2
        )
        self.context = context
        
        default_system_message = "You are a helpful assistant. Keep the conversation in context."
        
        self.history = [
            ChatMessage(MessageType.SYSTEM, config['initial_system_message'] or default_system_message)
        ]

    def get_history(self):
        """Returns the chat history excluding system messages"""
        return [entry for entry in self.history if entry.messageType != MessageType.SYSTEM]
    
    def add_history(self, messages: list[ChatMessage]):
        self.history.extend(messages)
    
    def __create_prompt_template(self) -> ChatPromptTemplate:
        messages = []
        for entry in self.history:
            if entry.messageType == MessageType.SYSTEM:
                messages.append(("system", entry.content))
            elif entry.messageType == MessageType.HUMAN:
                messages.append(HumanMessage(entry.content))
            elif entry.messageType == MessageType.AI:
                messages.append(AIMessage(entry.content))
            else:
                raise ValueError(f"Unknown message type: {entry.messageType}")
        return ChatPromptTemplate(messages)
    
    def __get_meta(self, output):
        token_usage = output.response_metadata['token_usage']
        return {
            'prompt_tokens': token_usage['prompt_tokens'],
            'completion_tokens': token_usage['completion_tokens'],
            'model_name': output.response_metadata['model_name']
        }
            
    def human_message(self, content: str):
        new_message = ChatMessage(MessageType.HUMAN, content)
        self.history.append(new_message)
        
        prompt = self.__create_prompt_template()
        chain = prompt | self.llm
        response_message = chain.invoke(self.context)
        print('meta:', self.__get_meta(response_message))
        
        aimessage = ChatMessage(MessageType.AI, response_message.content)
        self.history.append(aimessage)
        
        return aimessage
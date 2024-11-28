import json
import yaml
from agents.agents import AgentSystem
from agents.chatbot import ChatBot, ChatMessage, MessageType

def read_file(file_path):
    with open(file_path, 'r') as file:
        return file.read()

def read_yaml_file(yaml_file):
    with open(yaml_file, 'r') as file:
        return yaml.safe_load(file)


agents_data = read_yaml_file('conf/agents.yaml')
tasks_data = read_yaml_file('conf/tasks.yaml')
jobs_puml = read_file('conf/jobs.puml')

chatbot_config = read_yaml_file('conf/chatbot.yaml')

def analyze_application(resume_text: str, job_description_text: str):
    
    agents = AgentSystem('Coach', agents_data, tasks_data)
    inputs = {
        'resume_text': resume_text,
        'job_description_text': job_description_text,
        'jobs-plantuml': jobs_puml
    }
    
    results = agents.execute(inputs)
    # logging
    print(results.get('usage_metrics'))
    
    return results.get('raw_output')

def create_chatbot(coaching_report: str, message_history: list[ChatMessage]) -> ChatBot:
    context = {
        'coaching_report': coaching_report,
    }
    chatbot = ChatBot(chatbot_config, context)
    chatbot.add_history(message_history)
    return chatbot

def parse_chat_history(chat_history: str) -> list[ChatMessage]:
    messages = []
    try:
        history = [] if chat_history is None else json.loads(chat_history)
        for entry in history:
            message = ChatMessage(MessageType(entry['messageType']), entry['content'])
            messages.append(message)
    except Exception:
        messages = []
    return messages
        
def serialize_chat_history(chat_history: list[ChatMessage]) -> str:
    return json.dumps([
        {
            'messageType': entry.messageType.value,
            'content': entry.content
        }
        for entry in chat_history
    ])
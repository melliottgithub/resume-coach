from typing import Any, Dict, List
from langchain_openai import ChatOpenAI
from crewai import Crew, Agent, Process, Task
import time

VERBOSE = False
MAX_RPM = 240

class AgentSystem:
    def __init__(self, name: str, agents_data: Dict[str, Any], tasks_data: Dict[str, Any]):
        """
        Initializes the AgentSystem with agents and tasks data.

        :param agents_data: A dictionary containing information about agents.
        :param tasks_data: A dictionary containing information about tasks.
        """
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=.5)
        self.agents = self._create_agents(agents_data)
        self.tasks = self._create_tasks(tasks_data, self.agents)

        self.crew = Crew(
            name=name,
            agents=list(self.agents.values()),
            tasks=self.tasks,
            process=Process.sequential,
            max_rpm=MAX_RPM,
            verbose=VERBOSE
        )

    def _create_agents(self, agents_data) -> Dict[str, Agent]:
        agents = {}
        for _, agent_info in agents_data.items():
            agent = Agent(
                role=agent_info.get('role'),
                goal=agent_info.get('goal'),
                backstory=agent_info.get('backstory'),
                llm=self.llm,
                cache=True,
                verbose=VERBOSE,
                allow_delegation=False
            )
            agents[agent_info.get('role')] = agent  # Store agents by their role
        
        return agents

    def _create_tasks(self, tasks_data, agents: Dict[str, Agent]) -> List[Task]:
        tasks = []
        for task_name, task_info in tasks_data.items():
            agent_role = task_info.get('agent_role')  # Get the agent role for this task
            agent = agents.get(agent_role)  # Look up the agent using the role
            
            if agent is None:
                raise ValueError(f"Agent with role '{agent_role}' not found for task '{task_name}'")

            # Lookup tasks specified in context if present
            context_task_names = task_info.get('context', [])
            context_tasks = [task for task in tasks if task.name in context_task_names]

            task = Task(
                name=task_name,
                description=task_info['description'],
                expected_output=task_info['expected_output'],
                agent=agent,
                context=context_tasks
            )
            tasks.append(task)
        
        return tasks

    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes the crew process with the provided inputs.

        :param inputs: A dictionary of inputs to execute the workflow.
        :return: A dictionary containing raw output, usage metrics, and execution time.
        """
        start_time = time.time()
        
        output = self.crew.kickoff(inputs)
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        return {
            "raw_output": output.raw,
            "usage_metrics": {
                "total_tokens": output.token_usage.total_tokens,
                "prompt_tokens": output.token_usage.prompt_tokens,
                "completion_tokens": output.token_usage.completion_tokens,
                "successful_requests": output.token_usage.successful_requests,
                "execution_time": execution_time
            }
        }
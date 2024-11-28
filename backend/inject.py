class _Injector:
    def __init__(self):
        self._registrations = {}

    def register(self, abstract_class, implementation_class):
        self._registrations[abstract_class] = implementation_class

    def resolve(self, abstract_class):
        implementation_class = self._registrations.get(abstract_class)
        if not implementation_class:
            raise ValueError(f"No implementation registered for {abstract_class}")
        return implementation_class()  # Instantiate and return the implementation

Injector = _Injector()
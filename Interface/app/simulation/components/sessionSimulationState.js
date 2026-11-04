
const sessionSystems = new Map();
const listeners = new Set();

export function getSessionSystem(systemId) {
  return sessionSystems.get(systemId) || null;
}

export function setSessionSystem(systemId, data) {
  sessionSystems.set(systemId, data);

  listeners.forEach((listener) => {
    listener();
  });
}

export function subscribeSessionSystems(listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

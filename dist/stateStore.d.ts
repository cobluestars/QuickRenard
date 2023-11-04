export function initializeStore(schema: any): void;
export function getState(query: any): any;
export function setStateMutation(mutation: any, newValue: any): void;
export function setState(mutation: any, newValue: any): void;
export function subscribeStateChange(stateName: any, callback: any): () => void;

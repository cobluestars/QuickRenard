/** hooks.ts */
declare function useStateQuery(query: string): any;
declare function useStateMutation(mutation: string): any[];
declare function useStateSubscription(stateName: string, callback: () => void): void;
export { useStateQuery, useStateMutation, useStateSubscription };

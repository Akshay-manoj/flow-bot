export type NodeType = 'message' | 'question' | 'end';

export interface FlowNode {
  type: NodeType;
  /** Text content (supports {{variable}} interpolation) */
  text?: string;
  /** For question nodes: which variable to save the answer to */
  saveTo?: string;
  /** Optional validation: 'email' | 'phone' */
  validation?: string;
  /** Id of the next node, or null to end the flow */
  next: string | null;
}

export interface FlowDefinition {
  startNode: string;
  nodes: Record<string, FlowNode>;
}

export interface SessionState {
  flowId: string;
  currentNodeId: string;
  variables: Record<string, string>;
  /** Whether we're waiting for the user to answer a question */
  awaitingInput: boolean;
}

export interface StepResult {
  session: SessionState;
  /** Messages to send back to the user */
  outgoingMessages: string[];
  /** True when the flow has finished (no more nodes) */
  done: boolean;
}

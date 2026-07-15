import { Injectable } from '@nestjs/common';
import {
  FlowDefinition,
  SessionState,
  StepResult,
} from './engine.types';

@Injectable()
export class EngineService {
  /**
   * Pure function — no DB or WebSocket calls.
   * Given a flow definition, current session state, and an optional incoming
   * message from the user, advances the flow and returns the updated session
   * plus any messages to send back.
   */
  step(
    flow: FlowDefinition,
    session: SessionState,
    incomingMessage?: string,
  ): StepResult {
    const outgoingMessages: string[] = [];
    let currentSession = { ...session, variables: { ...session.variables } };

    // If we're waiting for user input, process it first
    if (currentSession.awaitingInput && incomingMessage !== undefined) {
      const node = flow.nodes[currentSession.currentNodeId];
      if (node && node.type === 'question' && node.saveTo) {
        currentSession.variables[node.saveTo] = incomingMessage.trim();
      }
      // Advance to next node
      if (node?.next) {
        currentSession.currentNodeId = node.next;
      } else {
        return { session: { ...currentSession, awaitingInput: false }, outgoingMessages, done: true };
      }
      currentSession.awaitingInput = false;
    }

    // Walk forward through message nodes until we hit a question or end
    while (true) {
      const nodeId = currentSession.currentNodeId;
      const node = flow.nodes[nodeId];

      if (!node) {
        // Node not found — end the flow gracefully
        return { session: currentSession, outgoingMessages, done: true };
      }

      if (node.type === 'end') {
        if (node.text) {
          outgoingMessages.push(this.interpolate(node.text, currentSession.variables));
        }
        return { session: currentSession, outgoingMessages, done: true };
      }

      if (node.type === 'message') {
        if (node.text) {
          outgoingMessages.push(this.interpolate(node.text, currentSession.variables));
        }
        if (node.next) {
          currentSession.currentNodeId = node.next;
        } else {
          return { session: currentSession, outgoingMessages, done: true };
        }
        continue;
      }

      if (node.type === 'question') {
        // Send the question text, then pause and wait for user input
        if (node.text) {
          outgoingMessages.push(this.interpolate(node.text, currentSession.variables));
        }
        currentSession.awaitingInput = true;
        return { session: currentSession, outgoingMessages, done: false };
      }

      // Unknown node type — stop
      return { session: currentSession, outgoingMessages, done: true };
    }
  }

  /** Replace {{variable}} placeholders with values from the session */
  private interpolate(text: string, variables: Record<string, string>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] ?? '');
  }
}

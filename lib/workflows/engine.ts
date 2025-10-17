import { WorkflowDefinition, WorkflowExecution, WorkflowExecutionLogEntry, Booking, BookingStatus } from '../types';

export class WorkflowEngine {
  /**
   * Execute a workflow with real-time updates
   */
  static async executeWorkflowWithUpdates(
    workflow: WorkflowDefinition,
    booking: Booking,
    updateBookingStatus: (bookingId: string, status: BookingStatus, updatedBy: string, note?: string) => void,
    sendNotification: (bookingId: string, type: 'email' | 'sms', recipient: string, message: string, trigger: string) => void,
    executionId: string,
    onUpdate: (execution: WorkflowExecution) => void
  ): Promise<void> {
    console.log(`[WorkflowEngine] Starting workflow: ${workflow.name} for booking: ${booking.id}`);
    
    const execution: WorkflowExecution = {
      id: executionId,
      workflowId: workflow.id,
      bookingId: booking.id,
      status: 'running',
      currentNodeId: null,
      startedAt: new Date().toISOString(),
      completedAt: null,
      executionLog: [],
    };

    try {
      // Find start node
      const startNode = workflow.nodes.find(n => n.type === 'start');
      if (!startNode) {
        throw new Error('No start node found in workflow');
      }

      execution.currentNodeId = startNode.id;
      this.addLogEntry(execution, startNode.id, 'start', 'Workflow started', 'success', 'Workflow execution initiated');
      onUpdate({ ...execution }); // Update UI
      console.log(`[WorkflowEngine] Found start node: ${startNode.id}`);

      // Execute workflow nodes in sequence
      let currentNodeId = startNode.id;
      let iterationCount = 0;
      const maxIterations = 100;
      
      while (currentNodeId && iterationCount < maxIterations) {
        iterationCount++;
        console.log(`[WorkflowEngine] Executing node: ${currentNodeId} (iteration ${iterationCount})`);
        
        const nextNodeId = await this.executeNodeWithUpdates(
          currentNodeId,
          workflow,
          booking,
          execution,
          updateBookingStatus,
          sendNotification,
          onUpdate
        );
        
        if (!nextNodeId) {
          console.log(`[WorkflowEngine] No next node, workflow complete`);
          break;
        }
        currentNodeId = nextNodeId;
      }
      
      if (iterationCount >= maxIterations) {
        throw new Error('Workflow exceeded maximum iterations - possible infinite loop');
      }

      execution.status = 'completed';
      execution.completedAt = new Date().toISOString();
      this.addLogEntry(execution, 'end', 'end', 'Workflow completed', 'success', 'All nodes executed successfully');
      onUpdate({ ...execution }); // Final update
      console.log(`[WorkflowEngine] Workflow completed successfully`);

    } catch (error) {
      execution.status = 'failed';
      execution.completedAt = new Date().toISOString();
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.addLogEntry(execution, execution.currentNodeId || 'unknown', 'error', 'Workflow failed', 'failure', errorMessage);
      onUpdate({ ...execution }); // Update with error
      console.error(`[WorkflowEngine] Workflow failed:`, error);
    }
  }

  /**
   * Execute a workflow for a booking (legacy method)
   */
  static async executeWorkflow(
    workflow: WorkflowDefinition,
    booking: Booking,
    updateBookingStatus: (bookingId: string, status: BookingStatus, updatedBy: string, note?: string) => void,
    sendNotification: (bookingId: string, type: 'email' | 'sms', recipient: string, message: string, trigger: string) => void
  ): Promise<WorkflowExecution> {
    console.log(`[WorkflowEngine] Starting workflow: ${workflow.name} for booking: ${booking.id}`);
    
    const execution: WorkflowExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workflowId: workflow.id,
      bookingId: booking.id,
      status: 'running',
      currentNodeId: null,
      startedAt: new Date().toISOString(),
      completedAt: null,
      executionLog: [],
    };

    try {
      // Find start node
      const startNode = workflow.nodes.find(n => n.type === 'start');
      if (!startNode) {
        throw new Error('No start node found in workflow');
      }

      execution.currentNodeId = startNode.id;
      this.addLogEntry(execution, startNode.id, 'start', 'Workflow started', 'success', 'Workflow execution initiated');
      console.log(`[WorkflowEngine] Found start node: ${startNode.id}`);

      // Execute workflow nodes in sequence
      let currentNodeId = startNode.id;
      let iterationCount = 0;
      const maxIterations = 100; // Prevent infinite loops
      
      while (currentNodeId && iterationCount < maxIterations) {
        iterationCount++;
        console.log(`[WorkflowEngine] Executing node: ${currentNodeId} (iteration ${iterationCount})`);
        
        const nextNodeId = await this.executeNode(
          currentNodeId,
          workflow,
          booking,
          execution,
          updateBookingStatus,
          sendNotification
        );
        
        if (!nextNodeId) {
          console.log(`[WorkflowEngine] No next node, workflow complete`);
          break;
        }
        currentNodeId = nextNodeId;
      }
      
      if (iterationCount >= maxIterations) {
        throw new Error('Workflow exceeded maximum iterations - possible infinite loop');
      }

      execution.status = 'completed';
      execution.completedAt = new Date().toISOString();
      this.addLogEntry(execution, 'end', 'end', 'Workflow completed', 'success', 'All nodes executed successfully');
      console.log(`[WorkflowEngine] Workflow completed successfully`);

    } catch (error) {
      execution.status = 'failed';
      execution.completedAt = new Date().toISOString();
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.addLogEntry(execution, execution.currentNodeId || 'unknown', 'error', 'Workflow failed', 'failure', errorMessage);
      console.error(`[WorkflowEngine] Workflow failed:`, error);
    }

    return execution;
  }

  /**
   * Execute a single node with real-time updates
   */
  private static async executeNodeWithUpdates(
    nodeId: string,
    workflow: WorkflowDefinition,
    booking: Booking,
    execution: WorkflowExecution,
    updateBookingStatus: (bookingId: string, status: BookingStatus, updatedBy: string, note?: string) => void,
    sendNotification: (bookingId: string, type: 'email' | 'sms', recipient: string, message: string, trigger: string) => void,
    onUpdate: (execution: WorkflowExecution) => void
  ): Promise<string | null> {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) {
      console.warn(`[WorkflowEngine] Node ${nodeId} not found`);
      return null;
    }

    console.log(`[WorkflowEngine] Executing ${node.type} node: ${nodeId}`);
    execution.currentNodeId = nodeId;

    // Add delay for visual effect
    await new Promise(resolve => setTimeout(resolve, 1500));

    switch (node.type) {
      case 'start':
        console.log(`[WorkflowEngine] Start node executed`);
        break;

      case 'status':
        const targetStatus = node.data.targetStatus as BookingStatus;
        console.log(`[WorkflowEngine] Changing status to: ${targetStatus}`);
        await new Promise(resolve => setTimeout(resolve, 800));
        updateBookingStatus(booking.id, targetStatus, 'workflow', `Automated status change by workflow: ${workflow.name}`);
        this.addLogEntry(execution, nodeId, 'status', `Changed status to ${targetStatus}`, 'success', `Status updated to ${targetStatus}`);
        onUpdate({ ...execution }); // Update UI after this step
        break;

      case 'notification':
        const notifType = node.data.notificationType as string;
        const message = node.data.message || `Update regarding your ${booking.facility} booking`;
        const recipient = booking.user.email || booking.user.name;
        
        console.log(`[WorkflowEngine] Sending ${notifType} notification to: ${recipient}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (notifType.includes('Email')) {
          sendNotification(booking.id, 'email', recipient, message, 'workflow');
        }
        if (notifType.includes('SMS')) {
          sendNotification(booking.id, 'sms', booking.user.phone || recipient, message, 'workflow');
        }
        this.addLogEntry(execution, nodeId, 'notification', 'Sent notification', 'success', `${notifType} sent to ${recipient}`);
        onUpdate({ ...execution }); // Update UI after this step
        break;

      case 'approval':
        console.log(`[WorkflowEngine] Approval node - auto-approved for demo`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.addLogEntry(execution, nodeId, 'approval', 'Approval required', 'success', `Waiting for ${node.data.approvalLevel} approval (auto-approved for demo)`);
        onUpdate({ ...execution }); // Update UI after this step
        break;

      case 'condition':
        console.log(`[WorkflowEngine] Condition evaluated: ${node.data.condition}`);
        await new Promise(resolve => setTimeout(resolve, 800));
        this.addLogEntry(execution, nodeId, 'condition', 'Condition evaluated', 'success', `Condition: ${node.data.condition}`);
        onUpdate({ ...execution }); // Update UI after this step
        break;

      case 'end':
        console.log(`[WorkflowEngine] End node reached`);
        return null;
    }

    // Find next node
    const edge = workflow.edges.find(e => e.source === nodeId);
    const nextNodeId = edge ? edge.target : null;
    console.log(`[WorkflowEngine] Next node: ${nextNodeId || 'none'}`);
    return nextNodeId;
  }

  /**
   * Execute a single node and return next node ID (legacy)
   */
  private static async executeNode(
    nodeId: string,
    workflow: WorkflowDefinition,
    booking: Booking,
    execution: WorkflowExecution,
    updateBookingStatus: (bookingId: string, status: BookingStatus, updatedBy: string, note?: string) => void,
    sendNotification: (bookingId: string, type: 'email' | 'sms', recipient: string, message: string, trigger: string) => void
  ): Promise<string | null> {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) {
      console.warn(`[WorkflowEngine] Node ${nodeId} not found`);
      return null;
    }

    console.log(`[WorkflowEngine] Executing ${node.type} node: ${nodeId}`);
    execution.currentNodeId = nodeId;

    // Add delay for visual effect (500ms per step)
    await new Promise(resolve => setTimeout(resolve, 800));

    switch (node.type) {
      case 'start':
        // Start nodes just pass through
        console.log(`[WorkflowEngine] Start node executed`);
        break;

      case 'status':
        // Change booking status
        const targetStatus = node.data.targetStatus as BookingStatus;
        console.log(`[WorkflowEngine] Changing status to: ${targetStatus}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        updateBookingStatus(booking.id, targetStatus, 'workflow', `Automated status change by workflow: ${workflow.name}`);
        this.addLogEntry(execution, nodeId, 'status', `Changed status to ${targetStatus}`, 'success', `Status updated to ${targetStatus}`);
        break;

      case 'notification':
        // Send notification
        const notifType = node.data.notificationType as string;
        const message = node.data.message || `Update regarding your ${booking.facility} booking`;
        const recipient = booking.user.email || booking.user.name;
        
        console.log(`[WorkflowEngine] Sending ${notifType} notification to: ${recipient}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (notifType.includes('Email')) {
          sendNotification(booking.id, 'email', recipient, message, 'workflow');
        }
        if (notifType.includes('SMS')) {
          sendNotification(booking.id, 'sms', booking.user.phone || recipient, message, 'workflow');
        }
        this.addLogEntry(execution, nodeId, 'notification', 'Sent notification', 'success', `${notifType} sent to ${recipient}`);
        break;

      case 'approval':
        // In a real system, this would wait for approval
        // For now, we auto-approve after logging
        console.log(`[WorkflowEngine] Approval node - auto-approved for demo`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.addLogEntry(execution, nodeId, 'approval', 'Approval required', 'success', `Waiting for ${node.data.approvalLevel} approval (auto-approved for demo)`);
        break;

      case 'condition':
        // Evaluate condition (simplified for demo)
        console.log(`[WorkflowEngine] Condition evaluated: ${node.data.condition}`);
        await new Promise(resolve => setTimeout(resolve, 400));
        this.addLogEntry(execution, nodeId, 'condition', 'Condition evaluated', 'success', `Condition: ${node.data.condition}`);
        break;

      case 'end':
        // End node - workflow complete
        console.log(`[WorkflowEngine] End node reached`);
        return null;
    }

    // Find next node
    const edge = workflow.edges.find(e => e.source === nodeId);
    const nextNodeId = edge ? edge.target : null;
    console.log(`[WorkflowEngine] Next node: ${nextNodeId || 'none'}`);
    return nextNodeId;
  }

  /**
   * Add log entry to execution
   */
  private static addLogEntry(
    execution: WorkflowExecution,
    nodeId: string,
    nodeType: string,
    action: string,
    result: 'success' | 'failure',
    details: string
  ) {
    execution.executionLog.push({
      nodeId,
      nodeType,
      timestamp: new Date().toISOString(),
      action,
      result,
      details,
    });
  }
}

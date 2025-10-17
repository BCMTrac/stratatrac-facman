import { WorkflowDefinition, Booking, WorkflowExecution, BookingStatus } from '../types';
import { WorkflowEngine } from './engine';

/**
 * Workflow Trigger Manager
 * Automatically triggers workflows based on booking events
 */
export class WorkflowTriggerManager {
  /**
   * Trigger workflows when a booking is created
   */
  static async onBookingCreated(
    booking: Booking,
    workflows: WorkflowDefinition[],
    updateBookingStatus: (bookingId: string, status: BookingStatus, updatedBy: string, note?: string) => void,
    sendNotification: (bookingId: string, type: 'email' | 'sms', recipient: string, message: string, trigger: string) => void,
    addWorkflowExecution: (execution: WorkflowExecution) => void
  ): Promise<void> {
    console.log(`[Workflow Trigger] Booking created: ${booking.id} for facility: ${booking.facility}`);
    
    // Find all active workflows assigned to this facility
    const applicableWorkflows = workflows.filter(wf => 
      wf.isActive && 
      (wf.assignedFacilities.length === 0 || wf.assignedFacilities.includes(booking.facility))
    );

    console.log(`[Workflow Trigger] Found ${applicableWorkflows.length} applicable workflows`);

    // Execute each applicable workflow
    for (const workflow of applicableWorkflows) {
      console.log(`[Workflow Trigger] Executing workflow: ${workflow.name}`);
      try {
        const execution = await WorkflowEngine.executeWorkflow(
          workflow,
          booking,
          updateBookingStatus,
          sendNotification
        );
        
        addWorkflowExecution(execution);
        console.log(`[Workflow Trigger] Workflow ${workflow.name} completed with status: ${execution.status}`);
      } catch (error) {
        console.error(`[Workflow Trigger] Error executing workflow ${workflow.name}:`, error);
      }
    }
  }

  /**
   * Trigger workflows when a booking status changes
   */
  static async onBookingStatusChanged(
    booking: Booking,
    oldStatus: BookingStatus,
    newStatus: BookingStatus,
    workflows: WorkflowDefinition[],
    updateBookingStatus: (bookingId: string, status: BookingStatus, updatedBy: string, note?: string) => void,
    sendNotification: (bookingId: string, type: 'email' | 'sms', recipient: string, message: string, trigger: string) => void,
    addWorkflowExecution: (execution: WorkflowExecution) => void
  ): Promise<void> {
    console.log(`[Workflow Trigger] Booking status changed: ${booking.id} from ${oldStatus} to ${newStatus}`);

    // Find workflows that trigger on status changes
    const applicableWorkflows = workflows.filter(wf => {
      if (!wf.isActive) return false;
      
      // Check if workflow is assigned to this facility
      const isFacilityMatch = wf.assignedFacilities.length === 0 || 
                             wf.assignedFacilities.includes(booking.facility);
      
      // Check if workflow has a condition node that matches the status change
      const hasStatusTrigger = wf.nodes.some(node => 
        node.type === 'condition' && 
        node.data.condition?.includes(newStatus)
      );

      return isFacilityMatch && hasStatusTrigger;
    });

    console.log(`[Workflow Trigger] Found ${applicableWorkflows.length} workflows for status change`);

    // Execute applicable workflows
    for (const workflow of applicableWorkflows) {
      console.log(`[Workflow Trigger] Executing workflow: ${workflow.name}`);
      try {
        const execution = await WorkflowEngine.executeWorkflow(
          workflow,
          booking,
          updateBookingStatus,
          sendNotification
        );
        
        addWorkflowExecution(execution);
        console.log(`[Workflow Trigger] Workflow ${workflow.name} completed`);
      } catch (error) {
        console.error(`[Workflow Trigger] Error executing workflow ${workflow.name}:`, error);
      }
    }
  }

  /**
   * Trigger workflows when a booking is approved/rejected
   */
  static async onBookingApprovalDecision(
    booking: Booking,
    decision: 'approved' | 'rejected',
    workflows: WorkflowDefinition[],
    updateBookingStatus: (bookingId: string, status: BookingStatus, updatedBy: string, note?: string) => void,
    sendNotification: (bookingId: string, type: 'email' | 'sms', recipient: string, message: string, trigger: string) => void,
    addWorkflowExecution: (execution: WorkflowExecution) => void
  ): Promise<void> {
    console.log(`[Workflow Trigger] Booking ${decision}: ${booking.id}`);

    // Find workflows that handle approval decisions
    const applicableWorkflows = workflows.filter(wf => 
      wf.isActive && 
      wf.nodes.some(node => node.type === 'approval') &&
      (wf.assignedFacilities.length === 0 || wf.assignedFacilities.includes(booking.facility))
    );

    console.log(`[Workflow Trigger] Found ${applicableWorkflows.length} approval workflows`);

    for (const workflow of applicableWorkflows) {
      console.log(`[Workflow Trigger] Executing workflow: ${workflow.name}`);
      try {
        const execution = await WorkflowEngine.executeWorkflow(
          workflow,
          booking,
          updateBookingStatus,
          sendNotification
        );
        
        addWorkflowExecution(execution);
        console.log(`[Workflow Trigger] Workflow ${workflow.name} completed`);
      } catch (error) {
        console.error(`[Workflow Trigger] Error executing workflow ${workflow.name}:`, error);
      }
    }
  }

  /**
   * Get all executions for a booking
   */
  static getExecutionsForBooking(
    bookingId: string,
    executions: WorkflowExecution[]
  ): WorkflowExecution[] {
    return executions.filter(exec => exec.bookingId === bookingId);
  }

  /**
   * Get execution statistics
   */
  static getExecutionStats(executions: WorkflowExecution[]) {
    return {
      total: executions.length,
      running: executions.filter(e => e.status === 'running').length,
      completed: executions.filter(e => e.status === 'completed').length,
      failed: executions.filter(e => e.status === 'failed').length,
    };
  }
}

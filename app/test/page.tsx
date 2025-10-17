'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle, XCircle, Loader2, Play, AlertTriangle, Clock, 
  RefreshCw, Bug, Lightbulb, Send, Copy, Download, Camera 
} from 'lucide-react';
import { workflowTemplates } from '@/lib/workflows/templates';
import { toast } from 'sonner';

interface TestResult {
  id: string;
  category: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning';
  message: string;
  duration?: number;
  details?: string;
}

interface BugReport {
  id: string;
  type: 'bug' | 'feature';
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reproducible: 'always' | 'sometimes' | 'rarely';
  environment: {
    browser: string;
    url: string;
    timestamp: string;
    user: string;
    testResults?: TestResult[];
  };
}

export default function TestPage() {
  const store = useAppStore();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Environment Detection
  const environment = process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || 'development';
  const isProduction = environment === 'production';
  const isPreview = environment === 'preview';
  const isDevelopment = environment === 'development';
  
  // Bug Report State
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [reportType, setReportType] = useState<'bug' | 'feature'>('bug');
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportCategory, setReportCategory] = useState('general');
  const [reportSeverity, setReportSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [reportReproducible, setReportReproducible] = useState<'always' | 'sometimes' | 'rarely'>('always');
  const [includeTestResults, setIncludeTestResults] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  
  // Load reports from localStorage on mount
  useEffect(() => {
    const savedReports = localStorage.getItem('stratatrac_reports');
    if (savedReports) {
      try {
        setBugReports(JSON.parse(savedReports));
      } catch (error) {
        console.error('Failed to load reports:', error);
      }
    }
  }, []);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runTest = async (
    id: string,
    category: string,
    name: string,
    testFn: () => Promise<{ passed: boolean; message: string; details?: string }>
  ): Promise<TestResult> => {
    const startTime = Date.now();
    setCurrentTest(name);

    try {
      const result = await testFn();
      const duration = Date.now() - startTime;

      return {
        id,
        category,
        name,
        status: result.passed ? 'passed' : 'failed',
        message: result.message,
        details: result.details,
        duration
      };
    } catch (error) {
      return {
        id,
        category,
        name,
        status: 'failed',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  };

  // ==================== ALL TESTS (Same as before) ====================
  const authTests: (() => Promise<TestResult>)[] = [
    () => runTest('auth-1', 'Authentication', 'User Login Status', async () => {
      await delay(200);
      if (store.currentUser) {
        return {
          passed: true,
          message: `✓ Logged in as ${store.currentUser.name}`,
          details: `Role: ${store.currentUser.role}, Email: ${store.currentUser.email}`
        };
      }
      return { passed: false, message: '✗ No user logged in' };
    }),

    () => runTest('auth-2', 'Authentication', 'User Role Validation', async () => {
      await delay(200);
      if (store.currentUser?.role) {
        const validRoles = ['bcmtrac', 'miduser', 'standard'];
        const isValid = validRoles.includes(store.currentUser.role);
        return {
          passed: isValid,
          message: isValid ? `✓ Valid role: ${store.currentUser.role}` : `✗ Invalid role`
        };
      }
      return { passed: false, message: '✗ No role assigned' };
    })
  ];

  const bookingTests: (() => Promise<TestResult>)[] = [
    () => runTest('booking-1', 'Bookings', 'Bookings Data Loaded', async () => {
      await delay(200);
      if (store.bookings.length > 0) {
        return {
          passed: true,
          message: `✓ ${store.bookings.length} bookings loaded`,
          details: `Pending: ${store.bookings.filter(b => b.status === 'pending').length}`
        };
      }
      return { passed: false, message: '✗ No bookings found' };
    }),

    () => runTest('booking-2', 'Bookings', 'Add Booking Function', async () => {
      await delay(200);
      return {
        passed: typeof store.addBooking === 'function',
        message: typeof store.addBooking === 'function' ? '✓ addBooking available' : '✗ Missing'
      };
    })
  ];

  const workflowTests: (() => Promise<TestResult>)[] = [
    () => runTest('workflow-1', 'Workflows', 'Workflow Store', async () => {
      await delay(200);
      if (Array.isArray(store.workflows)) {
        return {
          passed: true,
          message: `✓ ${store.workflows.length} workflows`,
          details: store.workflows.map(w => w.name).join(', ') || 'None'
        };
      }
      return { passed: false, message: '✗ Store missing' };
    }),

    () => runTest('workflow-2', 'Workflows', 'Execute Workflow Test', async () => {
      await delay(500);
      const workflow = store.workflows[0];
      const booking = store.bookings[0];

      if (!workflow || !booking) {
        return { passed: false, message: '✗ Missing workflow or booking' };
      }

      try {
        const beforeCount = store.workflowExecutions.length;
        store.executeWorkflow(workflow.id, booking.id);
        await delay(1500);
        
        const afterCount = store.workflowExecutions.length;
        if (afterCount > beforeCount) {
          return {
            passed: true,
            message: `✓ Workflow executed!`,
            details: `${workflow.name} on ${booking.facility}`
          };
        }
        return { passed: false, message: '✗ Execution failed' };
      } catch (error) {
        return { passed: false, message: `✗ Error: ${error}` };
      }
    })
  ];

  const allTestSuites = {
    'Authentication': authTests,
    'Bookings': bookingTests,
    'Workflows': workflowTests
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTests([]);
    setProgress(0);

    const allTests = Object.values(allTestSuites).flat();
    const totalTests = allTests.length;

    for (let i = 0; i < allTests.length; i++) {
      const result = await allTests[i]();
      setTests(prev => [...prev, result]);
      setProgress(((i + 1) / totalTests) * 100);
    }

    setCurrentTest('');
    setIsRunning(false);
  };

  // ==================== BUG REPORTING ====================
  const captureScreenshot = async () => {
    try {
      // Use html2canvas library if available, otherwise use basic capture
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Simple screenshot notification
      toast.success('Screenshot captured! (Note: Install html2canvas for full page capture)');
      
      // For now, just capture current URL and viewport info
      const screenshotData = {
        url: window.location.href,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      
      setScreenshot(JSON.stringify(screenshotData));
    } catch (error) {
      toast.error('Screenshot capture failed');
      console.error('Screenshot error:', error);
    }
  };

  const submitReport = async () => {
    if (!reportTitle || !reportDescription) {
      toast.error('Please fill in title and description');
      return;
    }

    const report: BugReport = {
      id: `${reportType}-${Date.now()}`,
      type: reportType,
      title: reportTitle,
      description: reportDescription,
      category: reportCategory,
      severity: reportSeverity,
      reproducible: reportReproducible,
      environment: {
        browser: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        user: store.currentUser?.email || 'anonymous',
        testResults: includeTestResults ? tests : undefined
      }
    };

    // Add screenshot data if captured
    if (screenshot) {
      (report.environment as any).screenshot = screenshot;
    }

    // Save to localStorage first
    const updatedReports = [report, ...bugReports];
    setBugReports(updatedReports);
    localStorage.setItem('stratatrac_reports', JSON.stringify(updatedReports));

    // Submit to GitHub
    toast.loading('Creating GitHub issue...');
    
    try {
      const response = await fetch('/api/github-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          <div>
            <div className="font-bold">{reportType === 'bug' ? 'Bug report' : 'Feature request'} submitted!</div>
            <div className="text-xs mt-1">GitHub Issue #{data.issueNumber} created</div>
          </div>,
          { duration: 5000 }
        );
        
        // Store GitHub issue URL in report
        report.id = `${report.id}-gh${data.issueNumber}`;
        (report as any).githubIssue = {
          url: data.issueUrl,
          number: data.issueNumber
        };
        
        // Update localStorage with GitHub info
        const reportsWithGithub = updatedReports.map(r => 
          r.id === report.id ? report : r
        );
        localStorage.setItem('stratatrac_reports', JSON.stringify(reportsWithGithub));
      } else {
        toast.error(
          <div>
            <div className="font-bold">Saved locally but GitHub failed</div>
            <div className="text-xs mt-1">{data.error || 'Check console for details'}</div>
          </div>,
          { duration: 5000 }
        );
        console.error('GitHub API error:', data);
      }
    } catch (error) {
      toast.error(
        <div>
          <div className="font-bold">Saved locally but GitHub failed</div>
          <div className="text-xs mt-1">Network error or GitHub not configured</div>
        </div>,
        { duration: 5000 }
      );
      console.error('Error submitting to GitHub:', error);
    }
    
    // Clear form
    setReportTitle('');
    setReportDescription('');
    setReportCategory('general');
    setReportSeverity('medium');
    setIncludeTestResults(false);
    setScreenshot(null);
  };

  const copyReportToClipboard = (report: BugReport) => {
    const markdown = `
# ${report.type === 'bug' ? '🐛 Bug Report' : '💡 Feature Request'}: ${report.title}

**Type:** ${report.type}
**Category:** ${report.category}
**Severity:** ${report.severity}
**Reproducible:** ${report.reproducible}

## Description
${report.description}

## Environment
- **Browser:** ${report.environment.browser}
- **URL:** ${report.environment.url}
- **Timestamp:** ${report.environment.timestamp}
- **User:** ${report.environment.user}

${report.environment.testResults ? `
## Test Results (${report.environment.testResults.length} tests)
${report.environment.testResults.map(t => `- [${t.status === 'passed' ? '✓' : '✗'}] ${t.category}: ${t.name} - ${t.message}`).join('\n')}
` : ''}
    `.trim();

    navigator.clipboard.writeText(markdown);
    toast.success('Report copied to clipboard!');
  };

  const downloadReport = (report: BugReport) => {
    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.type}-${report.id}.json`;
    a.click();
    toast.success('Report downloaded!');
  };

  const passedCount = tests.filter(t => t.status === 'passed').length;
  const failedCount = tests.filter(t => t.status === 'failed').length;

  const groupedTests = tests.reduce((acc, test) => {
    if (!acc[test.category]) acc[test.category] = [];
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, TestResult[]>);

  return (
    <div className="min-h-screen bg-[#001F3F] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Environment Banner */}
        <Card className={`border-none text-white ${
          isProduction ? 'bg-gradient-to-r from-red-600 to-red-700' :
          isPreview ? 'bg-gradient-to-r from-yellow-600 to-yellow-700' :
          'bg-gradient-to-r from-green-600 to-green-700'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6" />
                <div>
                  <div className="font-bold text-lg">
                    {isProduction && '🔴 PRODUCTION ENVIRONMENT'}
                    {isPreview && '🟡 PREVIEW/STAGING ENVIRONMENT'}
                    {isDevelopment && '🟢 DEVELOPMENT ENVIRONMENT'}
                  </div>
                  <div className="text-sm opacity-90">
                    {isProduction && 'Warning: This is the live production environment. Test carefully!'}
                    {isPreview && 'This is a preview deployment. Safe to test features.'}
                    {isDevelopment && 'Local development mode. All tests are safe to run.'}
                  </div>
                </div>
              </div>
              <Badge className="bg-white/20 text-white text-sm px-4 py-2">
                {environment.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-600 to-purple-700 border-none text-white">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <Play className="h-8 w-8" />
              StrataTrac Testing & Feedback Center
            </CardTitle>
            <p className="text-purple-100">Pre-Production Testing Suite • Bug Reporting • Feature Requests</p>
          </CardHeader>
        </Card>

        <Tabs defaultValue="testing" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#002850]/90 border border-[#00D9FF]/30">
            <TabsTrigger value="testing">🧪 Testing</TabsTrigger>
            <TabsTrigger value="report">📝 Report Issue</TabsTrigger>
            <TabsTrigger value="submitted">📋 Submitted Reports</TabsTrigger>
          </TabsList>

          {/* TESTING TAB */}
          <TabsContent value="testing" className="space-y-6">
            <Card className="bg-[#002850]/90 border border-[#00D9FF]/30">
              <CardContent className="p-6">
                <div className="grid grid-cols-[2fr_1fr] gap-6">
                  <div className="space-y-4">
                    <Button
                      onClick={runAllTests}
                      disabled={isRunning}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold h-12 px-8"
                    >
                      {isRunning ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Running Tests...
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Run All Tests ({Object.values(allTestSuites).flat().length})
                        </>
                      )}
                    </Button>

                    {isRunning && (
                      <div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-gray-400 mt-2">
                          {Math.round(progress)}% • {currentTest}
                        </p>
                      </div>
                    )}
                  </div>

                  {tests.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-green-900/20 border-green-500/30">
                        <CardContent className="p-4 text-center">
                          <div className="text-4xl font-bold text-green-400">{passedCount}</div>
                          <div className="text-sm text-gray-300">Passed</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-red-900/20 border-red-500/30">
                        <CardContent className="p-4 text-center">
                          <div className="text-4xl font-bold text-red-400">{failedCount}</div>
                          <div className="text-sm text-gray-300">Failed</div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            {Object.entries(groupedTests).map(([category, categoryTests]) => (
              <Card key={category} className="bg-[#002850]/90 border border-[#00D9FF]/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl">{category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categoryTests.map((test) => (
                    <div
                      key={test.id}
                      className={`p-4 rounded-lg border-2 ${
                        test.status === 'passed' ? 'bg-green-900/20 border-green-500/30' :
                        test.status === 'failed' ? 'bg-red-900/20 border-red-500/30' :
                        'bg-gray-900/20 border-gray-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {test.status === 'passed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {test.status === 'failed' && <XCircle className="h-5 w-5 text-red-500" />}
                          <div>
                            <div className="font-semibold text-white">{test.name}</div>
                            <div className="text-sm text-gray-300">{test.message}</div>
                            {test.details && (
                              <div className="text-xs text-gray-400 mt-1">{test.details}</div>
                            )}
                          </div>
                        </div>
                        {test.duration && (
                          <Badge variant="outline" className="text-xs">
                            {test.duration}ms
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* REPORT ISSUE TAB */}
          <TabsContent value="report" className="space-y-6">
            <Card className="bg-[#002850]/90 border border-[#00D9FF]/30">
              <CardHeader>
                <CardTitle className="text-white">Submit Bug Report or Feature Request</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Type</Label>
                    <Select value={reportType} onValueChange={(v: 'bug' | 'feature') => setReportType(v)}>
                      <SelectTrigger className="bg-[#001F3F] border-[#00D9FF]/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bug">
                          <span className="flex items-center gap-2">
                            <Bug className="h-4 w-4" /> Bug Report
                          </span>
                        </SelectItem>
                        <SelectItem value="feature">
                          <span className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" /> Feature Request
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Category</Label>
                    <Select value={reportCategory} onValueChange={setReportCategory}>
                      <SelectTrigger className="bg-[#001F3F] border-[#00D9FF]/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="authentication">Authentication</SelectItem>
                        <SelectItem value="bookings">Bookings</SelectItem>
                        <SelectItem value="workflows">Workflows</SelectItem>
                        <SelectItem value="facilities">Facilities</SelectItem>
                        <SelectItem value="ui">UI/UX</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {reportType === 'bug' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Severity</Label>
                      <Select value={reportSeverity} onValueChange={(v: any) => setReportSeverity(v)}>
                        <SelectTrigger className="bg-[#001F3F] border-[#00D9FF]/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Minor issue</SelectItem>
                          <SelectItem value="medium">Medium - Noticeable</SelectItem>
                          <SelectItem value="high">High - Major problem</SelectItem>
                          <SelectItem value="critical">Critical - Blocks usage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white">Reproducible</Label>
                      <Select value={reportReproducible} onValueChange={(v: any) => setReproducible(v)}>
                        <SelectTrigger className="bg-[#001F3F] border-[#00D9FF]/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="always">Always</SelectItem>
                          <SelectItem value="sometimes">Sometimes</SelectItem>
                          <SelectItem value="rarely">Rarely</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-white">Title</Label>
                  <Input
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder={reportType === 'bug' ? 'Brief description of the bug' : 'Brief description of the feature'}
                    className="bg-[#001F3F] border-[#00D9FF]/30 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white">Description</Label>
                  <Textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder={reportType === 'bug' 
                      ? 'Detailed description of the bug, steps to reproduce, expected vs actual behavior...'
                      : 'Detailed description of the feature, use case, benefits...'
                    }
                    rows={8}
                    className="bg-[#001F3F] border-[#00D9FF]/30 text-white"
                  />
                </div>

                {tests.length > 0 && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includeTests"
                      checked={includeTestResults}
                      onChange={(e) => setIncludeTestResults(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="includeTests" className="text-white text-sm">
                      Include test results ({tests.length} tests)
                    </Label>
                  </div>
                )}

                {/* Screenshot Capture */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={captureScreenshot}
                      variant="outline"
                      className="flex-1 border-[#00D9FF]/30 text-white hover:bg-[#00D9FF]/10"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Capture Screen Info
                    </Button>
                    {screenshot && (
                      <Button
                        type="button"
                        onClick={() => setScreenshot(null)}
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  {screenshot && (
                    <div className="p-2 bg-green-900/20 border border-green-500/30 rounded text-xs text-green-300">
                      ✓ Screen info captured (URL, viewport, timestamp)
                    </div>
                  )}
                </div>

                <Button
                  onClick={submitReport}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold h-12"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Submit {reportType === 'bug' ? 'Bug Report' : 'Feature Request'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SUBMITTED REPORTS TAB */}
          <TabsContent value="submitted" className="space-y-4">
            {bugReports.length === 0 ? (
              <Card className="bg-[#002850]/90 border border-[#00D9FF]/30">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-400">No reports submitted yet</p>
                </CardContent>
              </Card>
            ) : (
              bugReports.map(report => (
                <Card key={report.id} className="bg-[#002850]/90 border border-[#00D9FF]/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {report.type === 'bug' ? (
                          <Bug className="h-6 w-6 text-red-500" />
                        ) : (
                          <Lightbulb className="h-6 w-6 text-yellow-500" />
                        )}
                        <div>
                          <CardTitle className="text-white">{report.title}</CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge className={report.type === 'bug' ? 'bg-red-600' : 'bg-yellow-600'}>
                              {report.type}
                            </Badge>
                            <Badge variant="outline">{report.category}</Badge>
                            {report.type === 'bug' && (
                              <Badge className={
                                report.severity === 'critical' ? 'bg-red-700' :
                                report.severity === 'high' ? 'bg-orange-600' :
                                report.severity === 'medium' ? 'bg-yellow-600' :
                                'bg-gray-600'
                              }>
                                {report.severity}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyReportToClipboard(report)}
                          size="sm"
                          variant="outline"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => downloadReport(report)}
                          size="sm"
                          variant="outline"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{report.description}</p>
                    
                    {/* GitHub Issue Link */}
                    {(report as any).githubIssue && (
                      <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-green-300">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-semibold">GitHub Issue Created</span>
                        </div>
                        <a 
                          href={(report as any).githubIssue.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm mt-1 block underline"
                        >
                          View Issue #{(report as any).githubIssue.number} →
                        </a>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>Submitted: {new Date(report.environment.timestamp).toLocaleString()}</div>
                      <div>User: {report.environment.user}</div>
                      {report.environment.testResults && (
                        <div>
                          Test Results: {report.environment.testResults.filter(t => t.status === 'passed').length}/{report.environment.testResults.length} passed
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

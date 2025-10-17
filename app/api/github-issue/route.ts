import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const report = await request.json();

    // GitHub API configuration
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO; // Format: "owner/repo"

    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      return NextResponse.json(
        { error: 'GitHub integration not configured. Add GITHUB_TOKEN and GITHUB_REPO to environment variables.' },
        { status: 500 }
      );
    }

    // Create issue title
    const issueTitle = `${report.type === 'bug' ? '🐛' : '💡'} ${report.title}`;

    // Create issue body
    const issueBody = `
## ${report.type === 'bug' ? 'Bug Report' : 'Feature Request'}

**Category:** ${report.category}
${report.type === 'bug' ? `**Severity:** ${report.severity}` : ''}
${report.type === 'bug' ? `**Reproducible:** ${report.reproducible}` : ''}

---

## Description
${report.description}

---

## Environment
- **Browser:** ${report.environment.browser}
- **URL:** ${report.environment.url}
- **Timestamp:** ${report.environment.timestamp}
- **User:** ${report.environment.user}

${report.environment.screenshot ? `
## Screen Information
\`\`\`json
${report.environment.screenshot}
\`\`\`
` : ''}

${report.environment.testResults ? `
## Test Results
${report.environment.testResults.length} tests included
- Passed: ${report.environment.testResults.filter((t: any) => t.status === 'passed').length}
- Failed: ${report.environment.testResults.filter((t: any) => t.status === 'failed').length}

<details>
<summary>View Test Results</summary>

${report.environment.testResults.map((t: any) => `- [${t.status === 'passed' ? '✓' : '✗'}] ${t.category}: ${t.name} - ${t.message}`).join('\n')}

</details>
` : ''}

---

*Submitted via StrataTrac Testing Suite*
*Report ID: ${report.id}*
    `.trim();

    // Determine labels
    const labels = [
      report.type === 'bug' ? 'bug' : 'enhancement',
      report.category,
    ];

    if (report.type === 'bug') {
      if (report.severity === 'critical') labels.push('critical', 'priority: high');
      else if (report.severity === 'high') labels.push('priority: high');
      else if (report.severity === 'medium') labels.push('priority: medium');
      else labels.push('priority: low');
    }

    // Create GitHub issue
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: labels
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('GitHub API error:', error);
      return NextResponse.json(
        { error: 'Failed to create GitHub issue', details: error },
        { status: response.status }
      );
    }

    const issue = await response.json();

    return NextResponse.json({
      success: true,
      issueUrl: issue.html_url,
      issueNumber: issue.number
    });

  } catch (error) {
    console.error('Error creating GitHub issue:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

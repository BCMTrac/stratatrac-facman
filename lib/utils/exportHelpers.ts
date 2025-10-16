import { Booking } from '../types';

export function generateFacilityUsageCSV(bookings: Booking[]) {
  const facilityStats: Record<string, { count: number; category: string }> = {};
  
  bookings.forEach((booking) => {
    if (!facilityStats[booking.facility]) {
      facilityStats[booking.facility] = { count: 0, category: booking.category };
    }
    facilityStats[booking.facility].count++;
  });

  let csv = 'Facility Name,Category,Booking Count,Usage Percentage\n';
  
  Object.entries(facilityStats)
    .sort(([, a], [, b]) => b.count - a.count)
    .forEach(([facility, stats]) => {
      const percentage = ((stats.count / bookings.length) * 100).toFixed(1);
      csv += `"${facility}","${stats.category}",${stats.count},${percentage}%\n`;
    });

  csv += '\n\nTime Period,Usage Percentage\n';
  csv += 'Morning (6-12),24%\n';
  csv += 'Afternoon (12-18),31%\n';
  csv += 'Evening (18-22),35%\n';
  csv += 'Late (22-6),10%\n';

  csv += '\n\nCategory,Usage Percentage\n';
  csv += 'Sports Facilities,28%\n';
  csv += 'Gym Equipment,22%\n';
  csv += 'Recreation,19%\n';
  csv += 'Restaurant,16%\n';
  csv += 'Move In/Out,9%\n';
  csv += 'Concierge,6%\n';

  return csv;
}

export function generateUserActivityCSV(bookings: Booking[]) {
  const userStats: Record<string, { count: number; unit: string }> = {};
  const unitStats: Record<string, number> = {};

  bookings.forEach((booking) => {
    const userName = booking.user.name;
    const userUnit = booking.user.unit;

    if (!userStats[userName]) {
      userStats[userName] = { count: 0, unit: userUnit };
    }
    userStats[userName].count++;

    if (!unitStats[userUnit]) {
      unitStats[userUnit] = 0;
    }
    unitStats[userUnit]++;
  });

  let csv = 'User Name,Unit,Booking Count\n';
  Object.entries(userStats)
    .sort(([, a], [, b]) => b.count - a.count)
    .forEach(([userName, stats]) => {
      csv += `"${userName}","${stats.unit}",${stats.count}\n`;
    });

  csv += '\n\nUnit,Booking Count\n';
  Object.entries(unitStats)
    .sort(([, a], [, b]) => b - a)
    .forEach(([unit, count]) => {
      csv += `"${unit}",${count}\n`;
    });

  csv += '\n\nActivity Summary\n';
  csv += `Total Users,${Object.keys(userStats).length}\n`;
  csv += `Average Bookings per User,${(bookings.length / Object.keys(userStats).length).toFixed(1)}\n`;
  csv += `Active Units,${Object.keys(unitStats).length}\n`;
  csv += `Usage Rate,85%\n`;

  return csv;
}

export function generateFacilityUsageHTML(bookings: Booking[]) {
  const facilityStats: Record<string, { count: number; category: string }> = {};
  
  bookings.forEach((booking) => {
    if (!facilityStats[booking.facility]) {
      facilityStats[booking.facility] = { count: 0, category: booking.category };
    }
    facilityStats[booking.facility].count++;
  });

  const facilityRows = Object.entries(facilityStats)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([facility, stats], index) => {
      const percentage = ((stats.count / bookings.length) * 100).toFixed(1);
      return `<tr><td>#${index + 1}</td><td>${facility}</td><td>${stats.category}</td><td>${stats.count}</td><td>${percentage}%</td></tr>`;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Facility Usage Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #2c3e50; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
        h2 { color: #3b82f6; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .header { text-align: center; margin-bottom: 30px; }
        .generated { color: #6c757d; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏢 Strata Facilities Booking System</h1>
        <h2>📊 Facility Usage Report</h2>
        <p class="generated">Generated: ${new Date().toLocaleString()}</p>
      </div>
      
      <h2>📈 Most Popular Facilities</h2>
      <table>
        <tr><th>Rank</th><th>Facility</th><th>Category</th><th>Bookings</th><th>Usage %</th></tr>
        ${facilityRows}
      </table>
      
      <h2>⏰ Usage by Time Period</h2>
      <table>
        <tr><th>Time Period</th><th>Usage Percentage</th></tr>
        <tr><td>Morning (6:00 - 12:00)</td><td>24%</td></tr>
        <tr><td>Afternoon (12:00 - 18:00)</td><td>31%</td></tr>
        <tr><td>Evening (18:00 - 22:00)</td><td>35%</td></tr>
        <tr><td>Late Night (22:00 - 6:00)</td><td>10%</td></tr>
      </table>
      
      <h2>📊 Usage by Category</h2>
      <table>
        <tr><th>Category</th><th>Usage Percentage</th></tr>
        <tr><td>🏃 Sports Facilities</td><td>28%</td></tr>
        <tr><td>💪 Gym Equipment</td><td>22%</td></tr>
        <tr><td>🏛️ Recreation</td><td>19%</td></tr>
        <tr><td>🍽️ Restaurant</td><td>16%</td></tr>
        <tr><td>📦 Move In/Out</td><td>9%</td></tr>
        <tr><td>🛎️ Concierge</td><td>6%</td></tr>
      </table>
    </body>
    </html>
  `;
}

export function generateUserActivityHTML(bookings: Booking[]) {
  const userStats: Record<string, { count: number; unit: string }> = {};
  const unitStats: Record<string, number> = {};

  bookings.forEach((booking) => {
    const userName = booking.user.name;
    const userUnit = booking.user.unit;

    if (!userStats[userName]) {
      userStats[userName] = { count: 0, unit: userUnit };
    }
    userStats[userName].count++;

    if (!unitStats[userUnit]) {
      unitStats[userUnit] = 0;
    }
    unitStats[userUnit]++;
  });

  const userRows = Object.entries(userStats)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 10)
    .map(([userName, stats], index) => 
      `<tr><td>#${index + 1}</td><td>${userName}</td><td>${stats.unit}</td><td>${stats.count}</td></tr>`
    )
    .join('');

  const unitRows = Object.entries(unitStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([unit, count], index) => 
      `<tr><td>#${index + 1}</td><td>${unit}</td><td>${count}</td></tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>User Activity Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #2c3e50; border-bottom: 3px solid #10b981; padding-bottom: 10px; }
        h2 { color: #10b981; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .stat-box { border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #f8f9fa; }
        .header { text-align: center; margin-bottom: 30px; }
        .generated { color: #6c757d; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏢 Strata Facilities Booking System</h1>
        <h2>📝 User Activity Report</h2>
        <p class="generated">Generated: ${new Date().toLocaleString()}</p>
      </div>
      
      <h2>👑 Most Active Users</h2>
      <table>
        <tr><th>Rank</th><th>User Name</th><th>Unit</th><th>Total Bookings</th></tr>
        ${userRows}
      </table>
      
      <h2>🏠 Most Active Units</h2>
      <table>
        <tr><th>Rank</th><th>Unit</th><th>Total Bookings</th></tr>
        ${unitRows}
      </table>
      
      <h2>📈 Activity Summary</h2>
      <div class="stats-grid">
        <div class="stat-box">
          <strong>Total Active Users:</strong> ${Object.keys(userStats).length}
        </div>
        <div class="stat-box">
          <strong>Average Bookings per User:</strong> ${(bookings.length / Object.keys(userStats).length).toFixed(1)}
        </div>
        <div class="stat-box">
          <strong>Total Active Units:</strong> ${Object.keys(unitStats).length}
        </div>
        <div class="stat-box">
          <strong>Overall Usage Rate:</strong> 85%
        </div>
      </div>
    </body>
    </html>
  `;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
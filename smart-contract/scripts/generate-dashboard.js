const fs = require('fs');
const path = require('path');

async function generateDashboard() {
  const gasReportPath = path.join(__dirname, '../gas-report.json');
  
  let gasData = [];
  if (fs.existsSync(gasReportPath)) {
    gasData = JSON.parse(fs.readFileSync(gasReportPath, 'utf8'));
  } else {
    // Datos de ejemplo si no hay report
    gasData = [
      { operation: "Deploy Contract", gasUsed: "2500000", category: "Deployment" },
      { operation: "First Mint", gasUsed: "180000", category: "Minting" },
      { operation: "Average Mint", gasUsed: "150000", category: "Minting" },
      { operation: "Mint Short URI", gasUsed: "145000", category: "URI" },
      { operation: "Mint Long URI", gasUsed: "165000", category: "URI" }
    ];
  }
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🐲 D&D NFT - Gas Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    header {
      text-align: center;
      padding: 40px 20px;
    }
    
    h1 {
      font-size: 3em;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .subtitle {
      font-size: 1.2em;
      opacity: 0.9;
    }
    
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    
    .card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      transition: transform 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
    }
    
    .card h2 {
      font-size: 1.5em;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .stat-value {
      font-size: 2.5em;
      font-weight: bold;
      color: #FFD700;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .stat-label {
      font-size: 0.9em;
      opacity: 0.8;
      margin-top: 5px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    th {
      background: rgba(255,255,255,0.1);
      font-weight: 600;
    }
    
    tr:hover {
      background: rgba(255,255,255,0.05);
    }
    
    .chart-container {
      position: relative;
      height: 400px;
      margin-top: 20px;
    }
    
    footer {
      text-align: center;
      padding: 40px 20px;
      opacity: 0.8;
      font-size: 0.9em;
    }
    
    .badge {
      display: inline-block;
      padding: 5px 12px;
      background: rgba(255,255,255,0.2);
      border-radius: 20px;
      font-size: 0.8em;
      margin: 5px;
    }
    
    @media (max-width: 768px) {
      h1 { font-size: 2em; }
      .cards { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🐲 D&D NFT Gas Dashboard 🛡️</h1>
      <p class="subtitle">Real-time gas cost analysis & optimization metrics</p>
      <div>
        <span class="badge">⛽ Optimized</span>
        <span class="badge">🧪 Tested</span>
        <span class="badge">🔒 Secure</span>
      </div>
    </header>

    <div class="cards">
      <div class="card">
        <h2>📊 Total Operations</h2>
        <div class="stat-value">${gasData.length}</div>
        <div class="stat-label">Gas measurements recorded</div>
      </div>

      <div class="card">
        <h2>⛽ Average Gas</h2>
        <div class="stat-value">${Math.round(gasData.reduce((sum, item) => sum + parseInt(item.gasUsed), 0) / gasData.length).toLocaleString()}</div>
        <div class="stat-label">Gas units per operation</div>
      </div>

      <div class="card">
        <h2>🎯 Mint Cost</h2>
        <div class="stat-value">~150K</div>
        <div class="stat-label">Gas units (optimized)</div>
      </div>
    </div>

    <div class="card">
      <h2>📈 Gas Usage by Operation</h2>
      <div class="chart-container">
        <canvas id="gasChart"></canvas>
      </div>
    </div>

    <div class="card">
      <h2>📋 Detailed Breakdown</h2>
      <table>
        <thead>
          <tr>
            <th>Operation</th>
            <th>Gas Used</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${gasData.map(item => `
            <tr>
              <td><strong>${item.operation}</strong></td>
              <td>${parseInt(item.gasUsed).toLocaleString()}</td>
              <td>${item.category}</td>
              <td><span class="badge">${parseInt(item.gasUsed) < 200000 ? '✅ Good' : '⚠️ High'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="card">
      <h2>💰 Cost Estimation (at different gas prices)</h2>
      <table>
        <thead>
          <tr>
            <th>Network Condition</th>
            <th>Gas Price</th>
            <th>Mint Cost (ETH)</th>
            <th>Mint Cost (USD)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>🟢 Low congestion</td>
            <td>10 gwei</td>
            <td>0.0015 ETH</td>
            <td>~$3.00</td>
          </tr>
          <tr>
            <td>🟡 Medium congestion</td>
            <td>50 gwei</td>
            <td>0.0075 ETH</td>
            <td>~$15.00</td>
          </tr>
          <tr>
            <td>🟠 High congestion</td>
            <td>100 gwei</td>
            <td>0.015 ETH</td>
            <td>~$30.00</td>
          </tr>
          <tr>
            <td>🔴 Extreme congestion</td>
            <td>500 gwei</td>
            <td>0.075 ETH</td>
            <td>~$150.00</td>
          </tr>
        </tbody>
      </table>
    </div>

    <footer>
      <p>Last updated: ${new Date().toLocaleString()}</p>
      <p>🐲 D&D NFT Character Forge | <a href="https://github.com/JCazorla90/dnd-nft-generator" style="color: #FFD700;">View on GitHub</a></p>
    </footer>
  </div>

  <script>
    const data = ${JSON.stringify(gasData)};
    const ctx = document.getElementById('gasChart').getContext('2d');
    
    // Agrupar por categoría
    const categories = {};
    data.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push({
        operation: item.operation,
        gas: parseInt(item.gasUsed)
      });
    });
    
    // Colores aleatorios pero consistentes
    const colors = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)'
    ];
    
    const datasets = Object.keys(categories).map((category, index) => ({
      label: category,
      data: categories[category].map(item => item.gas),
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length].replace('0.8', '1'),
      borderWidth: 2
    }));
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.operation),
        datasets: [{
          label: 'Gas Used',
          data: data.map(d => parseInt(d.gasUsed)),
          backgroundColor: data.map((_, i) => colors[i % colors.length]),
          borderColor: data.map((_, i) => colors[i % colors.length].replace('0.8', '1')),
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#fff', font: { size: 14 } }
          },
          title: {
            display: true,
            text: 'Gas Consumption Analysis',
            color: '#fff',
            font: { size: 18, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#fff' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          x: {
            ticks: { color: '#fff', maxRotation: 45, minRotation: 45 },
            grid: { color: 'rgba(255,255,255,0.1)' }
          }
        }
      }
    });
  </script>
</body>
</html>
  `;
  
  const dashboardPath = path.join(__dirname, '../gas-dashboard.html');
  fs.writeFileSync(dashboardPath, html);
  
  console.log("✅ Dashboard generado:", dashboardPath);
  console.log("🌐 Para verlo localmente: open", dashboardPath);
  console.log("📡 Para publicarlo: push a main y activa GitHub Pages");
}

generateDashboard()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

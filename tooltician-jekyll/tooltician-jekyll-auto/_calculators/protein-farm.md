---
title: "Protein Farm Calculator"
layout: single
permalink: /calculators/protein-farm/
---

# 🏭 Protein Farm Calculator

<div class="calculator">
  <div class="input-group">
    <label for="farm-level">Farm Level (1-30):</label>
    <input type="number" id="farm-level" min="1" max="30" placeholder="25">
  </div>
  
  <div class="input-group">
    <label for="boost">Production Boost (%):</label>
    <input type="number" id="boost" min="0" max="500" placeholder="120">
  </div>
  
  <div class="input-group">
    <label for="hours">Time (hours):</label>
    <input type="number" id="hours" min="1" max="168" placeholder="24">
  </div>
  
  <button onclick="calculate()" class="btn btn--primary">🧮 Calculate</button>
  <button onclick="clear()" class="btn btn--secondary">🗑️ Clear</button>
  
  <div id="result" style="display:none;" class="result"></div>
</div>

<style>
.calculator {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.input-group {
  margin: 1.5rem 0;
}

.input-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 16px;
}

.input-group input:focus {
  border-color: #667eea;
  outline: none;
}

.btn {
  padding: 12px 24px;
  margin: 10px 5px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn--secondary {
  background: #6c757d;
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
}

.result {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
  font-weight: 600;
}

@media (prefers-color-scheme: dark) {
  .calculator {
    background: #2c3e50;
    color: #ecf0f1;
  }
  
  .input-group label {
    color: #ecf0f1;
  }
  
  .input-group input {
    background: #34495e;
    color: #ecf0f1;
    border-color: #4a5f7a;
  }
}
</style>

<script>
const rates = {
  1:50, 2:75, 3:100, 4:125, 5:150, 6:200, 7:250, 8:300, 9:350, 10:400,
  11:500, 12:600, 13:700, 14:800, 15:900, 16:1000, 17:1200, 18:1400, 
  19:1600, 20:1800, 21:2000, 22:2300, 23:2600, 24:2900, 25:3200,
  26:3600, 27:4000, 28:4500, 29:5000, 30:5500
};

function calculate() {
  const level = parseInt(document.getElementById('farm-level').value) || 0;
  const boost = parseFloat(document.getElementById('boost').value) || 0;
  const hours = parseFloat(document.getElementById('hours').value) || 0;
  
  if (!level || !hours) {
    alert('Please enter farm level and time duration');
    return;
  }
  
  const baseRate = rates[level] || 100;
  const boostedRate = baseRate * (1 + boost / 100);
  const total = boostedRate * hours;
  
  const efficiency = boost > 100 ? 'Excellent' : boost > 50 ? 'Good' : 'Standard';
  
  document.getElementById('result').innerHTML = `
    <h3>🎯 Production Results</h3>
    <p><strong>Base Rate:</strong> ${baseRate.toLocaleString()} protein/hour</p>
    <p><strong>Boosted Rate:</strong> ${Math.round(boostedRate).toLocaleString()} protein/hour</p>
    <p><strong>Total (${hours}h):</strong> ${Math.round(total).toLocaleString()} protein</p>
    <p><strong>Efficiency:</strong> ${efficiency}</p>
  `;
  
  document.getElementById('result').style.display = 'block';
}

function clear() {
  document.getElementById('farm-level').value = '';
  document.getElementById('boost').value = '';
  document.getElementById('hours').value = '';
  document.getElementById('result').style.display = 'none';
}
</script>

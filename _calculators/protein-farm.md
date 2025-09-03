---
layout: single
title: "Protein Farm Calculator"
permalink: /calculators/protein-farm/
---

    <div class="main-content">
      <div class="input-section">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Farm Configuration</h2>
          </div>

          {% include figure image_path="/assets/images/mip.png" alt="Immune Protein Progress" %}

          <!-- metric:form start -->
          <form id="proteinFarmForm" novalidate>
          <div class="target-section">
            <label for="targetAmount" class="control-label">Missing Immune Protein for Next Upgrade</label>
            <div class="control-description">
              Enter the amount shown in red letters on your progress bar. This
              represents how much immune protein you still need to collect for
              your next upgrade.
            </div>
            <input type="number" id="targetAmount" class="form-input" data-validate required
              placeholder="Enter the red number from your progress bar" min="1" aria-describedby="targetAmountError" />
            <div class="error-message" id="targetAmountError" aria-live="polite"></div>
          </div>

          <div class="farm-grid">
            <div class="farm-item" id="farm1-container">
              <label for="farm1" class="farm-name">Protein Farm I</label>
              <select id="farm1" class="form-select">
                <!-- Options populated by JavaScript -->
              </select>
              <div class="production-info" id="farm1-info"></div>
            </div>

            <div class="farm-item" id="farm2-container">
              <label for="farm2" class="farm-name">Protein Farm II</label>
              <select id="farm2" class="form-select">
                <option value="0">Not Built</option>
                <!-- Options populated by JavaScript -->
              </select>
              <div class="production-info" id="farm2-info"></div>
            </div>

            <div class="farm-item" id="farm3-container">
              <label for="farm3" class="farm-name">Protein Farm III</label>
              <select id="farm3" class="form-select">
                <option value="0">Not Built</option>
                <!-- Options populated by JavaScript -->
              </select>
              <div class="production-info" id="farm3-info"></div>
            </div>

            <div class="farm-item" id="farm4-container">
              <label for="farm4" class="farm-name">Protein Farm IV</label>
              <select id="farm4" class="form-select">
                <option value="0">Not Built</option>
                <!-- Options populated by JavaScript -->
              </select>
              <div class="production-info" id="farm4-info"></div>
            </div>

            <div class="farm-item" id="farm5-container">
              <label for="farm5" class="farm-name">Protein Farm V</label>
              <select id="farm5" class="form-select">
                <option value="0">Not Built</option>
                <!-- Options populated by JavaScript -->
              </select>
              <div class="production-info" id="farm5-info"></div>
            </div>
          </div>
          </form>
        </div>
      </div>

      <!-- metric:form completion -->
      <div class="results-section">
        <div class="results-panel">
          <div class="results-header">Production Analysis</div>
          <div class="results-content" id="results-content">
            <div class="empty-state">
              <div class="empty-state-icon">ðŸ“Š</div>
              <p>Configure your farms and enter target amount</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="disclaimer">
      <strong>Note:</strong> This calculation is based solely on protein farm
      production. The estimated time does not include proteins from mines,
      zombie hunting, events, or any other sources that could reduce the
      actual time required.
    </div>

  <div id="footer-placeholder"></div>

    <script src="../assets/js/validate.js?v=20250828" defer></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      attachValidation(document.getElementById('proteinFarmForm'));
    });
  </script>
  <script src="../assets/js/storage-utils.js?v=20250828" defer></script>
  <script src="../assets/js/script.js?v=20250828" defer></script>
  <script type="module" src="../assets/js/protein-calculator.js?v=20250828" defer></script>
  <script src="../assets/js/analytics.js?v=20250828" defer></script>



---
layout: single
title: "Tier 10 Research Calculator"
permalink: /calculators/t10-research/
---

    <div class="header">
      <h2>Tier 10 Research Calculator</h2>
      <p>
        Enter your current research levels, including those in progress, to
        see how many resources you still need to complete the remaining
        researches to unlock Tier 10 troops.
      </p>
      <div class="disclaimer">
        ⚠️ Please note that these values may not be exact. There is
        conflicting information online for these researches.
      </div>
    </div>

    <div class="tech-tree">
      <div class="tech-level tech-level-1">
        <div class="tech-node top-tier">
          <label for="adv-prot-lvl">Advanced Protection</label>
          <div class="select-container">
            <select name="adv-prot-lvl" id="adv-prot-lvl">
              <option value="0">Level 0</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
              <option value="5">Level 5</option>
              <option value="6">Level 6</option>
              <option value="7">Level 7</option>
              <option value="8">Level 8</option>
              <option value="9">Level 9</option>
              <option value="10">Level 10 (MAX)</option>
            </select>
          </div>
          <div class="results-container">
            <div id="advProtGoldResultDiv" class="resource-result gold-result"></div>
            <div id="advProtIronResultDiv" class="resource-result iron-result"></div>
            <div id="advProtBreadResultDiv" class="resource-result bread-result"></div>
            <div id="advProtValorResultDiv" class="resource-result valor-result"></div>
          </div>
        </div>
      </div>

      <div class="tech-level tech-level-2">
        <div class="tech-node">
          <label for="healthLvl">❤️ Health Boost III</label>
          <div class="select-container">
            <select name="healthLvl" id="healthLvl">
              <option value="0">Level 0</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
              <option value="5">Level 5</option>
              <option value="6">Level 6</option>
              <option value="7">Level 7</option>
              <option value="8">Level 8</option>
              <option value="9">Level 9</option>
              <option value="10">Level 10 (MAX)</option>
            </select>
          </div>
          <div class="results-container">
            <div id="healthGoldResultDiv" class="resource-result gold-result"></div>
            <div id="healthIronResultDiv" class="resource-result iron-result"></div>
            <div id="healthBreadResultDiv" class="resource-result bread-result"></div>
            <div id="healthValorResultDiv" class="resource-result valor-result"></div>
          </div>
        </div>

        <div class="tech-node">
          <label for="attackLvl">⚔️ Attack Boost III</label>
          <div class="select-container">
            <select name="attackLvl" id="attackLvl">
              <option value="0">Level 0</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
              <option value="5">Level 5</option>
              <option value="6">Level 6</option>
              <option value="7">Level 7</option>
              <option value="8">Level 8</option>
              <option value="9">Level 9</option>
              <option value="10">Level 10 (MAX)</option>
            </select>
          </div>
          <div class="results-container">
            <div id="attackGoldResultDiv" class="resource-result gold-result"></div>
            <div id="attackIronResultDiv" class="resource-result iron-result"></div>
            <div id="attackBreadResultDiv" class="resource-result bread-result"></div>
            <div id="attackValorResultDiv" class="resource-result valor-result"></div>
          </div>
        </div>

        <div class="tech-node">
          <label for="defenseLvl">🛡️ Defense Boost III</label>
          <div class="select-container">
            <select name="defenseLvl" id="defenseLvl">
              <option value="0">Level 0</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
              <option value="5">Level 5</option>
              <option value="6">Level 6</option>
              <option value="7">Level 7</option>
              <option value="8">Level 8</option>
              <option value="9">Level 9</option>
              <option value="10">Level 10 (MAX)</option>
            </select>
          </div>
          <div class="results-container">
            <div id="defenseGoldResultDiv" class="resource-result gold-result"></div>
            <div id="defenseIronResultDiv" class="resource-result iron-result"></div>
            <div id="defenseBreadResultDiv" class="resource-result bread-result"></div>
            <div id="defenseValorResultDiv" class="resource-result valor-result"></div>
          </div>
        </div>
      </div>
    </div>

    <button class="reset-button">
      <span class="icon">🔄</span>Reset All to Level 0
    </button>

    <div class="totals-section">
      <div class="totals-grid">
        <div class="total-item total-gold">
          <div class="total-label">💰 Total Gold Needed</div>
          <div class="total-value" id="totalGoldRemainingDiv">0</div>
        </div>
        <div class="total-item total-iron">
          <div class="total-label">⚙️ Total Iron Needed</div>
          <div class="total-value" id="totalIronRemainingDiv">0</div>
        </div>
        <div class="total-item total-bread">
          <div class="total-label">🍞 Total Bread Needed</div>
          <div class="total-value" id="totalBreadRemainingDiv">0</div>
        </div>
        <div class="total-item total-valor">
          <div class="total-label">🏆 Total Valor badges Needed</div>
          <div class="total-value" id="totalValorRemainingDiv">0</div>
        </div>
      </div>
    </div>

  <div id="footer-placeholder"></div>

    <script src="../assets/js/storage-utils.js?v=20250828" defer></script>
  <script src="../assets/js/script.js?v=20250828" defer></script>
  <script type="module" src="../assets/js/t10-calculator.js?v=20250828" defer></script>
  <script src="../assets/js/analytics.js?v=20250828" defer></script>



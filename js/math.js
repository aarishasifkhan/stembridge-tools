/* =========================================
   STEMBridge — Math Word Problem Translator
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("mathInput");
  const solveBtn = document.getElementById("mathSolve");
  const outputDiv = document.getElementById("mathOutput");

  // Example chips
  document.querySelectorAll(".math-chip").forEach((chip) => {
    chip.addEventListener("click", function () {
      input.value = this.dataset.prob;
      input.focus();
    });
  });

  solveBtn.addEventListener("click", function () {
    const prob = input.value.trim();
    if (!prob) {
      outputDiv.innerHTML = buildError("Please type a word problem first.");
      return;
    }
    solveBtn.innerHTML = '<span class="spinner"></span>Translating…';
    solveBtn.disabled = true;

    setTimeout(() => {
      outputDiv.innerHTML = translateProblem(prob);
      solveBtn.innerHTML = "🔢 Translate & Solve";
      solveBtn.disabled = false;
    }, 700);
  });

  // ---- Keyword detection and translation ----

  function translateProblem(text) {
    const t = text.toLowerCase();

    // Age problems
    if (
      matchAny(t, [
        "older",
        "younger",
        "years ago",
        "years from now",
        "age",
        "twice as old",
        "three times as old",
      ])
    ) {
      return solveAgeProblem(text);
    }
    // Ratio / fraction problems
    if (
      matchAny(t, [
        "ratio",
        "fraction",
        "proportion",
        "split",
        "divided in ratio",
        "parts",
      ])
    ) {
      return solveRatioProblem(text);
    }
    // Speed / distance / time
    if (
      matchAny(t, [
        "speed",
        "distance",
        "km/h",
        "mph",
        "travels",
        "drove",
        "walked",
        "journey",
        "km",
        "miles",
      ])
    ) {
      return solveSpeedWordProblem(text);
    }
    // Percentage
    if (
      matchAny(t, [
        "percent",
        "%",
        "discount",
        "profit",
        "loss",
        "increase",
        "decrease",
        "markup",
      ])
    ) {
      return solvePercentageProblem(text);
    }
    // Simple interest
    if (
      matchAny(t, [
        "interest",
        "principal",
        "rate",
        "per annum",
        "p.a.",
        "invested",
        "bank",
        "loan",
      ])
    ) {
      return solveInterestProblem(text);
    }
    // Average / mean
    if (matchAny(t, ["average", "mean", "total", "sum of"])) {
      return solveAverageProblem(text);
    }
    // Consecutive numbers
    if (
      matchAny(t, [
        "consecutive",
        "consecutive even",
        "consecutive odd",
        "next number",
      ])
    ) {
      return solveConsecutiveProblem(text);
    }
    // Generic number problems
    if (
      matchAny(t, [
        "number",
        "added",
        "subtract",
        "multiplied",
        "divided",
        "triple",
        "double",
        "twice",
        "thrice",
      ])
    ) {
      return solveNumberProblem(text);
    }

    return genericAnalysis(text);
  }

  function matchAny(text, keywords) {
    return keywords.some((k) => text.includes(k));
  }

  // Number extractor
  function extractNumbers(text) {
    const matches = text.match(/\d+(\.\d+)?/g);
    return matches ? matches.map(Number) : [];
  }

  // ---- Solvers ----

  function solveAgeProblem(text) {
    const nums = extractNumbers(text);
    const t = text.toLowerCase();

    let html = buildResult("Age Problem Detected");
    html += buildStep(
      1,
      "Read and identify the type",
      "This is an <strong>age problem</strong>. Age problems involve finding someone's current, past, or future age using algebra.",
    );
    html += buildStep(
      2,
      "Identify what you know",
      `Numbers found in the problem: <strong>${nums.join(", ")}</strong>. Look for keywords: "older", "younger", "years ago", "will be".`,
    );
    html += buildStep(
      3,
      "Set up variables",
      "Let x = the unknown age (or the younger person's age). Express every other age in terms of x.",
    );
    html += buildStep(
      4,
      "Translate keywords into math",
      `
      • "A is 5 years older than B" → A = B + 5<br>
      • "twice as old" → multiply by 2<br>
      • "10 years ago" → subtract 10 from their age<br>
      • "in 5 years" → add 5 to their age`,
    );
    html += buildStep(
      5,
      "Write and solve the equation",
      "Form an equation from the total or relationship given, then solve for x using simple algebra.",
    );
    html += buildStep(
      6,
      "Check your answer",
      "Plug x back into the original words of the problem. If all the ages satisfy every condition stated, your answer is correct.",
    );

    if (nums.length >= 2) {
      const a = nums[0],
        b = nums[1];
      const diff = Math.abs(a - b);
      html += `<div class="info-block tip" style="margin-top:16px"><span class="ib-icon">💡</span><p>With the numbers <strong>${a}</strong> and <strong>${b}</strong> from your problem: the difference in ages is <strong>${diff} years</strong>. Use this as a check once you solve for x.</p></div>`;
    }

    html += `<div class="info-block note"><span class="ib-icon">📌</span><p><strong>Example:</strong> "Sara is 3 times as old as Tom. In 6 years, she will be twice as old. Find their ages." → Let Tom = x. Sara = 3x. In 6 years: 3x + 6 = 2(x + 6) → 3x + 6 = 2x + 12 → x = 6. Tom is 6, Sara is 18.</p></div>`;
    return html;
  }

  function solveRatioProblem(text) {
    const nums = extractNumbers(text);
    const t = text.toLowerCase();

    let html = buildResult("Ratio / Proportion Problem Detected");
    html += buildStep(
      1,
      "Understand what a ratio means",
      "A ratio like 3:2 means for every 3 parts of the first quantity, there are 2 parts of the second. The total number of parts = 3 + 2 = 5.",
    );
    html += buildStep(
      2,
      "Find the ratio and total from the problem",
      `Numbers found: <strong>${nums.join(", ")}</strong>. Identify the ratio (e.g. 3:2) and the total amount to be split.`,
    );
    html += buildStep(
      3,
      "Calculate the value of one part",
      "Value of 1 part = Total ÷ (sum of ratio parts). For example: 500 ÷ 5 = 100 per part.",
    );
    html += buildStep(
      4,
      "Multiply to find each share",
      "First share = ratio₁ × value of 1 part. Second share = ratio₂ × value of 1 part.",
    );
    html += buildStep(
      5,
      "Verify",
      "Add all the shares together. They must equal the original total.",
    );

    if (nums.length >= 3) {
      const total = nums[nums.length - 1];
      const r1 = nums[0],
        r2 = nums[1];
      const parts = r1 + r2;
      const oneP = parseFloat((total / parts).toFixed(2));
      const share1 = parseFloat((r1 * oneP).toFixed(2));
      const share2 = parseFloat((r2 * oneP).toFixed(2));
      html += `<div class="info-block tip"><span class="ib-icon">🔢</span><p>Using ratio <strong>${r1}:${r2}</strong> and total <strong>${total}</strong>: 1 part = ${total} ÷ ${parts} = <strong>${oneP}</strong>. Share 1 = ${r1} × ${oneP} = <strong>${share1}</strong>. Share 2 = ${r2} × ${oneP} = <strong>${share2}</strong>. Check: ${share1} + ${share2} = ${share1 + share2} ✅</p></div>`;
    }
    return html;
  }

  function solveSpeedWordProblem(text) {
    const nums = extractNumbers(text);
    let html = buildResult("Speed / Distance / Time Problem Detected");

    html += buildStep(
      1,
      "The golden triangle",
      "Remember the SDT triangle: <strong>Speed = Distance ÷ Time</strong>. Cover what you want to find to get the formula.",
    );
    html += buildStep(
      2,
      "Identify the three values",
      `Numbers from the problem: <strong>${nums.join(", ")}</strong>. Label each one — is it a speed, distance, or time?`,
    );
    html += buildStep(
      3,
      "Watch your units",
      "Speed in km/h → time must be in hours, distance in km. Speed in m/s → time in seconds, distance in metres. If units differ, convert first.",
    );
    html += buildStep(
      4,
      "Apply the correct formula",
      `
      • Find Speed: S = D ÷ T<br>
      • Find Distance: D = S × T<br>
      • Find Time: T = D ÷ S`,
    );
    html += buildStep(
      5,
      "Solve and state the units in your answer",
      "Always include the unit (km/h, m/s, hours, km) in your final answer. Examiners award marks for units!",
    );

    if (nums.length >= 2) {
      const a = nums[0],
        b = nums[1];
      html += `<div class="info-block tip"><span class="ib-icon">💡</span><p>With <strong>${a}</strong> and <strong>${b}</strong>: if these are speed and time → distance = ${parseFloat((a * b).toFixed(3))}. If distance and time → speed = ${parseFloat((a / b).toFixed(3))}. Match the correct formula to your problem.</p></div>`;
    }

    html += `<div class="info-block note"><span class="ib-icon">📌</span><p><strong>Classic example:</strong> "A car travels 180 km in 3 hours. Find its speed." → Speed = 180 ÷ 3 = <strong>60 km/h</strong>.</p></div>`;
    return html;
  }

  function solvePercentageProblem(text) {
    const nums = extractNumbers(text);
    const t = text.toLowerCase();

    let html = buildResult("Percentage Problem Detected");
    html += buildStep(
      1,
      "The core percentage formula",
      "Percentage = (Part ÷ Whole) × 100. Or: Part = (Percentage ÷ 100) × Whole.",
    );
    html += buildStep(
      2,
      "Identify which type",
      `
      • <strong>Find % of a number:</strong> e.g. 20% of 50 = (20/100) × 50 = 10<br>
      • <strong>Find % one number is of another:</strong> (Part ÷ Whole) × 100<br>
      • <strong>Percentage increase:</strong> (Increase ÷ Original) × 100<br>
      • <strong>Percentage decrease / discount:</strong> Subtract the % from 100%, then multiply`,
    );
    html += buildStep(
      3,
      "Substitute your values",
      `Numbers from the problem: <strong>${nums.join(", ")}</strong>. Identify which is the percentage, which is the part, and which is the whole.`,
    );
    html += buildStep(
      4,
      "Calculate step by step",
      "Divide first, then multiply. Avoid rounding until the very last step.",
    );
    html += buildStep(
      5,
      "Check the reasonableness",
      "50% of anything is half. 25% is a quarter. 10% is just dividing by 10. Use these to sanity-check your answer.",
    );

    if (nums.length >= 2) {
      const pct = nums.find((n) => n <= 100) || nums[0];
      const whole = nums.find((n) => n !== pct) || nums[1];
      const result = parseFloat(((pct / 100) * whole).toFixed(2));
      html += `<div class="info-block tip"><span class="ib-icon">🔢</span><p><strong>${pct}%</strong> of <strong>${whole}</strong> = (${pct} ÷ 100) × ${whole} = <strong>${result}</strong></p></div>`;
    }
    return html;
  }

  function solveInterestProblem(text) {
    const nums = extractNumbers(text);
    let html = buildResult("Simple Interest Problem Detected");

    html += buildStep(
      1,
      "The Simple Interest formula",
      "<strong>SI = (P × R × T) ÷ 100</strong><br>P = Principal (starting amount), R = Rate (% per year), T = Time (years)",
    );
    html += buildStep(2, "Total amount formula", "Total Amount = P + SI");
    html += buildStep(
      3,
      "Identify your values",
      `Numbers found: <strong>${nums.join(", ")}</strong>. Which is the principal? Which is the rate? Which is the time in years?`,
    );
    html += buildStep(
      4,
      "Substitute and calculate",
      "Plug your numbers into SI = (P × R × T) ÷ 100. Do the multiplication on top first, then divide by 100.",
    );
    html += buildStep(
      5,
      "State the answer clearly",
      "The question might ask for interest earned, total amount, or the rate. Make sure you answer what was actually asked.",
    );

    if (nums.length >= 3) {
      const p = nums[0],
        r = nums[1],
        t = nums[2];
      const si = parseFloat(((p * r * t) / 100).toFixed(2));
      const total = parseFloat((p + si).toFixed(2));
      html += `<div class="info-block tip"><span class="ib-icon">🔢</span><p>Using P=<strong>${p}</strong>, R=<strong>${r}%</strong>, T=<strong>${t} years</strong>: SI = (${p} × ${r} × ${t}) ÷ 100 = <strong>${si}</strong>. Total = ${p} + ${si} = <strong>${total}</strong></p></div>`;
    }
    return html;
  }

  function solveAverageProblem(text) {
    const nums = extractNumbers(text);
    let html = buildResult("Average / Mean Problem Detected");

    html += buildStep(
      1,
      "What is an average?",
      "The average (mean) = Sum of all values ÷ Number of values. It gives a single number that represents the whole group.",
    );
    html += buildStep(
      2,
      "Identify all the values",
      `Numbers in the problem: <strong>${nums.join(", ")}</strong>. Count how many individual values there are.`,
    );

    if (nums.length >= 2) {
      const sum = nums.reduce((a, b) => a + b, 0);
      const avg = parseFloat((sum / nums.length).toFixed(4));
      html += buildStep(
        3,
        "Add all values",
        `${nums.join(" + ")} = <strong>${sum}</strong>`,
      );
      html += buildStep(
        4,
        "Divide by count",
        `Average = ${sum} ÷ ${nums.length} = <strong>${avg}</strong>`,
      );
      html += buildStep(
        5,
        "Interpret",
        `The average of the numbers in your problem is <strong>${avg}</strong>. If the problem asks for a missing value given the average, rearrange: Missing value = (Average × Count) − Sum of known values.`,
      );
    } else {
      html += buildStep(
        3,
        "Apply the formula",
        "Average = Sum ÷ Count. List all values, add them, then divide by how many there are.",
      );
    }
    return html;
  }

  function solveConsecutiveProblem(text) {
    const nums = extractNumbers(text);
    let html = buildResult("Consecutive Numbers Problem Detected");

    html += buildStep(
      1,
      "What are consecutive numbers?",
      "Consecutive integers follow one after another: n, n+1, n+2, ... Consecutive even numbers: n, n+2, n+4, ... Consecutive odd numbers: n, n+2, n+4, ... (same pattern, just starting from an odd number).",
    );
    html += buildStep(
      2,
      "Set up the variable",
      "Let the first number = n. Write the others in terms of n: n, (n+1), (n+2) for regular; n, (n+2), (n+4) for even/odd.",
    );
    html += buildStep(
      3,
      "Use the given condition",
      `If the problem gives a sum: e.g. sum of 3 consecutive numbers = ${nums[0] || "?"} → n + (n+1) + (n+2) = ${nums[0] || "?"} → 3n + 3 = ${nums[0] || "?"}`,
    );
    html += buildStep(
      4,
      "Solve for n",
      `Simplify and isolate n. Then find the other numbers by substituting back.`,
    );
    html += buildStep(
      5,
      "Verify",
      "Check that your numbers are actually consecutive AND satisfy the original condition.",
    );

    if (nums.length >= 1) {
      const total = nums[0];
      const n = Math.round((total - 3) / 3);
      if (Number.isInteger((total - 3) / 3) && (total - 3) % 3 === 0) {
        html += `<div class="info-block tip"><span class="ib-icon">🔢</span><p>If the sum of 3 consecutive integers is <strong>${total}</strong>: n = (${total} − 3) ÷ 3 = <strong>${n}</strong>. The numbers are <strong>${n}, ${n + 1}, ${n + 2}</strong>. Check: ${n}+${n + 1}+${n + 2} = ${n + (n + 1) + (n + 2)} ✅</p></div>`;
      }
    }
    return html;
  }

  function solveNumberProblem(text) {
    const nums = extractNumbers(text);
    const t = text.toLowerCase();
    let html = buildResult("Number Problem Detected");

    html += buildStep(
      1,
      "Translate words into math operations",
      `
      • "added to" or "sum of" → +<br>
      • "subtracted from" or "less than" → −<br>
      • "product of" or "times" → ×<br>
      • "quotient of" or "divided by" → ÷<br>
      • "double" or "twice" → × 2<br>
      • "triple" or "thrice" → × 3<br>
      • "is" or "equals" → =`,
    );
    html += buildStep(
      2,
      "Assign a variable",
      "Let the unknown number = x (or n). If there are two unknowns, express one in terms of the other.",
    );
    html += buildStep(
      3,
      "Build the equation",
      `Using the numbers <strong>${nums.join(", ")}</strong> and the operations from Step 1, write a single equation.`,
    );
    html += buildStep(
      4,
      "Solve the equation",
      "Move all terms with x to one side and numbers to the other. Divide by the coefficient of x at the end.",
    );
    html += buildStep(
      5,
      "Verify",
      "Substitute your answer back into the original problem phrased in words. If every sentence holds true, your answer is correct.",
    );

    html += `<div class="info-block note"><span class="ib-icon">📌</span><p><strong>Example:</strong> "A number doubled and then increased by 7 equals 23. Find the number." → 2x + 7 = 23 → 2x = 16 → x = <strong>8</strong>. Check: 2(8) + 7 = 23 ✅</p></div>`;
    return html;
  }

  function genericAnalysis(text) {
    const nums = extractNumbers(text);
    let html = buildResult("Word Problem Analysis");

    html += buildStep(
      1,
      "Read the problem carefully — twice",
      "The first read gives you the big picture. The second read is where you pick out the numbers, unknowns, and what the question is actually asking.",
    );
    html += buildStep(
      2,
      "Highlight key information",
      `Numbers found in your problem: <strong>${nums.length > 0 ? nums.join(", ") : "none yet — check your spelling"}</strong>. Underline every number and circle what you need to find.`,
    );
    html += buildStep(
      3,
      "Translate keywords into operations",
      `
      "total", "altogether", "combined" → Addition (+)<br>
      "difference", "less", "fewer" → Subtraction (−)<br>
      "each", "per", "times" → Multiplication (×)<br>
      "shared equally", "per person" → Division (÷)`,
    );
    html += buildStep(
      4,
      "Write the equation",
      "Once you know the operation and values, write a clear equation. One equation for simple problems; a system of equations for two unknowns.",
    );
    html += buildStep(
      5,
      "Solve and check",
      "Solve step by step. Then re-read the original question — check your answer actually matches what was asked, not what you assumed.",
    );

    html += `<div class="info-block tip"><span class="ib-icon">💡</span><p>For best results, try a specific problem type — for example, type an age problem, ratio problem, speed problem, or interest problem. Our tool will give you a detailed step-by-step breakdown!</p></div>`;
    return html;
  }
});

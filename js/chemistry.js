/* =========================================
   STEMBridge — Chemical Equation Balancer
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("chemInput");
  const solveBtn = document.getElementById("chemSolve");
  const outputDiv = document.getElementById("chemOutput");

  // Example equations
  document.querySelectorAll(".example-chip").forEach((chip) => {
    chip.addEventListener("click", function () {
      input.value = this.dataset.eq;
      input.focus();
    });
  });

  solveBtn.addEventListener("click", function () {
    const eq = input.value.trim();
    if (!eq) {
      outputDiv.innerHTML = buildError(
        "Please type a chemical equation first.",
      );
      return;
    }

    solveBtn.innerHTML = '<span class="spinner"></span>Balancing…';
    solveBtn.disabled = true;

    setTimeout(() => {
      const result = balanceEquation(eq);
      outputDiv.innerHTML = result;
      solveBtn.innerHTML = "⚗️ Balance It";
      solveBtn.disabled = false;
    }, 700);
  });

  // ---- Known equations library ----
  // Format: { reactants, products, explanation, law, tip }
  const knownEquations = [
    {
      patterns: ["h2 + o2", "hydrogen + oxygen"],
      balanced: "2H₂ + O₂ → 2H₂O",
      reactants: { H: 4, O: 2 },
      products: { H: 4, O: 2 },
      steps: [
        {
          title: "Write the skeleton equation",
          content: "H₂ + O₂ → H₂O  (this is unbalanced)",
        },
        {
          title: "Count atoms on each side (before balancing)",
          content:
            "Left: H = 2, O = 2 &nbsp;|&nbsp; Right: H = 2, O = 1 — oxygen is unbalanced",
        },
        {
          title: "Balance oxygen first",
          content: "Put a 2 in front of H₂O → H₂ + O₂ → <strong>2</strong>H₂O",
        },
        {
          title: "Now balance hydrogen",
          content:
            "Right side now has 4 H, so put a 2 in front of H₂ → <strong>2</strong>H₂ + O₂ → 2H₂O",
        },
        {
          title: "Verify atom count",
          content:
            "Left: H = 4, O = 2 &nbsp;|&nbsp; Right: H = 4, O = 2 ✅ Balanced!",
        },
      ],
      law: "The Law of Conservation of Mass says atoms are never created or destroyed in a chemical reaction — you just rearrange them.",
      tip: "Balance metals first, then non-metals, and leave hydrogen and oxygen for last.",
      type: "Synthesis (Combination) Reaction",
    },
    {
      patterns: ["ch4 + o2", "methane + oxygen", "methane combustion"],
      balanced: "CH₄ + 2O₂ → CO₂ + 2H₂O",
      reactants: { C: 1, H: 4, O: 4 },
      products: { C: 1, H: 4, O: 4 },
      steps: [
        { title: "Skeleton equation", content: "CH₄ + O₂ → CO₂ + H₂O" },
        {
          title: "Balance carbon",
          content: "C is already balanced (1 on each side). ✅",
        },
        {
          title: "Balance hydrogen",
          content:
            "Left has 4 H. Right has 2 H in H₂O → put 2 in front of H₂O: CH₄ + O₂ → CO₂ + <strong>2</strong>H₂O",
        },
        {
          title: "Balance oxygen",
          content:
            "Right now has CO₂(2) + 2H₂O(2) = 4 oxygen atoms. Put 2 in front of O₂: CH₄ + <strong>2</strong>O₂ → CO₂ + 2H₂O",
        },
        {
          title: "Verify",
          content:
            "Left: C=1, H=4, O=4 &nbsp;|&nbsp; Right: C=1, H=4, O=4 ✅ Balanced!",
        },
      ],
      law: "This is a combustion reaction. Methane (natural gas) burns in oxygen to produce carbon dioxide and water vapour.",
      tip: "In combustion reactions always balance C first, then H, and finally O.",
      type: "Combustion Reaction",
    },
    {
      patterns: ["c3h8 + o2", "propane + oxygen", "propane combustion"],
      balanced: "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O",
      reactants: { C: 3, H: 8, O: 10 },
      products: { C: 3, H: 8, O: 10 },
      steps: [
        { title: "Skeleton equation", content: "C₃H₈ + O₂ → CO₂ + H₂O" },
        {
          title: "Balance carbon",
          content:
            "3 carbons on left → put 3 in front of CO₂: C₃H₈ + O₂ → <strong>3</strong>CO₂ + H₂O",
        },
        {
          title: "Balance hydrogen",
          content:
            "8 H on left → put 4 in front of H₂O: C₃H₈ + O₂ → 3CO₂ + <strong>4</strong>H₂O",
        },
        {
          title: "Balance oxygen",
          content:
            "Right: 3×2 + 4×1 = 10 O atoms → put 5 in front of O₂: C₃H₈ + <strong>5</strong>O₂ → 3CO₂ + 4H₂O",
        },
        {
          title: "Verify",
          content:
            "Left: C=3, H=8, O=10 &nbsp;|&nbsp; Right: C=3, H=8, O=10 ✅",
        },
      ],
      law: "Propane is a common fuel used in gas stoves and BBQ grills. This balanced equation shows exactly how much oxygen it needs to burn cleanly.",
      tip: "For any hydrocarbon combustion: balance C, then H, then O every time.",
      type: "Combustion Reaction",
    },
    {
      patterns: [
        "naoh + hcl",
        "sodium hydroxide + hydrochloric acid",
        "neutralization",
      ],
      balanced: "NaOH + HCl → NaCl + H₂O",
      reactants: { Na: 1, O: 1, H: 2, Cl: 1 },
      products: { Na: 1, O: 1, H: 2, Cl: 1 },
      steps: [
        {
          title: "Identify reaction type",
          content:
            "This is an acid-base (neutralisation) reaction. NaOH is the base, HCl is the acid.",
        },
        { title: "Skeleton equation", content: "NaOH + HCl → NaCl + H₂O" },
        {
          title: "Count all atoms",
          content:
            "Left: Na=1, O=1, H=2, Cl=1 &nbsp;|&nbsp; Right: Na=1, Cl=1, H=2, O=1",
        },
        {
          title: "Check balance",
          content: "All atoms match — the equation is already balanced! ✅",
        },
        {
          title: "Interpret",
          content:
            "Sodium hydroxide (a strong base) reacts with hydrochloric acid to form ordinary table salt (NaCl) and water. This is why acids and bases cancel each other out.",
        },
      ],
      law: "Acid + Base → Salt + Water is the general rule for neutralisation reactions.",
      tip: "Many acid-base reactions are already balanced 1:1. Always check before adding coefficients.",
      type: "Neutralisation Reaction",
    },
    {
      patterns: ["fe + o2", "iron + oxygen", "iron rusting", "rusting of iron"],
      balanced: "4Fe + 3O₂ → 2Fe₂O₃",
      reactants: { Fe: 4, O: 6 },
      products: { Fe: 4, O: 6 },
      steps: [
        {
          title: "Skeleton equation",
          content: "Fe + O₂ → Fe₂O₃  (iron oxide — rust)",
        },
        {
          title: "Balance iron",
          content:
            "Right has 2 Fe. Put 2 in front of Fe: <strong>2</strong>Fe + O₂ → Fe₂O₃",
        },
        {
          title: "Balance oxygen",
          content:
            "Right has 3 O (odd number). Use the LCM trick: LCM of 2 and 3 is 6. Put 3 in front of O₂ and 2 in front of Fe₂O₃",
        },
        {
          title: "Rebalance iron",
          content:
            "2 Fe₂O₃ means 4 iron on right → put 4 in front of Fe: <strong>4</strong>Fe + <strong>3</strong>O₂ → <strong>2</strong>Fe₂O₃",
        },
        {
          title: "Verify",
          content:
            "Left: Fe=4, O=6 &nbsp;|&nbsp; Right: Fe=4, O=6 ✅ Balanced!",
        },
      ],
      law: "This is the rusting reaction. Iron reacts slowly with oxygen from air to form iron(III) oxide — what we call rust.",
      tip: "When you have an odd number of atoms on one side, try multiplying both sides to get even numbers. The LCM method works well here.",
      type: "Oxidation Reaction",
    },
    {
      patterns: [
        "n2 + h2",
        "nitrogen + hydrogen",
        "haber process",
        "ammonia synthesis",
      ],
      balanced: "N₂ + 3H₂ → 2NH₃",
      reactants: { N: 2, H: 6 },
      products: { N: 2, H: 6 },
      steps: [
        { title: "Skeleton equation", content: "N₂ + H₂ → NH₃  (ammonia)" },
        {
          title: "Balance nitrogen",
          content:
            "Left: N=2. Right has 1 N in NH₃. Put 2 in front of NH₃: N₂ + H₂ → <strong>2</strong>NH₃",
        },
        {
          title: "Balance hydrogen",
          content:
            "2NH₃ has 6 H. So put 3 in front of H₂: N₂ + <strong>3</strong>H₂ → 2NH₃",
        },
        {
          title: "Verify",
          content: "Left: N=2, H=6 &nbsp;|&nbsp; Right: N=2, H=6 ✅ Balanced!",
        },
      ],
      law: "This is the Haber process — one of the most important industrial reactions in the world. It makes ammonia (NH₃) for fertilisers, which helps grow food for billions of people.",
      tip: "Start with the element that appears in the fewest compounds — nitrogen appears only in N₂ and NH₃, so start there.",
      type: "Synthesis Reaction (Haber Process)",
    },
    {
      patterns: [
        "h2so4 + naoh",
        "sulphuric acid + sodium hydroxide",
        "sulfuric acid + sodium hydroxide",
      ],
      balanced: "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O",
      reactants: { H: 4, S: 1, O: 6, Na: 2 },
      products: { H: 4, S: 1, O: 6, Na: 2 },
      steps: [
        {
          title: "Identify the reaction",
          content:
            "Sulphuric acid (diprotic — gives 2 H⁺ ions) reacts with sodium hydroxide (gives 1 OH⁻ ion each).",
        },
        { title: "Skeleton equation", content: "H₂SO₄ + NaOH → Na₂SO₄ + H₂O" },
        {
          title: "Balance sodium (Na)",
          content:
            "Right has 2 Na in Na₂SO₄. Put 2 in front of NaOH: H₂SO₄ + <strong>2</strong>NaOH → Na₂SO₄ + H₂O",
        },
        {
          title: "Balance hydrogen and oxygen",
          content:
            "2NaOH brings 2 OH groups + H₂SO₄ has 2 H → forms 2 H₂O. Put 2 in front of H₂O.",
        },
        {
          title: "Verify",
          content: "H=4, S=1, O=6, Na=2 on both sides ✅ Balanced!",
        },
      ],
      law: "Because H₂SO₄ has two hydrogen atoms (diprotic), you need two NaOH molecules to fully neutralise it.",
      tip: "When an acid is diprotic (H₂SO₄) or triprotic (H₃PO₄), you need 2 or 3 base molecules respectively.",
      type: "Neutralisation Reaction",
    },
    {
      patterns: ["c + o2", "carbon + oxygen", "carbon combustion"],
      balanced: "C + O₂ → CO₂",
      reactants: { C: 1, O: 2 },
      products: { C: 1, O: 2 },
      steps: [
        { title: "Skeleton equation", content: "C + O₂ → CO₂" },
        {
          title: "Count atoms",
          content: "Left: C=1, O=2 &nbsp;|&nbsp; Right: C=1, O=2",
        },
        {
          title: "Already balanced!",
          content:
            "Every atom on the left matches the right. No coefficients needed. ✅",
        },
      ],
      law: "Carbon burns completely in excess oxygen to form carbon dioxide — a greenhouse gas linked to climate change.",
      tip: "Not every equation needs big coefficients. Always check if it is already balanced before changing anything.",
      type: "Combustion Reaction",
    },
    {
      patterns: ["mg + o2", "magnesium + oxygen", "magnesium burning"],
      balanced: "2Mg + O₂ → 2MgO",
      reactants: { Mg: 2, O: 2 },
      products: { Mg: 2, O: 2 },
      steps: [
        {
          title: "Skeleton equation",
          content: "Mg + O₂ → MgO  (magnesium oxide)",
        },
        {
          title: "Balance oxygen",
          content:
            "Left has 2 O in O₂. Right has 1 O in MgO → put 2 in front of MgO: Mg + O₂ → <strong>2</strong>MgO",
        },
        {
          title: "Balance magnesium",
          content:
            "2 MgO needs 2 Mg → put 2 in front of Mg: <strong>2</strong>Mg + O₂ → 2MgO",
        },
        {
          title: "Verify",
          content: "Left: Mg=2, O=2 &nbsp;|&nbsp; Right: Mg=2, O=2 ✅",
        },
      ],
      law: "Magnesium burns with a brilliant white flame — so bright it was used in old camera flashes. The white powder left behind is magnesium oxide.",
      tip: "When the product contains only one atom of the element from a diatomic molecule (like O₂), you almost always need a coefficient of 2.",
      type: "Oxidation / Synthesis Reaction",
    },
  ];

  function normalise(s) {
    return s.toLowerCase().replace(/\s+/g, " ").trim();
  }

  function balanceEquation(raw) {
    const norm = normalise(raw);
    const match = knownEquations.find((eq) =>
      eq.patterns.some((p) => norm.includes(p)),
    );

    if (!match) {
      return (
        buildError("This equation is not in our library yet.") +
        `<div class="info-block note" style="margin-top:16px">
          <span class="ib-icon">💡</span>
          <p>Try one of the example equations below the input box, or check that you typed it correctly (e.g. "H2 + O2", "CH4 + O2", "NaOH + HCl"). We are adding more equations regularly!</p>
        </div>
        <div class="info-block tip" style="margin-top:12px">
          <span class="ib-icon">📝</span>
          <p><strong>General balancing method:</strong> (1) Write the skeleton equation. (2) Count atoms on each side. (3) Add coefficients — never change subscripts. (4) Balance metals first, then non-metals, then H and O last. (5) Verify every atom matches.</p>
        </div>`
      );
    }

    let html = buildResult(`Balanced: ${match.balanced}`);
    html += `<div class="info-block note" style="margin-top:0;margin-bottom:16px"><span class="ib-icon">🔬</span><p><strong>Type:</strong> ${match.type}</p></div>`;
    match.steps.forEach((s, i) => {
      html += buildStep(i + 1, s.title, s.content);
    });
    html += `<div class="info-block tip" style="margin-top:16px"><span class="ib-icon">💡</span><p><strong>Key Concept:</strong> ${match.law}</p></div>`;
    html += `<div class="info-block warn" style="margin-top:10px"><span class="ib-icon">🎯</span><p><strong>Exam Tip:</strong> ${match.tip}</p></div>`;
    return html;
  }
});

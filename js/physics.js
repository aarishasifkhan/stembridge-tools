/* =========================================
   STEMBridge — Physics Numerical Solver
   Covers: Speed/Velocity, Force, Work,
           Power, Pressure, Ohm's Law,
           Kinetic Energy, Density
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  const topicSelect = document.getElementById("physicsTopic");
  const formulaArea = document.getElementById("physicsFormula");
  const solveBtn = document.getElementById("physicsSolve");
  const outputDiv = document.getElementById("physicsOutput");

  // ---- Formula definitions ----
  const topics = {
    speed: {
      label: "Speed / Velocity",
      formula: "speed = distance ÷ time",
      symbol: "v = d / t",
      units: ["m/s", "km/h"],
      inputs: [
        { id: "p_dist", label: "Distance (m or km)", hint: "e.g. 150" },
        { id: "p_time", label: "Time (s or h)", hint: "e.g. 30" },
        { id: "p_speed", label: "Speed (leave blank if unknown)", hint: "" },
      ],
      solve: function (vals) {
        return solveSpeed(vals);
      },
    },
    force: {
      label: "Force (Newton's 2nd Law)",
      formula: "Force = mass × acceleration",
      symbol: "F = m × a",
      units: ["N"],
      inputs: [
        { id: "p_mass", label: "Mass (kg)", hint: "e.g. 5" },
        { id: "p_acc", label: "Acceleration (m/s²)", hint: "e.g. 3" },
        {
          id: "p_force",
          label: "Force in N (leave blank if unknown)",
          hint: "",
        },
      ],
      solve: function (vals) {
        return solveForce(vals);
      },
    },
    work: {
      label: "Work Done",
      formula: "Work = Force × Distance",
      symbol: "W = F × d",
      units: ["J (Joules)"],
      inputs: [
        { id: "p_wforce", label: "Force (N)", hint: "e.g. 20" },
        { id: "p_wdist", label: "Distance (m)", hint: "e.g. 10" },
        { id: "p_work", label: "Work in J (leave blank if unknown)", hint: "" },
      ],
      solve: function (vals) {
        return solveWork(vals);
      },
    },
    power: {
      label: "Power",
      formula: "Power = Work ÷ Time",
      symbol: "P = W / t",
      units: ["W (Watts)"],
      inputs: [
        { id: "p_pwork", label: "Work Done (J)", hint: "e.g. 600" },
        { id: "p_ptime", label: "Time (s)", hint: "e.g. 60" },
        {
          id: "p_power",
          label: "Power in W (leave blank if unknown)",
          hint: "",
        },
      ],
      solve: function (vals) {
        return solvePower(vals);
      },
    },
    pressure: {
      label: "Pressure",
      formula: "Pressure = Force ÷ Area",
      symbol: "P = F / A",
      units: ["Pa (Pascals)"],
      inputs: [
        { id: "p_prf", label: "Force (N)", hint: "e.g. 100" },
        { id: "p_pra", label: "Area (m²)", hint: "e.g. 0.5" },
        {
          id: "p_pres",
          label: "Pressure in Pa (leave blank if unknown)",
          hint: "",
        },
      ],
      solve: function (vals) {
        return solvePressure(vals);
      },
    },
    ohm: {
      label: "Ohm's Law",
      formula: "Voltage = Current × Resistance",
      symbol: "V = I × R",
      units: ["V", "A", "Ω"],
      inputs: [
        { id: "p_volt", label: "Voltage (V)", hint: "e.g. 12" },
        { id: "p_curr", label: "Current (A)", hint: "e.g. 2" },
        { id: "p_res", label: "Resistance (Ω)", hint: "e.g. 6" },
      ],
      solve: function (vals) {
        return solveOhm(vals);
      },
    },
    ke: {
      label: "Kinetic Energy",
      formula: "KE = ½ × mass × velocity²",
      symbol: "KE = ½mv²",
      units: ["J (Joules)"],
      inputs: [
        { id: "p_kemass", label: "Mass (kg)", hint: "e.g. 4" },
        { id: "p_kevel", label: "Velocity (m/s)", hint: "e.g. 10" },
        { id: "p_ke", label: "KE in J (leave blank if unknown)", hint: "" },
      ],
      solve: function (vals) {
        return solveKE(vals);
      },
    },
    density: {
      label: "Density",
      formula: "Density = Mass ÷ Volume",
      symbol: "ρ = m / V",
      units: ["kg/m³", "g/cm³"],
      inputs: [
        { id: "p_dmass", label: "Mass (kg or g)", hint: "e.g. 500" },
        { id: "p_dvol", label: "Volume (m³ or cm³)", hint: "e.g. 0.25" },
        { id: "p_dens", label: "Density (leave blank if unknown)", hint: "" },
      ],
      solve: function (vals) {
        return solveDensity(vals);
      },
    },
  };

  // ---- Render inputs when topic changes ----
  function renderInputs(key) {
    const topic = topics[key];
    if (!topic) return;

    formulaArea.innerHTML = `
      <div class="info-block note" style="margin-bottom:16px;margin-top:0">
        <span class="ib-icon">📐</span>
        <p><strong>Formula:</strong> ${topic.formula} &nbsp;|&nbsp; <strong>Symbol:</strong> ${topic.symbol}</p>
      </div>
      ${topic.inputs
        .map(
          (inp) => `
        <div class="form-group">
          <label for="${inp.id}">${inp.label}</label>
          <input type="text" id="${inp.id}" placeholder="${inp.hint}" autocomplete="off" />
        </div>
      `,
        )
        .join("")}
    `;
  }

  topicSelect.addEventListener("change", function () {
    renderInputs(this.value);
    outputDiv.innerHTML =
      '<p class="output-placeholder">Your step-by-step solution will appear here once you click Solve.</p>';
  });

  // Render default
  renderInputs(topicSelect.value);

  // ---- Solve ----
  solveBtn.addEventListener("click", function () {
    const key = topicSelect.value;
    const topic = topics[key];
    if (!topic) return;

    // Collect values
    const vals = {};
    topic.inputs.forEach((inp) => {
      const el = document.getElementById(inp.id);
      vals[inp.id] = el ? el.value.trim() : "";
    });

    // Show loading
    solveBtn.innerHTML = '<span class="spinner"></span>Solving…';
    solveBtn.disabled = true;

    setTimeout(() => {
      const result = topic.solve(vals);
      outputDiv.innerHTML = result;
      solveBtn.innerHTML = "⚡ Solve It";
      solveBtn.disabled = false;
    }, 600);
  });

  // ---- Solver Functions ----

  function parseNum(s) {
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
  }
  function fmt(n) {
    return parseFloat(n.toFixed(4));
  }

  function solveSpeed(vals) {
    const d = parseNum(vals.p_dist);
    const t = parseNum(vals.p_time);
    const v = parseNum(vals.p_speed);

    // Determine what to find
    if (v === null && d !== null && t !== null) {
      if (t === 0) return buildError("Time cannot be zero.");
      const result = fmt(d / t);
      return (
        buildResult(`Speed = ${result} units`) +
        buildStep(1, "Write the formula", "Speed = Distance ÷ Time") +
        buildStep(2, "Substitute the values", `Speed = ${d} ÷ ${t}`) +
        buildStep(3, "Calculate", `Speed = <strong>${result} units</strong>`) +
        buildStep(
          4,
          "Interpret",
          `The object travels at <strong>${result} units per unit time</strong>. Remember to match your units — if distance is in km and time is in hours, speed is in km/h.`,
        )
      );
    }
    if (d === null && v !== null && t !== null) {
      const result = fmt(v * t);
      return (
        buildResult(`Distance = ${result} units`) +
        buildStep(1, "Rearrange the formula", "Distance = Speed × Time") +
        buildStep(2, "Substitute", `Distance = ${v} × ${t}`) +
        buildStep(3, "Calculate", `Distance = <strong>${result} units</strong>`)
      );
    }
    if (t === null && d !== null && v !== null) {
      if (v === 0) return buildError("Speed cannot be zero when finding time.");
      const result = fmt(d / v);
      return (
        buildResult(`Time = ${result} units`) +
        buildStep(1, "Rearrange the formula", "Time = Distance ÷ Speed") +
        buildStep(2, "Substitute", `Time = ${d} ÷ ${v}`) +
        buildStep(3, "Calculate", `Time = <strong>${result} units</strong>`)
      );
    }
    return buildError(
      "Leave exactly ONE field blank — that is the value we will find for you.",
    );
  }

  function solveForce(vals) {
    const m = parseNum(vals.p_mass);
    const a = parseNum(vals.p_acc);
    const f = parseNum(vals.p_force);

    if (f === null && m !== null && a !== null) {
      const result = fmt(m * a);
      return (
        buildResult(`Force = ${result} N`) +
        buildStep(
          1,
          "Write the formula",
          "Force = Mass × Acceleration  (Newton's Second Law)",
        ) +
        buildStep(2, "Substitute", `F = ${m} kg × ${a} m/s²`) +
        buildStep(3, "Calculate", `F = <strong>${result} N</strong>`) +
        buildStep(
          4,
          "What does this mean?",
          `This means you need a force of <strong>${result} Newtons</strong> to accelerate an object of mass ${m} kg at ${a} m/s².`,
        )
      );
    }
    if (m === null && f !== null && a !== null) {
      if (a === 0)
        return buildError("Acceleration cannot be zero when finding mass.");
      const result = fmt(f / a);
      return (
        buildResult(`Mass = ${result} kg`) +
        buildStep(1, "Rearrange", "Mass = Force ÷ Acceleration") +
        buildStep(2, "Substitute", `m = ${f} ÷ ${a}`) +
        buildStep(3, "Calculate", `m = <strong>${result} kg</strong>`)
      );
    }
    if (a === null && f !== null && m !== null) {
      if (m === 0) return buildError("Mass cannot be zero.");
      const result = fmt(f / m);
      return (
        buildResult(`Acceleration = ${result} m/s²`) +
        buildStep(1, "Rearrange", "Acceleration = Force ÷ Mass") +
        buildStep(2, "Substitute", `a = ${f} ÷ ${m}`) +
        buildStep(3, "Calculate", `a = <strong>${result} m/s²</strong>`)
      );
    }
    return buildError(
      "Leave exactly ONE field blank — that is the value we will find for you.",
    );
  }

  function solveWork(vals) {
    const f = parseNum(vals.p_wforce);
    const d = parseNum(vals.p_wdist);
    const w = parseNum(vals.p_work);

    if (w === null && f !== null && d !== null) {
      const result = fmt(f * d);
      return (
        buildResult(`Work Done = ${result} J`) +
        buildStep(1, "Write the formula", "Work = Force × Distance") +
        buildStep(2, "Substitute", `W = ${f} N × ${d} m`) +
        buildStep(3, "Calculate", `W = <strong>${result} J (Joules)</strong>`) +
        buildStep(
          4,
          "Real-world meaning",
          `You do ${result} Joules of work when you push with ${f} N over a distance of ${d} metres. Work only counts when the force moves the object.`,
        )
      );
    }
    if (f === null && w !== null && d !== null) {
      if (d === 0) return buildError("Distance cannot be zero.");
      const result = fmt(w / d);
      return (
        buildResult(`Force = ${result} N`) +
        buildStep(1, "Rearrange", "Force = Work ÷ Distance") +
        buildStep(2, "Substitute", `F = ${w} ÷ ${d}`) +
        buildStep(3, "Calculate", `F = <strong>${result} N</strong>`)
      );
    }
    if (d === null && w !== null && f !== null) {
      if (f === 0) return buildError("Force cannot be zero.");
      const result = fmt(w / f);
      return (
        buildResult(`Distance = ${result} m`) +
        buildStep(1, "Rearrange", "Distance = Work ÷ Force") +
        buildStep(2, "Substitute", `d = ${w} ÷ ${f}`) +
        buildStep(3, "Calculate", `d = <strong>${result} m</strong>`)
      );
    }
    return buildError(
      "Leave exactly ONE field blank — that is the value we will find for you.",
    );
  }

  function solvePower(vals) {
    const w = parseNum(vals.p_pwork);
    const t = parseNum(vals.p_ptime);
    const p = parseNum(vals.p_power);

    if (p === null && w !== null && t !== null) {
      if (t === 0) return buildError("Time cannot be zero.");
      const result = fmt(w / t);
      return (
        buildResult(`Power = ${result} W`) +
        buildStep(1, "Write the formula", "Power = Work Done ÷ Time") +
        buildStep(2, "Substitute", `P = ${w} J ÷ ${t} s`) +
        buildStep(3, "Calculate", `P = <strong>${result} W (Watts)</strong>`) +
        buildStep(
          4,
          "Think about it",
          `A power of ${result} W means the machine transfers ${result} Joules of energy every second. 1000 W = 1 kW (kilowatt).`,
        )
      );
    }
    if (w === null && p !== null && t !== null) {
      const result = fmt(p * t);
      return (
        buildResult(`Work Done = ${result} J`) +
        buildStep(1, "Rearrange", "Work = Power × Time") +
        buildStep(2, "Substitute", `W = ${p} × ${t}`) +
        buildStep(3, "Calculate", `W = <strong>${result} J</strong>`)
      );
    }
    if (t === null && p !== null && w !== null) {
      if (p === 0) return buildError("Power cannot be zero.");
      const result = fmt(w / p);
      return (
        buildResult(`Time = ${result} s`) +
        buildStep(1, "Rearrange", "Time = Work ÷ Power") +
        buildStep(2, "Substitute", `t = ${w} ÷ ${p}`) +
        buildStep(3, "Calculate", `t = <strong>${result} s</strong>`)
      );
    }
    return buildError(
      "Leave exactly ONE field blank — that is the value we will find for you.",
    );
  }

  function solvePressure(vals) {
    const f = parseNum(vals.p_prf);
    const a = parseNum(vals.p_pra);
    const p = parseNum(vals.p_pres);

    if (p === null && f !== null && a !== null) {
      if (a === 0) return buildError("Area cannot be zero.");
      const result = fmt(f / a);
      return (
        buildResult(`Pressure = ${result} Pa`) +
        buildStep(1, "Write the formula", "Pressure = Force ÷ Area") +
        buildStep(2, "Substitute", `P = ${f} N ÷ ${a} m²`) +
        buildStep(
          3,
          "Calculate",
          `P = <strong>${result} Pa (Pascals)</strong>`,
        ) +
        buildStep(
          4,
          "Quick tip",
          `Smaller area → higher pressure. That is why a needle pierces easily — the tiny area creates enormous pressure with the same force.`,
        )
      );
    }
    if (f === null && p !== null && a !== null) {
      const result = fmt(p * a);
      return (
        buildResult(`Force = ${result} N`) +
        buildStep(1, "Rearrange", "Force = Pressure × Area") +
        buildStep(2, "Substitute", `F = ${p} × ${a}`) +
        buildStep(3, "Calculate", `F = <strong>${result} N</strong>`)
      );
    }
    if (a === null && p !== null && f !== null) {
      if (p === 0) return buildError("Pressure cannot be zero.");
      const result = fmt(f / p);
      return (
        buildResult(`Area = ${result} m²`) +
        buildStep(1, "Rearrange", "Area = Force ÷ Pressure") +
        buildStep(2, "Substitute", `A = ${f} ÷ ${p}`) +
        buildStep(3, "Calculate", `A = <strong>${result} m²</strong>`)
      );
    }
    return buildError(
      "Leave exactly ONE field blank — that is the value we will find for you.",
    );
  }

  function solveOhm(vals) {
    const v = parseNum(vals.p_volt);
    const i = parseNum(vals.p_curr);
    const r = parseNum(vals.p_res);

    const blanks = [v, i, r].filter((x) => x === null).length;
    if (blanks !== 1)
      return buildError(
        "Leave exactly ONE of the three fields blank — that's what we'll solve for.",
      );

    if (v === null) {
      const result = fmt(i * r);
      return (
        buildResult(`Voltage = ${result} V`) +
        buildStep(1, "Write the formula", "Ohm's Law: V = I × R") +
        buildStep(2, "Substitute", `V = ${i} A × ${r} Ω`) +
        buildStep(3, "Calculate", `V = <strong>${result} V</strong>`) +
        buildStep(
          4,
          "Remember",
          "Voltage drives current through a resistance. Double the voltage → double the current (if R stays constant).",
        )
      );
    }
    if (i === null) {
      if (r === 0) return buildError("Resistance cannot be zero.");
      const result = fmt(v / r);
      return (
        buildResult(`Current = ${result} A`) +
        buildStep(
          1,
          "Rearrange",
          "Current = Voltage ÷ Resistance  →  I = V / R",
        ) +
        buildStep(2, "Substitute", `I = ${v} ÷ ${r}`) +
        buildStep(3, "Calculate", `I = <strong>${result} A</strong>`)
      );
    }
    if (r === null) {
      if (i === 0) return buildError("Current cannot be zero.");
      const result = fmt(v / i);
      return (
        buildResult(`Resistance = ${result} Ω`) +
        buildStep(
          1,
          "Rearrange",
          "Resistance = Voltage ÷ Current  →  R = V / I",
        ) +
        buildStep(2, "Substitute", `R = ${v} ÷ ${i}`) +
        buildStep(3, "Calculate", `R = <strong>${result} Ω</strong>`)
      );
    }
  }

  function solveKE(vals) {
    const m = parseNum(vals.p_kemass);
    const v = parseNum(vals.p_kevel);
    const ke = parseNum(vals.p_ke);

    if (ke === null && m !== null && v !== null) {
      const result = fmt(0.5 * m * v * v);
      return (
        buildResult(`Kinetic Energy = ${result} J`) +
        buildStep(1, "Write the formula", "KE = ½ × mass × velocity²") +
        buildStep(2, "Substitute", `KE = 0.5 × ${m} × ${v}²`) +
        buildStep(3, "Square velocity first", `${v}² = ${v * v}`) +
        buildStep(
          4,
          "Multiply everything",
          `KE = 0.5 × ${m} × ${v * v} = <strong>${result} J</strong>`,
        ) +
        buildStep(
          5,
          "Insight",
          `Doubling the velocity quadruples the kinetic energy because velocity is squared. This is why car crashes at high speeds are so much more dangerous.`,
        )
      );
    }
    if (m === null && ke !== null && v !== null) {
      if (v === 0) return buildError("Velocity cannot be zero.");
      const result = fmt((2 * ke) / (v * v));
      return (
        buildResult(`Mass = ${result} kg`) +
        buildStep(1, "Rearrange", "mass = (2 × KE) ÷ v²") +
        buildStep(2, "Substitute", `m = (2 × ${ke}) ÷ ${v}²`) +
        buildStep(
          3,
          "Calculate",
          `m = ${2 * ke} ÷ ${v * v} = <strong>${result} kg</strong>`,
        )
      );
    }
    if (v === null && ke !== null && m !== null) {
      if (m === 0) return buildError("Mass cannot be zero.");
      const inside = (2 * ke) / m;
      const result = fmt(Math.sqrt(inside));
      return (
        buildResult(`Velocity = ${result} m/s`) +
        buildStep(1, "Rearrange", "v = √(2 × KE ÷ m)") +
        buildStep(2, "Substitute", `v = √(2 × ${ke} ÷ ${m})`) +
        buildStep(3, "Simplify inside square root", `v = √(${inside})`) +
        buildStep(4, "Take square root", `v = <strong>${result} m/s</strong>`)
      );
    }
    return buildError(
      "Leave exactly ONE field blank — that is the value we will find for you.",
    );
  }

  function solveDensity(vals) {
    const m = parseNum(vals.p_dmass);
    const v = parseNum(vals.p_dvol);
    const d = parseNum(vals.p_dens);

    if (d === null && m !== null && v !== null) {
      if (v === 0) return buildError("Volume cannot be zero.");
      const result = fmt(m / v);
      return (
        buildResult(`Density = ${result} (units depend on your input)`) +
        buildStep(1, "Write the formula", "Density = Mass ÷ Volume") +
        buildStep(2, "Substitute", `ρ = ${m} ÷ ${v}`) +
        buildStep(3, "Calculate", `ρ = <strong>${result}</strong>`) +
        buildStep(
          4,
          "Units tip",
          "If mass is in kg and volume in m³ → density is kg/m³. If mass is in g and volume in cm³ → density is g/cm³.",
        )
      );
    }
    if (m === null && d !== null && v !== null) {
      const result = fmt(d * v);
      return (
        buildResult(`Mass = ${result}`) +
        buildStep(1, "Rearrange", "Mass = Density × Volume") +
        buildStep(2, "Substitute", `m = ${d} × ${v}`) +
        buildStep(3, "Calculate", `m = <strong>${result}</strong>`)
      );
    }
    if (v === null && d !== null && m !== null) {
      if (d === 0) return buildError("Density cannot be zero.");
      const result = fmt(m / d);
      return (
        buildResult(`Volume = ${result}`) +
        buildStep(1, "Rearrange", "Volume = Mass ÷ Density") +
        buildStep(2, "Substitute", `V = ${m} ÷ ${d}`) +
        buildStep(3, "Calculate", `V = <strong>${result}</strong>`)
      );
    }
    return buildError(
      "Leave exactly ONE field blank — that is the value we will find for you.",
    );
  }
}); // end DOMContentLoaded

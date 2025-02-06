const parameters = [
  "ALT (UI/L)", "AST (UI/L)", "LDH (UI/L)", "BT (mg/dL)", "BD (mg/dL)", "ALP (UI/L)", "GGT (UI/L)", "5NT (UI/L)", "ALB (mg/dL)", "PT (g/L)", "Urea (mg/dL)"
];

// Male, Female 
const upper_values = [
  [43, 45], [35, 40], [450, 450], [1, 1], [0.25, 0.25], [306, 306],[920, 636], [17, 17], [4.4, 4.4], [87, 87], [38, 35]
];

const lower_values = [
  [9, 9], [10, 10], [180, 180], [0, 0], [0, 0], [80, 65], [0, 0], [0, 0], [3.4, 3.4], [66, 66], [15, 14]
];

//Añadir todos los inputs

const startScreen = document.getElementById('start-screen');
const appScreen = document.getElementById('app-screen');
const startButton = document.getElementById('start-button');
const inputsContainer = document.getElementById('inputs-container');
const calculateButton = document.getElementById('calculate-button');
const resultsDiv = document.getElementById('results');
const deRittis = document.getElementById('de-rittis');
const bilInd = document.getElementById("bi");
const interpretacion = document.getElementById("interpretacion");

startButton.addEventListener('click', () => {
  startScreen.style.display = 'none';
  appScreen.style.display = 'flex';


  parameters.forEach(param => {
    const inputGroup = document.createElement('div');
    inputGroup.classList.add('input-group');

    const label = document.createElement('label');
    label.textContent = param;
    label.htmlFor = param;

    const input = document.createElement('input');
    input.type = 'number';
    input.id = param;

    const message = document.createElement('span');
    message.classList.add('message');

    inputGroup.appendChild(label);
    inputGroup.appendChild(input);
    inputGroup.appendChild(message);
    inputsContainer.appendChild(inputGroup);
  });
});

// Selector de sexo

const toggle = document.getElementById('gender-toggle');
const label = document.getElementById('gender-label');

toggle.addEventListener('change', function() {
  if (this.checked) {
    label.textContent = 'Mujer';
    //console.log(label.textContent);
  } else {
    label.textContent = 'Hombre';
    //console.log(label.textContent);
  }
});


// Establecer el valor inicial
label.textContent = 'Hombre';

// Operación al analizar
calculateButton.addEventListener('click', () => {
  interpretacion.textContent = "";
  let sex_woman = toggle.checked;
  let results = []
  let results_state = [];
  
  
  let totalSum = 0;
  resultsDiv.innerHTML = ''; // Clear previous results

  let index = 0
  parameters.forEach(param => {
    const upper = upper_values[index][sex_woman+0]
    const lower = lower_values[index][sex_woman+0]
    const input = document.getElementById(param);
    const value = parseFloat(input.value);
    const message = input.nextElementSibling;
    results_state[5] == 3 && results_state[6] == 3 && results_state[7] == 3
    // Estados: 0 - NA, 1 - bajo, 2 - normal, 3 - alto
    if (value > upper) {
      message.textContent = `Valor sobre IDR > ${upper}`;
      results_state.push(3)
      results.push(parseFloat(value))
    } else if (value < lower) {
      message.textContent = `Valor bajo IDR < ${lower}`;
      results_state.push(1)
      results.push(parseFloat(value))
    } else if (!isNaN(value)) {
      message.textContent = `Aceptable [${lower_values[index][sex_woman+0]} - ${upper_values[index][sex_woman+0]}]`;
      results_state.push(2)
      results.push(parseFloat(value))
    } else {
      //message.textContent = `VDR [${lower_values[index][sex_woman+0]} - ${upper_values[index][sex_woman+0]}]`
      message.textContent = ""
      results_state.push(0)
      results.push(null)
    }

    index++
  });

  // Post analisis
  let coefDR = results[1] / results[0];
  if ((results_state[0] == 3 || results_state[1] == 3) && (results_state[0] != 0 && results_state[1] != 0)) {
    deRittis.textContent = `DeRittis: ${coefDR.toFixed(2)}`;
  } else {
    deRittis.textContent = ""
  }


  let bilirubina_indirecta = results[3] - results[4]
  if (results_state[3] != 0 && results_state[4] != 0) {
    bilInd.textContent = `BI: ${bilirubina_indirecta.toFixed(2)} mg/dL `
    if (bilirubina_indirecta > 0.75) {
      bilInd.textContent += "elevado (> 0.75)"
    } else {
      bilInd.textContent += "aceptable (< 0.75)"
    }
  } else {
    bilInd.textContent = ""
  }

  // Interpretaciones horriblemente colocadas en if elses.

  if (results_state[2] == 3 || results_state[2] == 0) {
    if (results_state[2] == 3) {
      interpretacion.textContent += "LDH indica daño orgánico. "
    }

    if ((results_state[5] == 3 && results_state[6] == 3 && results_state[7] == 3) || (results_state[3] == 3 && results_state[4] == 3)) {
      interpretacion.textContent += "Indicadores definitivos de colestasis. "
    } else if ((results_state[5] == 3 && results_state[6] == 2 && results_state[7] == 2)) {
      interpretacion.textContent += "Probable daño óseo, corroborar con perfil óseo. "
    } else if ((results_state[5] == 3 && results_state[6] == 0 && results_state[7] == 0)) {
      interpretacion.textContent += "Probable daño óseo o colestasis, corroborar completando perfil hepático o correlacionando con historia clínica. "
    }
  
    if (results_state[5] == 2 && results_state[6] == 3 && results_state[7] == 2) {
      interpretacion.textContent += "Probable alcoholismo o toxicomanía por elevación de GGT. "
    }
    if ((results_state[5] == 1 || results_state[6] == 1) && (results_state[7] == 3 || results_state[3] == 2)) {
      interpretacion.textContent += "Indicadores definitivos de baja síntesis hepática presentes. "
    }
    if ((results_state[0] == 3 || results_state[1] == 3) && (results_state[3] == 3 && results_state[4] == 2)) {
      interpretacion.textContent += "Indicadores definitivos de necrosis hepática. "
      if (coefDR > 1) {
        interpretacion.textContent += "El daño hepático es crónico/profundo. "
      } else if (coefDR < 1) {
        interpretacion.textContent += "El daño hepático es agudo. "
      }
    } else if ((results_state[3] == 3 && results_state[4] == 2) && (results_state[0] == 0 || results_state[1] == 0)) {
      interpretacion.textContent += "Probable necrosis hepática, obtenga AST y ALT para asegurarse. "
    } else if ((results_state[0] == 3 && results_state[1] == 3) && (results_state[3] == 0 || results_state[4] == 0)) {
      interpretacion.textContent += "Probable necrosis hepática, obtenga BT y BD para asegurarse. "
    }

  } else if ((results_state[2] != 3 || results_state[2] != 0 ) && !((results_state[0] == 3 || results_state[1] == 3) && (results_state[3] == 3 && results_state[4] == 2))) {
    interpretacion.textContent += "Resultados de LDH incoherentes, corrobore. "
  }



  console.log(1000)
});


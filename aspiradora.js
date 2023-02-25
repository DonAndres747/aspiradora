
let newSquare;

function generatePoints() {
  // Obtener los contenedores de puntos de cada cuadrado
  const container1 = document.getElementById('areaA').querySelector('.basura');
  const container2 = document.getElementById('areaB').querySelector('.basura');

  // Eliminar cualquier punto existente dentro de los contenedores
  container1.innerHTML = '';
  container2.innerHTML = '';
  let counter = 0;
  // Generar puntos aleatorios y agregarlos a los contenedores correspondientes
  for (let i = 0; i < (Math.random() * 8); i++) {
    const point = document.createElement('div');
    point.classList.add('point');
    point.style.left = `${Math.random() * 90}%`;
    point.style.top = `${Math.random() * 90}%`;

    // Agregar el punto al contenedor correspondiente
    if (i % 2 === 0) {
      container1.appendChild(point);
      counter++
    } else {
      container2.appendChild(point);
      counter++
    }
  }
  document.getElementById("trashQuantityLabel").innerText = counter;
}

function addSquareToArea(area) {
  // Obtener el contenedor de puntos del cuadro seleccionado
  const container = document.getElementById(area).querySelector(".basura")

  try {
    container.removeChild(newSquare);

    const otherArea = document.querySelector('.area:not(#' + area + ') .basura');
    otherArea.removeChild(otherArea.querySelector('.square'));

  } catch (error) { }
  // Crear el nuevo cuadrado
  newSquare = document.createElement('div');
  newSquare.classList.add('square');

  // Agregar el nuevo cuadrado como un hijo del contenedor de puntos
  container.appendChild(newSquare);

}

let intentos = 0;
async function cleanArea(area) {

  const container = document.getElementById(area).querySelector('.basura');

  // Obtener todos los puntos del área
  let points = container.querySelectorAll('.point');

  console.clear()
  // Mover el robot a cada punto del área
  const containerA = document.getElementById('areaA').querySelector('.basura');
  const containerB = document.getElementById('areaB').querySelector('.basura');
  let pointsCounter = containerA.querySelectorAll('.point').length + containerB.querySelectorAll('.point').length;
  for (i = 0; i < points.length; i++) {

    let pointRect = points.item(i).getBoundingClientRect();
    let pointX = pointRect.left + pointRect.width / 2;
    let pointY = pointRect.top;
    console.log(points.item(i), i)
    await moveRobot(pointX, pointY, points.item(i), points.length);
    document.getElementById("trashQuantityLabel").innerText = --pointsCounter;
    setTimeout(() => {
      console.log("para: ", points)
    }, 6000);
  }

  await container.removeChild(newSquare);

  if (intentos < 1) {

    intentos++;
    area2 = (area = 'areaA' ? 'areaB' : 'areaA');
    await addSquareToArea(area2);
    await cleanArea(area2)
  } else {
    setTimeout(() => {
      alert('Limpíeza Terminada!')
    }, 3000);
  }
}

function moveRobot(x, y, point, rL) {

  const robot = document.querySelector('.square');
  let posicionX = parseInt(robot.offsetLeft);
  let posicionY = parseInt(robot.offsetTop);
  const pasosX = ((posicionX - x) / 20) * -1;
  const pasosY = posicionY >= y ? (((posicionY + y) / 60)) : (((posicionY - y) / 40));


  setTimeout(() => {
    for (X = 1; X <= 20; X++) {
      setTimeout(() => {
        robot.style.left = posicionX + pasosX + 'px';
        posicionX = parseInt(robot.offsetLeft)
      }, X * 70);
    };
    setTimeout(() => {
      point.remove()
    }, 1200);

  }, 2000);

  for (Y = 1; Y <= 10; Y++) {
    setTimeout(() => {
      robot.style.top = (posicionY - pasosY + 'px')
      posicionY = parseInt(robot.style.top)
    }, Y * 80);
  }

  return new Promise(resolve => {
    // Espera 1 segundo antes de resolver la promesa
    setTimeout(() => {
      resolve();
    }, (rL - 1) * 3000);
  });

}

function iniciarLimpieza(area) {
  generatePoints();

  addSquareToArea(area);

  cleanArea(area)

}
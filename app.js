require("colors");

const { guardarDB, leerDB } = require("./helpers/guardarArchivo");
const {
  inquirerMenu,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoCheckList,
} = require("./helpers/inquirer");
const Tarea = require("./models/tarea");
const Tareas = require("./models/tareas");

const main = async () => {
  let opt = "";

  console.clear();

  const tareas = new Tareas();

  const tareasDB = leerDB();

  if (tareasDB) {
    //Establecer las tareas
    tareas.cargarTareasFromArray(tareasDB);
  }

  do {
    // imprime el menu
    opt = await inquirerMenu();

    switch (opt) {
      case "1":
        //crear opcion

        const desc = await leerInput("Descripción: ");
        tareas.crearTarea(desc);

        break;

      case "2":
        tareas.listadoCompleto();
        break;

      case "3":
        tareas.listarPendientesCompletadas(true);
        break;

      case "4": // listar pendientes
        tareas.listarPendientesCompletadas(false);
        break;

      case "5": //completado o pendiente
        const ids = await mostrarListadoCheckList(tareas.listadoArr);
        tareas.toggleCompletadas(ids);
        break;

      case "6": //borrar
        const id = await listadoTareasBorrar(tareas.listadoArr);
        if (id !== "0") {
          const ok = confirmar("¿Estas seguro que quieres borrar");
          if (ok) {
            tareas.borrarTarea(id);
            console.log("Tarea borrada");
          }
        }
        // TO DO: preguntar si esta seguro de borrar

        break;
    }

    guardarDB(tareas.listadoArr);
    await pausa();
  } while (opt !== "0");
};

main();

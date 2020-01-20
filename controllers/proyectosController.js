const Proyectos = require('../models/Proyectos');
const slug = require('slug');

exports.proyectosHome = async (req,resp)=> {
    const proyectos = await Proyectos.findAll();
    resp.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async (req, res)=> {
    const proyectos = await Proyectos.findAll();
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req, res)=> {

    const proyectos = await Proyectos.findAll();

    // Enviar a la consola lo que el usuario escriba.
    // console.log(req.body);

    //validar que tengamos algo en el input
    const { nombre} = req.body;

    let errores = []

    if(!nombre){
        errores.push({'texto':'Agrega un Nombre al proyecto'})
    }

    // si hay errrores
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos     
        })
    } else {
        // No hay errores
        // Insertar en la BD.
        const url =slug(nombre).toLowerCase();
        const proyecto = await Proyectos.create({ nombre, url });
        res.redirect('/')
           

    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    const proyectosPromise =  Proyectos.findAll();

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });
   const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

   if(!proyecto) return next();

   // render a la vista
   res.render('tareas', {
       nombrePagina: 'Tareas del Proyecto',
       proyecto,
       proyectos
   })
}
 
exports.formularioEditar = async (req, res)=> {
    const proyectosPromise =  Proyectos.findAll();

    const proyectoPromise  =  Proyectos.findOne({
        where: {
            id: req.params.id
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);
    // render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req, res)=> {

    const proyectos = await Proyectos.findAll();

    // Enviar a la consola lo que el usuario escriba.
    // console.log(req.body);

    //validar que tengamos algo en el input
    const { nombre} = req.body;

    let errores = []

    if(!nombre){
        errores.push({'texto':'Agrega un Nombre al proyecto'})
    }

    // si hay errrores
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos     
        })
    } else {
        // No hay errores
        // Insertar en la BD.
        const url =slug(nombre).toLowerCase();
        await Proyectos.update(
                        { nombre: nombre},
                        { where: {id: req.params.id}},
        );
        res.redirect('/')
           

    }
}
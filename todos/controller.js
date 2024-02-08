const express = require('express')
const db = require('../server')


//let tasks = []

// const createTodo = (request, response) => {
//     response.json({
//         successful: true,
//         data: request.body,
//     })
// }

// const getTodos = (request, response) => {
//     response.json({
//         successful:true,
//         data: [{id: 1, text: 'Learn NodeJS'}],
//     })
// }

// const hello = (request, response) => {
//     response.json({
//         successful: true,
//         data: [{id: 1, text: 'Learn sss'}]
//     })
// }


// const createTask = (request, response) => {
//     const {title, description, status} = request.body;

//     //Verificar campos requeridos
//     if( !title || !description || !status) {
//         return response.status(400).json({
//             successful: false,
//             error: 'Faltan campos obligatorios.'
//         })
            
//     }

//     //Obtener fecha de creación
//     const todayDate = new Date()
//     const createdAtDate = todayDate.toLocaleDateString('es-ES')
//     const createdAtTime = todayDate.toLocaleTimeString('es-ES')

//     // Verificar status
//     if(status !== 'pendiente' && status !== 'completado' && status !== 'en progreso'){
//         return response.status(400).json({
//             successful: false,
//             error: 'El estado de la tarea debe ser "pendiente" , "completado" o "en progreso" .',
//         })
//     }


//     const newTask = {
//         id: tasks.length +1, //Testeo
//         title, 
//         description, 
//         status, 
//         createdAt: `${createdAtDate} at ${createdAtTime}`
//     }

//     response.json({
//         successful:true,
//         data:newTask,
//     })

//     tasks.push(newTask); //Testeo

// }

// const getTasks = (request, response) => {
//     response.json({
//         successful: true,
//         data: tasks
//     })
// }

// const getTask = (request, response) => {
//     const taskID = parseInt(request.params.id)
//     const taskIdx = tasks.find( taskIdx => taskIdx.id === taskID)

//     if(!taskIdx){
//         return response.status(404).json({
//             successful: false,
//             error: `La tarea con el id ${taskID} no existe.`
//         })
//     }

//     response.json({
//         successful: true,
//         data: taskIdx
//     })
// }


// const editTask = (request, response) => {
//     const taskID = parseInt(request.params.id)
//     const {title, description, status} = request.body

//     //Buscar la tarea
//     const taskIdx = tasks.findIndex( taskIdx => taskIdx.id === taskID)

//     if(taskIdx === -1){
//         return response.status(404).json({
//             successful: false,
//             error: `La tarea con el id ${taskID} no existe.`
//         })
//     }


//     const updatedTask = {
//         ...tasks[taskIdx],
//         title: title !== undefined ? title : tasks[taskIdx].title,
//         description: description !== undefined ? description : tasks[taskIdx].description,
//         status: status !== undefined ? status : tasks[taskIdx].status,
//     }

//     //Reemplazo
//     tasks[taskIdx] = updatedTask

//     response.json({
//         successful: true,
//         data: updatedTask
//     })


// }


// const deleteTask = (request, response) => {
//     const taskID = parseInt(request.params.id)
//     const taskIdx = tasks.findIndex( taskIdx => taskIdx.id === taskID)

//     if(taskIdx === -1) {
//         return response.status(404).json({
//             successful: false,
//             error: `La tarea con el id ${taskID} no existe.`
//         })
//     }

//     const deletingTask = tasks.splice(taskIdx, 1)[0]

//     response.json({
//         successful: true,
//         data: deletingTask,
//         message: `La tarea con el id ${taskID} ha sido eliminada.`
//     })


// }



const getTasks = (request, response) => {
    // Obtener todas las tareas de la base de datos
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            console.error('Error al obtener tareas de la base de datos:', err);
            return response.status(500).json({
                successful: false,
                error: 'Error interno del servidor.'
            });
        }

        response.json({
            successful: true,
            data: results,
        });
    });
};

const getTask = (request, response) => {
    const taskID = request.params.id

    if (taskID === undefined){
        return response.status(400).json({
            successful: false,
            error: 'El ID debe existir'
        })
    }

    db.query('SELECT * FROM tasks WHERE id = ?', taskID, (err, results) => {
        if(err){
            console.error('Error al ejecutar la consulta: ', err)
            return response.status(500).json({
                successful: false,
                error: 'Error interno del SV.'
            })
        }

        if(results.length === 0){
            return response.status(404).json({
                successful: false,
                error: `No existe ninguna tarea con el id=${taskID}`
            })
        }

        //Devolver la tarea
        response.json({
            successful: true,
            data: results[0]
        })
    })

}


const createTask = (request, response) => {
    //extraer propiedades del objeto
    const {title, description, status} = request.body

    //verificar campos requeridos
    if(!title || !description || !status){
        return response.status(400).json({
            successful: false,
            error: 'Rellena todos los campos.'
        })
    }

    if(status !== "completado" && status !== "en progreso" && status !== "pendiente"){
        return response.status(404).json({
            successful: false,
            error: 'El campo status debe ser "completado", "en progreso" o "pendiente"'
        })
    }

    const createdAt = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })

    // Crear objeto
    const newTask = {
        title,
        description,
        status,
        createdAt,
    }

    //insertar objeto en la db
    db.query('INSERT INTO tasks SET ?', newTask, (err,result) => {
        if(err){
            console.error('Error al crear la tarea: ', err)
            return response.status(500).json({
                successful: false,
                error: 'Error del servidor'
            })
        }

        response.json({
            successful: true,
            data: {...newTask, id: result.insertId}
        })
    })


}



const deleteTask = (request, response) => {
    const taskID = request.params.id

    //Verificar id
    if(taskID === undefined){
        return response.status(400).json({
            successful: false,
            error: 'El ID debe existir'
        })
    }

    //Consultar si existe una tarea con ese id
    db.query('SELECT * FROM tasks WHERE id = ?', taskID, (err,results) => {
        if(err){
            console.error('Error al encontrar la tarea: ', err)
            return response.status(500).json({
                successful: false,
                error: 'Error interno del SV.'
            })
        }

        if(results.length === 0){
            return response.status(404).json({
                successful: false,
                error: `No existe ninguna tarea con el id=${taskID}`
            })
        }

        //Eliminar de la base de datos
        db.query('DELETE FROM tasks WHERE id = ?', taskID, (err) => {
            if(err){
                console.error('Error al eliminar la tarea de la base de datos.')
                return response.status(500).json({
                    successful: false,
                    error: 'Error interno del SV.'
                })
            }

            response.json({
                successful: true,
                message: `La tarea con el ID ${taskID} ha sido eliminada.`,            
            })
        })


    })
    
}



const editTask = (request, response) => {
    const taskID = request.params.id
    const {title, description, status} = request.body

    if(taskID === undefined){
        return response.status(400).json({
            successful: false,
            error: 'El ID debe existir'
        })
    }

    //  Crear obj. vacío para luego añadir campos para remplazar
    const updatedFields = {}
    if(title !== undefined){
        updatedFields.title = title
    } 

    if(description !== undefined){
        updatedFields.description = description
    }
    
    if(status !== undefined){
        updatedFields.status = status
    }


    if(Object.keys(updatedFields).length === 0){
        return response.status(400).json({
            successful: false,
            error: 'Proporciona algún campo a actualizar'
        })
    }
    


    db.query('UPDATE tasks SET ? WHERE id = ?', [updatedFields, taskID], (err, result) => {
        if(err){
            console.error('Error al actualizar la tarea')
            return response.status(500).json({
                successful: false,
                error: 'Error interno en el SV.'
            })
        }


        response.json({
            successful: true,
            data: {id: taskID, ...updatedFields}
        })
    }
    
    )
}


module.exports = {
    // createTodo,
    // getTodos,
    // hello,
    createTask,
    getTasks,
    getTask,
    editTask,
    deleteTask
}
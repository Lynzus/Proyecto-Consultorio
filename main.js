const url = 'http://localhost:3000/api/pacientes/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalPaciente = new bootstrap.Modal(document.getElementById('modalPaciente'))
const formPaciente = document.querySelector('form')
const nombre = document.getElementById('nombre')
const cedula = document.getElementById('cedula')
const telefono = document.getElementById('telefono')
const correo = document.getElementById('correo')
const fecha = document.getElementById('fecha')
let opcion = ''

btnCrear.addEventListener('click', ()=> {
    nombre.value = ''
    cedula.value = ''
    telefono.value = ''
    correo.value = ''
    fecha.value = ''
    modalPaciente.show()
    opcion = 'crear'
})

const mostrar = (pacientes) => {
    pacientes.forEach(paciente => {
        resultados += `<tr>
                            <td>${paciente.cedula}</td>
                            <td>${paciente.nombre}</td>
                            <td>${paciente.telefono}</td>
                            <td>${paciente.correo}</td>
                            <td>${paciente.fecha}</td>
                            <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td>
                        </tr>
                    `
    });
    contenedor.innerHTML = resultados
}

fetch(url)
    .then(response => response.json())
    .then(data => mostrar(data))
    .catch(error => console.log(error))

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

//Procedimiento borrar
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    alertify.confirm("Alerta", "Se borrará el registro.",
    () => {
        fetch(url+id, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(() => location.reload())
        // alertify.success('Ok');
    },
    () => {
        // alertify.error('Cancel');
    })
})

//Procedimiento Editar
let cedulaForm = 0
on(document, 'click', '.btnEditar', e => {
    const fila = e.target.parentNode.parentNode
    cedulaForm = fila.children[0].innerHTML
    const nombreForm = fila.children[1].innerHTML
    const telefonoForm = fila.children[2].innerHTML
    const correoForm = fila.children[3].innerHTML
    const fechaForm = fila.children[4].innerHTML
    cedula.value = cedulaForm
    nombre.value = nombreForm
    telefono.value = telefonoForm
    correo.value = correoForm
    fecha.value = fechaForm
    opcion = 'editar'
    modalPaciente.show()
})

//Procedimiento para Crear y Editar
formPaciente.addEventListener('submit', (e) => {
    e.preventDefault()
    if(opcion == 'crear'){
        // console.log('OPCION CREAR')
        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                cedula:cedula.value,
                nombre:nombre.value,
                telefono:telefono.value,
                correo:correo.value,
                fecha:fecha.value
            })
        })
        .then(response => response.json())
        .then(response => location.reload())
        .then(data => {
            const nuevoPaciente = []
            nuevoPaciente.push(data)
            mostrar(nuevoPaciente)
        })
    }
    if(opcion == 'editar'){
        // console.log('OPCION EDITAR')
        fetch(url+cedulaForm, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                cedula:cedula.value,
                nombre:nombre.value,
                telefono:telefono.value,
                correo:correo.value,
                fecha:fecha.value

            })
        })
            .then(response => response.json())
            .then(response => location.reload())
    }
    modalPaciente.hide()
})
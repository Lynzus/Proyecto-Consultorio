var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
const { json } = require('express');
const app = express();

app.use(express.json());
app.use(cors());

//establecemos los parametros de conexion
var conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'consultorio'
});

//probamos la conexion
conexion.connect((error) => {
    if(error){
        throw error;
    }
    else{
        console.log("Conexion exitosa a la base de datos");
    }
});

//mostrar todos los articulos
app.get('/api/pacientes', (req, res) => {
    conexion.query('SELECT * FROM pacientes', (error, filas) => {
        if(error){
            throw error;
        }
        else{
          res.send(filas);  
        }
    });
});

//mostrar un SOLO articulo
app.get('/api/pacientes/:cedula', (req, res) => {
    conexion.query('SELECT * FROM pacientes WHERE cedula = ?', [req.params.cedula], (error, fila) => {
        if(error){
            throw error;
        }
        else{
        res.send(fila);
        // res.send(fila[0].descripcion);  
        }
    });
});
//crear un articulo
app.post('/api/pacientes', (req, res) => {
    let data = {cedula: req.body.cedula, nombre:req.body.nombre, telefono:req.body.telefono, correo:req.body.correo};
    let sql = "INSERT INTO pacientes SET ?";
    conexion.query(sql, data, (error, result) => {
        if(error){
            throw error;
        }
        else{
            // Object.assign(data, {id: result.insertID})
            res.send(data);
        }
    })
});

//editar articulo
app.put('/api/pacientes/:cedula', (req, res) => {
    let cedula = req.params.cedula;
    let nombre = req.body.nombre;
    let telefono = req.body.telefono;
    let correo = req.body.correo;
    let sql = "UPDATE pacientes SET nombre = ?, telefono = ?, correo = ? WHERE cedula = ?";
    conexion.query(sql, [nombre, telefono, correo, cedula], (error, results) => {
        if(error){
            throw error;
        }
        else{
            res.send(results);
        }
    });
});

//eliminar articulo
app.delete('/api/pacientes/:cedula', (req, res) => {
    conexion.query('DELETE FROM pacientes WHERE cedula = ?', [req.params.cedula], (error, filas) => {
        if(error){
            throw error;
        }
        else{
            res.send(filas);
        }
    });
});

app.listen(3000, () => {
    console.log("Servidor corriendo");
});
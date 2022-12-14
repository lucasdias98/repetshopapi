const {pool} = require('../config');
const {request, response} = require('express');

const getClientes = (request, response) => {
    pool.query('SELECT * FROM clientes order by codigo',
        (error, results) => {
            if (error){
                return response.status(400).json(
                    {
                        status : 'error', 
                        message : 'Erro ao consultar o cliente: ' + error
                    }
                );
            }
            response.status(200).json(results.rows);
        }       
    )
}


const addCliente = (request, response) => {
    const {nome, telefone} = request.body;
    pool.query(`INSERT INTO clientes (nome, telefone) 
    values ($1, $2) returning codigo, nome, telefone`,
    [nome, telefone],
    (error, results) => {
        if (error){
            return response.status(400).json({
                status : 'error', 
                message : 'Erro ao inserir o cliente: ' + error
            })
        }
        response.status(200).json({
            status : "success" , message : "Cliente criado",
            objeto: results.rows[0]
        })
    })
}

const updateCliente = (request, response) => {
    const {codigo, nome, telefone} = request.body;
    pool.query(`UPDATE clientes SET nome=$1, telefone=$2
    where codigo=$3 returning codigo, nome, telefone`,
    [nome, telefone, codigo],
    (error, results) => {
        if (error){
            return response.status(400).json({
                status : 'error', 
                message : 'Erro ao alterar o cliente: ' + error
            })
        }
        response.status(200).json({
            status : "success" , message : "Cliente alterado",
            objeto: results.rows[0]
        })
    })
}

const deleteCliente = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`DELETE FROM clientes WHERE codigo = $1`,
    [codigo],
    (error, results) => {
        if (error || results.rowCount == 0){
            return response.status(400).json({
                status : 'error', 
                message : 'Erro ao remover o cliente: ' + 
                (error ? error :'N??o removeu nenhuma linha')
            })
        }
        response.status(200).json({
            status : "success" , message : "Cliente removido"
        })
    })
}

const getClientePorCodigo = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`SELECT * FROM clientes WHERE codigo = $1`,
    [codigo],
    (error, results) => {
        if (error || results.rowCount == 0){
            return response.status(400).json({
                status : 'error', 
                message : 'Erro ao recuperar o cliente: ' + 
                (error ? error :'N??o encontrou nenhuma linha')
            })
        }
        response.status(200).json(results.rows[0])
    })
}

module.exports = {
    getClientes, addCliente, updateCliente, deleteCliente, getClientePorCodigo
}


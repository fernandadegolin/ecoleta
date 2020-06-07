const express = require("express")
const server = express()

// Pegar Banco de Dados
const db = require("./database/db")

// Configurar pasta Publica (para nao perder o caminho do css e js)
server.use(express.static("public"))

// Habilitar o uso do req.body na aplicação
server.use(express.urlencoded ({extended: true}))

// Usando Template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})


// Configurar caminhos da minha aplicação
// req = Requisição    res = Resposta
server.get("/", (req, res) => {
    return res.render("index.html", {title: "novo titulo"})
}) 

server.get("/create-point", (req, res) => {
    // req.query = Query Strings da nossa url
    //console.log(req.query)    
    
    return res.render("create-point.html")
}) 

server.post("/savepoint", (req, res) => {
    // req.body = O corpo do nosso formulario
    //console.log(req.body)

    // Inserir dados no Banco de Dados
    // 2) Inserir dados na tabela
    const query = `
        INSERT INTO places(
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
       req.body.image,
       req.body.name,
       req.body.address,
       req.body.address2,
       req.body.state,
       req.body.city,
       req.body.items
    ]

    function afterInsertData(err){
        if (err){
            console.log(err)
            return res.send("Erro no cadastro")
        }
        console.log("Cadastrado com sucesso")
        console.log(this)
        
            return res.render("create-point.html", { saved: true})
    }

    db.run (query, values, afterInsertData)

})

server.get("/search", (req, res) => {

    const search = req.query.search 

    if (search == ""){ // QUANDO A PESQUISA VIER VAZIA
        return res.render("search-results.html", { total: 0})
    }


    // Pegar dados do Banco de Dados para alimentar o site de forma automática
        // 3) Consultar os dados da tabela
        db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
            if (err){
            return console.log(err)
        }

        const total = rows.length
    
    // Mostrar no HTML o Banco de Dados
    return res.render("search-results.html", { places: rows, total: total})
})

}) 

// Ligar o servidor
server.listen(3000)
import http from 'node:http';
import { fakerPT_BR as faker } from '@faker-js/faker';
import mysql from 'mysql2';

const pool = mysql.createPool({
    host     : 'db',
    user     : 'root',
    password : 'root',
    database : 'nodedb'
  }).promise();
const server = http.createServer(async (req, res)=>{
    if(req.method == 'GET' && req.url.endsWith('favicon.ico')){
        res.statusCode = 204;
        res.end();
        return; 
    }

    await insertName(faker.person.firstName());

    let people = await getPeople();

    let html = buildHtmlFromResponse(people);
     
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.end(html);
});

async function insertName(firstName){
   await pool.query(`INSERT INTO people(name) values (?)`, [firstName]);
}


async function getPeople(){
    let result = await pool.query("SELECT * FROM people");  
    let people = JSON.parse(JSON.stringify(result[0]));
    return people; 
}

function buildHtmlFromResponse(people){
    let html = `<html> 
    <head>
        <style>
            table {
                font-family: arial, sans-serif;
                border-collapse: collapse;
                width: 100%;
            } 
            td, th {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
            }
            tr:nth-child(even) {
                background-color: #dddddd;
            }
        </style>
    </head>
    <body> 
        <h1>Full Cycle Rocks!</h1> 
        <table><tr><th>Id</th><th>Name</th></tr> \n`;
    people.forEach(person => {
        html += `<tr><td>${person.id}</td><td>${person.name}</td></th> \n`
    });
    html += '</body></html>';
    return html;
};
let port = 1234;
server.listen(port,()=>{
    console.log(`Server running at :${port}/`);
});
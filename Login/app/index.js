const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://ElUssy99:hola123456@cluster0-377gj.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri);

var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Collecciones MongoDB
var users = [];
var cartasDB = [];
var mazosDB = [];

// Informacion del Uusario Logeado
var userLogin;
var cartas = [];
var mazos = [];
var cartasMazos = [];

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('Hola');
});

// Forumlario
app.get('/login', function(req, res) {
    res.render('index');
});

app.post('/login', function(req, res){
  //console.log(req.body.name, req.body.pass);
  var correcto = false;
  for (var i = 0; i < users.length; i++) {
    //console.log(users[i]);
    if(users[i].nombre_usuario == req.body.name && users[i].contrasenya_usuario == req.body.pass){
      correcto = true;
      userLogin = users[i];
      break;
    }
  }

  if (correcto == true) {
    listCartasYMazos();

    res.render('user', {
      usuario: userLogin,
      listaCartas: cartas,
      listaMazos: mazos,
      cartasDelMazos: cartasMazos
    });

  } else if (correcto == false) {
    res.send("El usuario es incorrecto.");
  }
});

function listCartasYMazos() {
  console.log("");
  /*console.log("Cartas de MongoDB:");
  for (var i = 0; i < cartasDB.length; i++) {
    console.log(cartasDB[i]);
  }
  console.log("Cartas del Usuario:");
  for (var i = 0; i < userLogin.cartas_usuario.length; i++) {
    console.log(userLogin.cartas_usuario[i]);
  }*/
  for (var i = 0; i < cartasDB.length; i++) {
    for (var x = 0; x < userLogin.cartas_usuario.length; x++) {
      if (cartasDB[i].id == userLogin.cartas_usuario[x]) {
        //console.log(cartasDB[i]);
        cartas.push(cartasDB[i]);
      }
    }
  }

  for (var i = 0; i < mazosDB.length; i++) {
    for (var x = 0; x < userLogin.mazos_usuario.length; x++) {
      if (mazosDB[i].id_mazo == userLogin.mazos_usuario[x]) {
        console.log(mazosDB[i]);
        mazos.push(mazosDB[i]);
      }
    }
  }

  for (var i = 0; i < mazosDB.length; i++) {
    cartasMazos.push(mazosDB[i].cartas_en_mazo);
    console.log(mazosDB[i].cartas_en_mazo);
  }
}

// Conectar a la Base de Datos
async function main(){
    try {
        await client.connect();
        console.log("");
        console.log("LEAGUE OF RUNATERRA");
        /*await listUsuariosDB();
        await listCartasDB();
        await listMazosDB();*/
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

MongoClient.connect(uri, function(err, db) {
  //console.log("");
  //console.log("Collection:");
  if (err) throw err;
    var dbo = db.db("LeagueOfRunaterra");
    dbo.collection("Usuarios").find({}).toArray(function(err, result) {
      if (err) throw err;
        //console.log(result);
        users = result;
        db.close();
    });

  if (err) throw err;
    var dbo = db.db("LeagueOfRunaterra");
    dbo.collection("Cartas").find({}).toArray(function(err, result) {
      if (err) throw err;
        //console.log(result);
        cartasDB = result;
        db.close();
    });

  if (err) throw err;
    var dbo = db.db("LeagueOfRunaterra");
    dbo.collection("Mazos").find({}).toArray(function(err, result) {
      if (err) throw err;
        //console.log(result);
        mazosDB = result;
        db.close();
    });
});

// ESTOS 3 METODOS NO FUNCIONA
/*async function listUsuariosDB() {
  console.log("");
  console.log("Usuarios:");
  for (var i = 0; i < users.length; i++) {
    console.log(users[i]);
  }
}

async function listCartasDB() {
  console.log("");
  console.log("Cartas:");
  for (var i = 0; i < cartasDB.length; i++) {
    console.log(cartasDB[i]);
  }
}

async function listMazosDB() {
  console.log("");
  console.log("Mazos:");
  for (var i = 0; i < cartasDB.length; i++) {
    console.log(cartasDB[i]);
  }
}*/

// NO CREO KE LO UTILICE
/*MongoClient.connect(uri, function(err, db) {
  if (err) throw err;
  var dbo = db.db("LeagueOfRunaterra");
  for (var i = 0; i < userLogin.cartas_usuario.length; i++) {
    console.log(userLogin.cartas_usuario[i]);

    var query = {id : userLogin.cartas_usuario[i]};
    dbo.collection("Cartas").find({query}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      cartas = result;
      db.close();
    });
  }
});*/

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});

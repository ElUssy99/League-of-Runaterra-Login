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
  var correcto = false;
  for (var i = 0; i < users.length; i++) {
    if(users[i].nombre_usuario == req.body.name && users[i].contrasenya_usuario == req.body.pass){
      console.log(users[i]);
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
  console.log("Cartas del Usuario:");
  for (var i = 0; i < cartasDB.length; i++) {
    for (var x = 0; x < userLogin.cartas_usuario.length; x++) {
      if (cartasDB[i].id == userLogin.cartas_usuario[x]) {
        console.log(cartasDB[i]);
        cartas.push(cartasDB[i]);
      }
    }
  }
  console.log("");
  console.log("Mazos del Usuario:");
  for (var i = 0; i < mazosDB.length; i++) {
    for (var x = 0; x < userLogin.mazos_usuario.length; x++) {
      if (mazosDB[i].id_mazo == userLogin.mazos_usuario[x]) {
        console.log(mazosDB[i]);
        mazos.push(mazosDB[i]);
      }
    }
  }
  console.log("");
  console.log("Cartas de cada Mazo:");
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
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

MongoClient.connect(uri, function(err, db) {
  if (err) throw err;
    var dbo = db.db("LeagueOfRunaterra");
    dbo.collection("Usuarios").find({}).toArray(function(err, result) {
      if (err) throw err;
        users = result;
        db.close();
    });

  if (err) throw err;
    var dbo = db.db("LeagueOfRunaterra");
    dbo.collection("Cartas").find({}).toArray(function(err, result) {
      if (err) throw err;
        cartasDB = result;
        db.close();
    });

  if (err) throw err;
    var dbo = db.db("LeagueOfRunaterra");
    dbo.collection("Mazos").find({}).toArray(function(err, result) {
      if (err) throw err;
        mazosDB = result;
        db.close();
    });
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});

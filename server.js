import express from 'express';
import { joyas } from './data/joyas.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Esta funcionando');
});

function HATEOASV2(joyas) {
  return joyas.map(joya => ({
    ...joya,
  }));
}


app.get("/joyas", (req, res) => {
  try {
    const joyasLinks = HATEOASV2(joyas);
    let {fields} = req.query;
    if(fields){
      const joyasFiltradas = joyas.results.filter(joya => {
        for (let key in fields) {
          if (joya[key] == undefined || joya[key].toString() !== fields[key]) {
            return false;
          }
        }
        return true;
      });
      res.json(joyasFiltradas);
    } else {
      res.json(joyasLinks);
    }  
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

app.get("/joyas/category/:category", (req, res) => {
  try {
    let { category } = req.params;
    const joyasFiltradas = joyas.filter((joya) => joya.category === category);
    res.json(joyasFiltradas);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});


app.get("/joyas/:id", (req, res) => {
  try {
    let joyaEncontrada = joyas.find((joya) => joya.id == req.params.id);
    if (joyaEncontrada) {
      res.json(joyaEncontrada);
    } else {
      res.status(404).json("No existe la joya con ese id");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});


app.get("/api/joyas", (req, res) => {
  const { values } = req.query;
  if (values == "asc") return res.send(orderValues("asc"));
  if (values == "desc") return res.send(orderValues("desc"));
  if (req.query.page) {
    const { page } = req.query;
    return res.send({ joyas: HATEOASV2(joyas).slice(page * 2 - 2, page * 2) });
  }
  res.send({
    joyas: HATEOASV2(joyas),
  });
});

app.listen(3000, () => console.log('servidor arriba en el puerto 3000'));
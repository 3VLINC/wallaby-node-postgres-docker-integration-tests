import * as express from 'express';
import * as cors from 'cors';
import { db } from './db';

const app = express()

const whitelist = ['localhost'];

const corsOptions = {
  origin: function(origin, callback){
    console.log(origin);
    const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted);
  }
};

app.all('/', async (req, res) => {
  
  

  // db.transaction((trx) => {

  //   knex('posts').transacting(trx).insert({name: 'Post 1', body: 'Content'})
  //     .then(function(resp) {
  //       var id = resp[0];
  //       return res.send(id);
  //     })
  //     .then(trx.commit)
  //     .catch(trx.rollback);
  // }); 

  

  res.send('ok');

});

app.post('/create-post', (req, res) => {

});

app.listen(80, function () {
  console.log('Example app listening on port 80!')
})
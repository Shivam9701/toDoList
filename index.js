import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', 'views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});
let tasksList = [];
app.post('/submit', (req, res) => {
    
    const task = req.body.task;
    console.log(task);

    if (task) {
        tasksList.push(task);
    }
    res.locals.listTasks = tasksList;
    req.body.task=null;
    res.render('index');

});

app.listen(port, () => {
    console.log('listening on port');
});
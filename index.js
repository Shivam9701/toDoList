import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import axios from 'axios';
import { type } from 'os';
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret =process.env.SPOTIFY_CLIENT_SECRET;
console.log("hi " +spotify_client_id);
const app = express();
const port = 3000;

var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', 'views');
app.set('view engine', 'ejs');
//const accessToken = "BQBx_JVcy1Xo7eysLhBTNsz-M475sBoZkbKtUkHzRQm_xfotYsnBapo-13EwbuasYsSWQ6qARHC55TbmW7iiEBb-faGkC_pJg1F0KPW7Dpd8JN3dnk8SeYVuM8H4eAjq7deweUKA8ObdcxlqZttDtg-8t1w1OvkrdqybSO_nQfrSub0HxEUg_2hZT5w8rENVCmPEvB25bswHsLuiX2iNPYhGa3dC";
app.get('/', (req, res) => {
    if (!req.query.valid){
    console.log(req.body);
    res.render('home');
    }else{
        console.log("name"+req.query.valid);
        res.render('home');
    }
});

let tasksList = [];

app.get('/auth/login', (req, res) => {

    var scope = "streaming \
               user-read-email \
               user-read-private";

    var state = generateRandomString(16);

    var auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri: "http://localhost:3000/auth/callback",
        state: state
    });
    //console.log(spotify_client_id);

    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString())

});
app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    const url ='https://accounts.spotify.com/api/token';
    const redirectUri = "http://localhost:3000/auth/callback";

    const body = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
    };
    const config ={
        headers : {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded',
    },
};
    try {
        const response =await axios.post(url,body,config);
        //console.log(response.data);
        var accessToken = response.data.access_token;
        const rep = await axios.get(
            "https://api.spotify.com/v1/tracks/4JvziZ2kQsbzfvRQtpYfmJ",
            {
                headers: {
                    Authorization: "Bearer " + accessToken ,
                },
            }
        );
        const data =rep.data;
        console.log("gand\n");
        console.log(data.album);
        
        
        var string = encodeURIComponent(data.album.name);
        res.redirect('/?valid='+string);
        
    } catch (error) {
        console.error(error);
        res.status(500).send('error');
    }

});
app.get('/play',(req, res) => {
    
})

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
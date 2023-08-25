import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-node';
import { type } from 'os';
dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const app = express();
const port = 3000;
const spotifyApi =new SpotifyWebApi();
var songQueue =[];
var songSet =new Set();


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', 'views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {

    if (!req.query.valid) {
        
        res.render('home');
    } 
    else { 
        console.log("authorized! valid : " + req.query.valid);
        res.render('index');
        
    }

});

app.get('/play',async(req,res) => {

    if(req.query.track) {
    const track = req.query.track;

    const response =await spotifyApi.getTrack(track);
    console.log(response.body.album);

    let song = { img: "", id: "", name: "", artists: "", };

    song.img =response.body.album.images[0].url;
    song.id =response.body.album.id;
    song.name = response.body.album.name;
    response.body.album.artists.forEach(artist => {
        song.artists+=(artist.name) + ", ";
    });

    songQueue.push(song);
    res.redirect('/play');
    }
    app.locals.q=songQueue;
    app.locals.player=songQueue[0];

    res.render('index');
});

app.post('/', async(req, res) => {

    const task = req.body.task;
    let songsDisplay = [];
    //console.log(task);
    try{
    const response = await spotifyApi.searchTracks(task,{limit:5});
    //console.log(response.body);
    const listTasks = response.body.tracks.items;
    
    

    listTasks.forEach(track =>{
        //console.log(track);
        let song = { name: "", duration: "", artists: "", img: "" ,id:""};
        song.name =track.name;
        //console.log(song.name);
        song.duration = millisToMinutesAndSeconds(track.duration_ms);
        //console.log(song.duration);

        for (let i = 0; i<track.artists.length ;i++){
            song.artists+=track.artists[i].name+", ";
            //console.log(song.artists[i]);
        }
        song.img=track.album.images[0].url;
        //console.log(song.img);
        song.id=track.id;
        //console.log(song.id);
        songsDisplay.push(song);
    });
    res.locals.taskString=`Showing top 5 results for '${task}'`;
    res.locals.songsDisplay=songsDisplay;
    res.status(200).render('index');

    }
    catch(err){
        console.error(err);
        res.status(404).send(err);
    }
    

});



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
    const url = 'https://accounts.spotify.com/api/token';
    const redirectUri = "http://localhost:3000/auth/callback";

    const body = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
    };
    const config = {
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    try {
        const response = await axios.post(url, body, config);
        //console.log(response.data);
        var accessToken = response.data.access_token;
        // const rep = await axios.get(
        //     "https://api.spotify.com/v1/tracks/4JvziZ2kQsbzfvRQtpYfmJ",
        //     {
        //         headers: {
        //             Authorization: "Bearer " + accessToken,
        //         },
        //     }
        // );
        // const data = rep.data;       
        // var string = encodeURIComponent(data.album.name);
        spotifyApi.setAccessToken(accessToken);
        var string="start";
        res.redirect('/?valid=' + string);

    } catch (error) {
        console.error(error);
        res.status(500).send('error');
    }

});

var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}



app.listen(port, () => {
    console.log('listening on port');
});
const express = require('express');
// const router = require('./routers/export-routers');
const path = require('path');
const mongoose = require('mongoose');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const homeRoutes = require("./routes/home");
const cardRoutes = require("./routes/card");
const addRoutes = require("./routes/add");
const ordersRoutes = require('./routes/orders');
const courseRoutes = require("./routes/courses");
const authRoutes = require('./routes/auth');
const User = require('./models/user');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

// C:\Program Files\MongoDB\Server\4.2\data\

//const MONGODB_URI = `mongodb+srv://LazarevKirill:opeCv6qi2S5l7GaD@cluster0-jgb4m.mongodb.net/shop`;
const MONGODB_URI = `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`;

const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});
const store = new MongoStore({
    collection: 'session',
    uri: MONGODB_URI
})

app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');
app.set('views', 'src/views');

// app.use(async (req, res, next) => {
//     try {
//         const user = await User.findById(`5e7dda550f6b991070aa715c`)
//         req.user = user
//         next()
//     } catch (e) {
//         console.log(e)
//     }
// })

// app.use(express.static('src/public'));
app.use(express.static(path.join(__dirname, '../', 'src/public')));
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes);
app.use('/courses', courseRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

//
// app.get('/', (req, res) => {
//     // res.sendFile(path.join(__dirname, 'views', 'index.hbs'))
//     res.render('index')
// });
//
// app.get('/about', (req, res) => {
//     // res.sendFile(path.join(__dirname, 'views', 'about.hbs'))
//     res.render('about')
// });

const port = process.env.PORT || 3001

// app.use(express.json())
// app.use('/users', router.userRouter)
// app.use(express.static(__dirname + "/public"));

async function start() {
    try {
         // await mongoose.connect(url, {

        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        // const candidate = await User.findOne()
        // if (!candidate) {
        //     const user = new User({
        //         email: 'lazeratrax@gmail.com',
        //         name: 'Kirill',
        //         cart: {items: []}
        //     })
        //     await user.save()
        // }

        app.listen(port, () => {
            console.log('сервер грузится на localhost:' + port)
        })
    } catch (e) {
        console.log(e)
    }
}

start()




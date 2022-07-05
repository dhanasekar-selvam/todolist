const app=require('fastify')({logger:true});

const mongoose=require("mongoose");
require("dotenv").config();
app.register(require("@fastify/cors"), {
    origin: "*",
    methods: ["POST","GET","PUT","DELETE"]
  });
app.register(require('fastify-swagger'),{
    exposeRoute:true,
    routePrefix:'/docs',
    swagger:{
        info:{title:'fastify-api'},
    }
})

//routes
app.register(require("./routes/users"))

app.register(require("./routes/todo"))



//mongodb connections
const CONNECTION_URL=process.env.mongo_connect_url;

const port=process.env.port|| 5000;

 mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
 .then(()=>app.listen(port,(err,address)=>{
    if(err)
    {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`Server listening on${address}`)
}))
 .catch((err)=>console.log(err));


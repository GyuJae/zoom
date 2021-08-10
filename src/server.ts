import express from "express";

const PORT: number = 3000;

const app: express.Application = express();

//middlewares
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res: express.Response) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:${PORT}`);

app.listen(PORT, handleListen);

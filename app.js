const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");
const favoriteRouter = require("./routes/api/favorite");
const authRouter = require("./routes/api/auth");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/contacts", favoriteRouter);
app.use("/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

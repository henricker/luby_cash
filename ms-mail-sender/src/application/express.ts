import app from "./api/app";

const PORT = process.env.PORT || 3535
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
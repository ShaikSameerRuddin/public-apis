export default{
    port: process.env.PORT  || "5000",
    dbUrl:process.env.DB_URL,
    jwtSecretKey: process.env.JWT_SECRET,
}
// swagger.ts
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Express Starter",
    description: "API documentation for Express starter Backend",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "../swagger-output.json";
const endpointsFiles = ["./src/index.ts"]; // 👈 your main route file

swaggerAutogen(outputFile, endpointsFiles, doc);
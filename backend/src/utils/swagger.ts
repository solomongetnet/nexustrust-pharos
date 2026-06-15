// swagger.ts
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Pharos Hackathon",
    description: "API documentation for Pharos Hackathon Backend",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "../swagger-output.json";
const endpointsFiles = ["./src/index.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);  
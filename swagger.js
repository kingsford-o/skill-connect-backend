import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Skill Connect Messaging API",
      version: "1.0.0",
      description: "API for managing conversations and messages.",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./server.js"], // 👈 make sure this path is correct
};

export default swaggerJSDoc(options);

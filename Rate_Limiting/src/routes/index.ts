import express from "express";
import path from "path";
import ratelimit from "./ratelimit"

const router = express.Router();

const defaultRoutes = [
  {
    path: "/ratelimit",
    route: ratelimit,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.get("/", async (req, res) => {
  return res.send("Server is running");
});


export default router;
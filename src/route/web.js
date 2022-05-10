import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userControler";

let router = express.Router();
let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/crud", homeController.getCRUD);

  router.get("/get-crud", homeController.displayCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/post-crud", homeController.postCRUD);

  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  router.post('/api/login', userController.handleLogin);
  router.get('/api/get-user', userController.handleGetUsers);
  router.post('/api/create-new-user', userController.handleCreateNewUser);
  router.put('/api/update-user', userController.handleUpdateUser);
  router.delete('/api/delete-user', userController.handleDeleteUser);

  router.get('/allcode', userController.getAllCode);

  return app.use("/", router);
};

module.exports = initWebRoutes;

import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";

let router = express.Router();
let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/crud", homeController.getCRUD);
  router.get("/get-crud", homeController.displayCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-user", userController.handleGetUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/update-user", userController.handleUpdateUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.get("/api/allcode", userController.getAllCode);

  router.get("/api/home-top-doctor", doctorController.getTopDoctorHome);
  router.get("/api/get-all-doctors", doctorController.getAllDoctors);
  router.post("/api/save-info-doctor", doctorController.postSaveInfoDoctor);
  router.get("/api/get-detail-doctor", doctorController.getDetailDoctor);
  router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule)
  router.get("/api/get-schedule-doctor-by-date", doctorController.getScheduleByDate)
  router.get("/api/get-extra-info-doctor-by-id", doctorController.getExtraInfoDortorById)
  router.get("/api/get-profile-doctor-by-id", doctorController.getProfileDortorById)

  router.post("/api/patient-book-appointment", patientController.postBookAppointment)
  router.post("/api/verify-book-appointment", patientController.postVerifyBookAppointment)

  router.post("/api/create-new-specialty", specialtyController.createSpecialty)
  router.get("/api/get-specialty", specialtyController.getAllSpecialty)



  return app.use("/", router);
};

module.exports = initWebRoutes;

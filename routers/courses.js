const Controller = require("../controllers/controller");

const router = require("express").Router();

// Router untuk tambah course
// router.get("/add", Controller.addCoursesForm);
// router.post("/add", Controller.addCourses);

// Router cek detail materi berdasarkan courseId
router.get("/:courseId/materials", Controller.courseMaterials);

//Router untuk tambah materi berdasarkan courseId
router.get("/:courseId/materials/add", Controller.addMaterialsForm);
router.post("/:courseId/materials/add", Controller.addMaterials);

//Router untuk edit materi berdasarkan courseId dan materialId
router.get(
  "/:courseId/materials/:materialId/edit",
  Controller.editMaterialsForm,
);
router.post("/:courseId/materials/:materialId/edit", Controller.editMaterials);

//Router untuk delete materi berdasarkan courseId dan materialId
router.get(
  "/:courseId/materials/:materialId/delete",
  Controller.deleteMaterials,
);

module.exports = router;

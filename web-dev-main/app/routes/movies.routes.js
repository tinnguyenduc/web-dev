const router = require("express").Router();
const multer = require("multer");

let storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const moviesService = require("../services/movies.service");

router.post("/add/movie", moviesService.addMovie);
router.get("/", moviesService.getMovies);
router.get("/:id", moviesService.getMovieById);
router.put("/:id", moviesService.updateMovieById);
router.post("/add/movie/image", moviesService.addMovieWithImage);

//Upload a single movie image
router.post("/upload/:id", upload.single("file"), moviesService.uploadImage);

module.exports = router;


import { Router } from "express";
import * as projectsController from "../controllers/projects";

const router = Router();

// Check section 1-2 in the README for more details on how to create these routes.
router.get("/projects/all", projectsController.getAllProjects);
router.get("/projects/:id", projectsController.getProjectById);
router.post("/projects", projectsController.createProject);
router.put("/projects/:id", projectsController.updateProject);
router.delete("/projects/:id", projectsController.deleteProject);

export default router;

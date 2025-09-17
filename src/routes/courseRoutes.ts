import { Router, Request, Response } from "express";
import { courses } from "../db/db";
import { Course } from "../libs/types"
const router = Router();

// READ all
router.get("/", (req: Request, res: Response) => {
  res.json(courses);
}); 

// Params URL เหมาะกับ ID มากก่วา
router.get("/:courseId", async (req: Request, res: Response, next:Function) => {
  try {
      const courseId = req.params.courseId;
      console.log(courseId);
      let filtered = courses;
        if (courseId !== null) {
            filtered = filtered.filter((couses:Course) => couses.courseId === parseInt(courseId));
            res.send(filtered).json;
        }
  } catch (err) {
    next(err);
  }
});

// Query string ต้องปิด get All ก่อน 
router.get("/", async (req: Request, res: Response, next:Function) => {
  try {
      const courseId = req.query.courseId as string | undefined;
      console.log(req.query.course as string | undefined);
      let filtered = courses;
        if (courseId) {
            filtered = filtered.filter((couses:Course) => couses.courseId === parseInt(courseId));
            res.send(filtered).json;
        }
  } catch (err) {
    next(err);
  }
});

export default router;
import { Router, Request, Response } from "express";
import { students } from "../db/db";
import { zStudentPostBody, zStudentPutBody } from "../schemas/studentSchema"
import { Student } from "../libs/types"
const router = Router();

// READ all
router.get("/", (req: Request, res: Response) => {
   return res.json(students);
}); 

// Params URL เหมาะกับ ID มากก่วา
router.get("/:program", async (req: Request, res: Response, next:Function) => {
  try {
      const program = req.params.program;
      console.log(program);
      let filtered = students;
        if (program !== null) {
            filtered = filtered.filter((std:Student) => std.program === program);
            return  res.send(filtered).json;
        }
  } catch (err) {
    next(err);
  }
});

// Query
router.get("/", async (req: Request, res: Response, next:Function) => {
  try {
  const program = req.query.program;
  console.log(program);
  let filtered = students;
    if (program !== null) {
        filtered = filtered.filter((std:Student) => std.program === program);
        return res.send(filtered).json;
    }
  } catch (err) {
    next(err);
  }
});

// CREATE //ต้องไปเพิ่ม setting postman header / boby -> row -> type json 
router.post("/", async(req: Request, res: Response,next:Function) => {
  try {
      const body = await req.body;
      console.log(req.body,body);
      // เอา data ที่เป็น any type ไป validate โดยใช้ zod schema
      const result = zStudentPostBody.safeParse(body); // check zod
      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error
        });
      }
      //check duplicate student id
      const foundDupe = students.find((std:Student) => std.studentId === req.body.studentId);
      if (foundDupe) {
        return res.status(400).json( 
          { ok: false, message: "Student Id already exists" }, //กำหนด error เอง เช่น ok:false
        );
      }

    const newStd = students.push(req.body);
      return res.json(newStd);
      // return res.json({ ok: true, message: "successfuly" });
  } catch (err) {
    next(err);
  }
});

router.put("/", async(req: Request, res: Response,next:Function) => {
  try {
      const body = await req.body;
      console.log(req.body,body);
      const parseResult = zStudentPutBody.safeParse(body);
      if (parseResult.success === false) {
    return res.status(400).json(
      {
        ok: false,
        message: parseResult.error.issues[0].message,
      },
    );
  }

  const foundIndex = students.findIndex(
    (std:Student) => std.studentId === body.studentId
  );
  if (foundIndex === -1) {
    return res.status(400).json(
      {
        ok: false,
        message: "Student ID does not exist",
      }
    );
  }

  students[foundIndex] = { ...students[foundIndex], ...body };
  return res.json({ ok: true, student: students[foundIndex] });
  }catch(err){
   next(err);
  }
});


export default router;
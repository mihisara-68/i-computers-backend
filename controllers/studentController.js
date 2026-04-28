import Student from "../models/student.js";

export function createStudent(req, res) {

    if(req.user == null){
        res.status(403).json({
            message : "unauthorized accese you need to loging befor creating students"

        })
        return
    }

    if(!req.user.isAdmin){
        res.status(403).json({
            message : "only admins can create students"
        })
        return
    }

    const newStudent = new Student({
        name: req.body.name,
        age: req.body.age,
        city: req.body.city,
    });

    newStudent.save().then(() => {
        res.json({
            message: "Student created successfully",
        });
    }).catch((error) => {
        console.error("Error creating student:", error);
});
}

export async function createStudentAsync(req,res){
    try{

        const newStudent = new Student({
        name: req.body.name,
        age: req.body.age,
        city: req.body.city,
    });
         
    await newStudent.save()
    res.json({
        messae:"Student created succesfully",
    });
    }catch(error){
        console.error("Error create student:", error);
    }
}



export function getStudents(req, res) {
    Student.find().then(
        (students) => {
            res.json(students);
        }
    )
}

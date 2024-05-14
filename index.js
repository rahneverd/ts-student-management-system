import inquirer from "inquirer";
class StudentManagementSystem {
    students = [];
    availableCourses = [{
            CourseName: "Computer Science",
            CourseFee: 1000
        }, {
            CourseName: "Communication Skills",
            CourseFee: 500
        }, {
            CourseName: "Artificial Intelligence",
            CourseFee: 1500
        }, {
            CourseName: "Graphics Designing",
            CourseFee: 2000
        }];
    generateStudentId() {
        return 10000 + this.students.length + 1;
    }
    getStudentById(studentId) {
        return this.students.find(student => student.StudentId === studentId);
    }
    enrollCourse(studentId, selectedCourses) {
        const student = this.getStudentById(studentId);
        if (student) {
            selectedCourses.forEach(courseName => {
                const addedCourse = this.availableCourses.find(course => course.CourseName === courseName);
                if (addedCourse) {
                    student.Courses.push(addedCourse);
                }
            });
            student.TotalFee = student.Courses.reduce((total, course) => total + course.CourseFee, 0);
            console.log(`${selectedCourses.join(', ')} enrolled successfully!`);
        }
    }
    payTuition(studentId, amount) {
        const student = this.getStudentById(studentId);
        if (student) {
            student.PaidFee += amount;
            student.Balance = student.TotalFee - student.PaidFee;
            console.log(`${student.Name} paid tuition fees of $${amount}`);
            this.displayAllStudents();
        }
    }
    displayStatus() {
        const tableData = this.students.map(student => ({
            "ID": student.StudentId,
            "Name": student.Name,
            "Gender": student.Gender,
            "Courses": student.Courses.map(course => course.CourseName),
            "Total Fee": student.TotalFee,
            "Paid Fee": student.PaidFee,
            "Balance": student.Balance
        }));
        console.table(tableData);
    }
    addStudent(student) {
        student.StudentId = this.generateStudentId();
        this.students.push(student);
        console.log(`Student ${student.Name} added successfully!`);
    }
    removeStudent(studentId) {
        this.students = this.students.filter(student => student.StudentId !== studentId);
        console.log(`Student with ID ${studentId} removed successfully!`);
    }
    displayAllStudents() {
        const tableData = this.students.map(student => ({
            "ID": student.StudentId,
            "Name": student.Name,
            "Gender": student.Gender,
            "Courses": student.Courses.map(course => course.CourseName),
            "Total Fee": student.TotalFee
        }));
        console.table(tableData);
    }
    getStudentsList() {
        return this.students;
    }
    getCoursesList() {
        return this.availableCourses;
    }
}
async function startApplication() {
    const studentSystem = new StudentManagementSystem();
    let isRunning = true;
    while (isRunning) {
        const mainPrompt = await inquirer.prompt({
            type: "list",
            name: "choice",
            message: "Choose an option:",
            choices: ["Add Student", "View Students", "Enroll in Course", "Pay Tuition", "Show Student Status", "Exit"]
        });
        switch (mainPrompt.choice) {
            case "Add Student":
                const admissionForm = await inquirer.prompt([
                    {
                        type: "input",
                        name: "Name",
                        message: "Enter Student Name:"
                    },
                    {
                        type: "list",
                        name: "Gender",
                        message: "Select Student Gender",
                        choices: ["Male", "Female"]
                    }
                ]);
                await studentSystem.addStudent({
                    StudentId: 0,
                    Name: admissionForm.Name,
                    Gender: admissionForm.Gender,
                    Courses: [],
                    TotalFee: 0,
                    PaidFee: 0,
                    Balance: 0
                });
                break;
            case "View Students":
                studentSystem.displayAllStudents();
                break;
            case "Enroll in Course":
                const selectedCourses = await inquirer.prompt([
                    {
                        type: "list",
                        name: "StudentId",
                        message: "Enter Student Id to enroll in course",
                        choices: studentSystem.getStudentsList().map(std => `${std.StudentId} ${std.Name}`),
                        filter: (val) => parseInt(val.split(' ')[0])
                    },
                    {
                        type: "checkbox",
                        name: "Courses",
                        message: "Select Courses, student is going to enroll, at least one course is necessary",
                        choices: studentSystem.getCoursesList().map(course => course.CourseName),
                        validate(answers) {
                            if (answers.length < 1) {
                                console.log("Please select at least one course");
                                return false;
                            }
                            return true;
                        },
                    }
                ]);
                studentSystem.enrollCourse(selectedCourses.StudentId, selectedCourses.Courses);
                break;
            case "Pay Tuition":
                const feeAmountPrompt = await inquirer.prompt([
                    {
                        type: "list",
                        name: "StudentId",
                        message: "Enter Student Id to pay fee",
                        choices: studentSystem.getStudentsList().map(std => `${std.StudentId} ${std.Name}`),
                        filter: (val) => parseInt(val.split(' ')[0])
                    },
                    {
                        type: "number",
                        name: "Amount",
                        message: `Enter the amount to be paid:`,
                        validate: (amount) => {
                            if (isNaN(amount)) {
                                console.log("\nInvalid Fee Amount");
                                return false;
                            }
                            return true;
                        }
                    }
                ]);
                studentSystem.payTuition(feeAmountPrompt.StudentId, feeAmountPrompt.Amount);
                break;
            case "Show Student Status":
                studentSystem.displayStatus();
                break;
            case "Exit":
                isRunning = false;
                break;
        }
    }
}
startApplication();

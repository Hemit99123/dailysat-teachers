export interface School {
    _id: string;
    name: string;
    location: string;
    desc: string;
    joined: string;
    img: string;
    students: string[];  // Array of student emails
    teachers: string[];  // Array of teacher emails
  }
  
import React from 'react';

interface Student {
  name: string;
  age: number;
}

// Student objects
const student1: Student = {
  name: "Alice",
  age: 20
};

const student2: Student = {
  name: "Bob",
  age: 22
};

// Function
function greetStudent(student: Student): string {
  return `Hello ${student.name}, you are ${student.age} years old.`;
}

const App: React.FC = () => {
  return (
    <div>
      <h1>Student Information</h1>
      <p>{greetStudent(student1)}</p>
      <p>{greetStudent(student2)}</p>
    </div>
  );
};

export default App;
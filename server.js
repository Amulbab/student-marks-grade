const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory store for students
// student: { id, name, marks: { subject: score, ... } }
let students = [];
let nextId = 1;

// Grade calculation helper
function computeGrade(avg) {
  if (avg >= 90) return 'A+';
  if (avg >= 80) return 'A';
  if (avg >= 70) return 'B';
  if (avg >= 60) return 'C';
  if (avg >= 50) return 'D';
  return 'F';
}

// Create student
app.post('/students', (req, res) => {
  const { name, marks } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const student = { id: nextId++, name, marks: marks || {} };
  students.push(student);
  res.status(201).json(student);
});

// List students with computed average and grade
app.get('/students', (req, res) => {
  const result = students.map(s => {
    const scores = Object.values(s.marks || {});
    const avg = scores.length ? scores.reduce((a,b)=>a+b,0)/scores.length : 0;
    return { ...s, average: avg, grade: computeGrade(avg) };
  });
  res.json(result);
});

// Get single student
app.get('/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const s = students.find(x => x.id === id);
  if (!s) return res.status(404).json({ error: 'not found' });
  const scores = Object.values(s.marks || {});
  const avg = scores.length ? scores.reduce((a,b)=>a+b,0)/scores.length : 0;
  res.json({ ...s, average: avg, grade: computeGrade(avg) });
});

// Update student marks or name
app.put('/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const s = students.find(x => x.id === id);
  if (!s) return res.status(404).json({ error: 'not found' });
  const { name, marks } = req.body;
  if (name) s.name = name;
  if (marks) s.marks = marks;
  res.json(s);
});

// Delete student
app.delete('/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = students.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  students.splice(idx,1);
  res.status(204).end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

# Student Marks Backend

Simple Express backend to create/list/update/delete students and compute averages and grades.

Run locally:

```powershell
cd backend; npm install; npm start
```

API:
- POST /students  { name, marks }
- GET  /students
- GET  /students/:id
- PUT  /students/:id { name?, marks? }
- DELETE /students/:id

Marks schema example:
{ "Math": 85, "Physics": 92 }

Grade mapping implemented in `index.js`.

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./pharmacy.db'); // Connect to the SQLite database

// Set up middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // For parsing form data

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Home route
app.get('/', (req, res) => {
  // Fetch data from the database
  db.all("SELECT * FROM Pharmacy", [], (err, pharmacyData) => {
    if (err) {
      return res.status(500).send("Database error");
    }

    db.all("SELECT * FROM Medications", [], (err, medicationsData) => {
      if (err) {
        return res.status(500).send("Database error");
      }

      db.all("SELECT * FROM staff", [], (err, staffData) => {
        if (err) {
          return res.status(500).send("Database error");
        }

        db.all("SELECT * FROM Patients", [], (err, patientsData) => {
          if (err) {
            return res.status(500).send("Database error");
          }

          db.all("SELECT * FROM Prescriptions", [], (err, prescriptionsData) => {
            if (err) {
              return res.status(500).send("Database error");
            }

            db.all("SELECT * FROM Billing", [], (err, billingData) => {
              if (err) {
                return res.status(500).send("Database error");
              }

              // Render all the data
              res.render('index', {
                pharmacyData,
                medicationsData,
                staffData,
                patientsData,
                prescriptionsData,
                billingData
              });
            });
          });
        });
      });
    });
  });
});

// Add new pharmacy
app.post('/add-pharmacy', (req, res) => {
    const { name, location } = req.body;
    db.run(`
      INSERT INTO Pharmacy (Name, Location)
      VALUES (?, ?)`,
      [name, location],
      (err) => {
        if (err) {
          return res.status(500).send("Error adding pharmacy");
        }
        res.redirect('/');
      }
    );
  });
  // Delete pharmacy
app.post('/delete-pharmacy/:id', (req, res) => {
    const pharmacyId = req.params.id;
    db.run('DELETE FROM Pharmacy WHERE PharmacyID = ?', [pharmacyId], (err) => {
      if (err) {
        return res.status(500).send("Error deleting pharmacy");
      }
      res.redirect('/');
    });
  });
  // Add new medication
app.post('/add-medication', (req, res) => {
    const { name, description } = req.body;
    db.run(`
      INSERT INTO Medications (Name, Description)
      VALUES (?, ?)`,
      [name, description],
      (err) => {
        if (err) {
          return res.status(500).send("Error adding medication");
        }
        res.redirect('/');
      }
    );
  });
  // Delete medication
app.post('/delete-medication/:id', (req, res) => {
    const medicationId = req.params.id;
    db.run('DELETE FROM Medications WHERE MedicationID = ?', [medicationId], (err) => {
      if (err) {
        return res.status(500).send("Error deleting medication");
      }
      res.redirect('/');
    });
  });
  // Add new staff
app.post('/add-staff', (req, res) => {
    const { fullName, role, phoneNumber, pharmacyId } = req.body;
    db.run(`
      INSERT INTO staff (FullName, Role, PhoneNumber, PharmacyID)
      VALUES (?, ?, ?, ?)`,
      [fullName, role, phoneNumber, pharmacyId],
      (err) => {
        if (err) {
          return res.status(500).send("Error adding staff");
        }
        res.redirect('/');
      }
    );
  });
  // Delete staff
app.post('/delete-staff/:id', (req, res) => {
    const staffId = req.params.id;
    db.run('DELETE FROM staff WHERE StaffID = ?', [staffId], (err) => {
      if (err) {
        return res.status(500).send("Error deleting staff");
      }
      res.redirect('/');
    });
  });
  

// Add new patient
app.post('/add-patient', (req, res) => {
  const { fullName, dateOfBirth, gender, address, phoneNumber } = req.body;
  db.run(`
    INSERT INTO Patients (FullName, DateOfBirth, Gender, Address, PhoneNumber)
    VALUES (?, ?, ?, ?, ?)`,
    [fullName, dateOfBirth, gender, address, phoneNumber],
    (err) => {
      if (err) {
        return res.status(500).send("Error adding patient");
      }
      res.redirect('/');
    }
  );
});

// Delete patient
app.post('/delete-patient/:id', (req, res) => {
  const patientId = req.params.id;
  db.run('DELETE FROM Patients WHERE PatientID = ?', [patientId], (err) => {
    if (err) {
      return res.status(500).send("Error deleting patient");
    }
    res.redirect('/');
  });
});

// Add new prescription
app.post('/add-prescription', (req, res) => {
  const { patientId, medicationId, prescriptionDate, dosage } = req.body;
  db.run(`
    INSERT INTO Prescriptions (PatientID, MedicationID, PrescriptionDate, Dosage)
    VALUES (?, ?, ?, ?)`,
    [patientId, medicationId, prescriptionDate, dosage],
    (err) => {
      if (err) {
        return res.status(500).send("Error adding prescription");
      }
      res.redirect('/');
    }
  );
});

// Delete prescription
app.post('/delete-prescription/:id', (req, res) => {
  const prescriptionId = req.params.id;
  db.run('DELETE FROM Prescriptions WHERE PrescriptionID = ?', [prescriptionId], (err) => {
    if (err) {
      return res.status(500).send("Error deleting prescription");
    }
    res.redirect('/');
  });
});

// Add new billing
app.post('/add-billing', (req, res) => {
  const { patientId, totalAmount, paymentStatus, billingDate } = req.body;
  db.run(`
    INSERT INTO Billing (PatientID, TotalAmount, PaymentStatus, BillingDate)
    VALUES (?, ?, ?, ?)`,
    [patientId, totalAmount, paymentStatus, billingDate],
    (err) => {
      if (err) {
        return res.status(500).send("Error adding billing");
      }
      res.redirect('/');
    }
  );
});

// Delete billing
app.post('/delete-billing/:id', (req, res) => {
  const billId = req.params.id;
  db.run('DELETE FROM Billing WHERE BillID = ?', [billId], (err) => {
    if (err) {
      return res.status(500).send("Error deleting billing");
    }
    res.redirect('/');
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

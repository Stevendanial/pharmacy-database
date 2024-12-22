const sqlite3 = require('sqlite3').verbose();

// Create and connect to the SQLite database
const db = new sqlite3.Database('./pharmacy.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database created/opened successfully');
  }
});

// Create tables
db.serialize(() => {
  // Create Pharmacy table
  db.run(`
    CREATE TABLE IF NOT EXISTS Pharmacy (
      PharmacyID INTEGER PRIMARY KEY,
      Name TEXT NOT NULL,
      Location TEXT NOT NULL
    )
  `);

  // Create Medications table
  db.run(`
    CREATE TABLE IF NOT EXISTS Medications (
      MedicationID INTEGER PRIMARY KEY,
      Name TEXT NOT NULL,
      Description TEXT NOT NULL
    )
  `);

  // Create staff table
  db.run(`
    CREATE TABLE IF NOT EXISTS staff (
      StaffID INTEGER PRIMARY KEY,
      FullName TEXT NOT NULL,
      Role TEXT NOT NULL,
      PhoneNumber TEXT NOT NULL,
      PharmacyID INTEGER,
      FOREIGN KEY (PharmacyID) REFERENCES Pharmacy(PharmacyID)
    )
  `);

  // Create Patients table
  db.run(`
    CREATE TABLE IF NOT EXISTS Patients (
      PatientID INTEGER PRIMARY KEY,
      FullName TEXT NOT NULL,
      DateOfBirth TEXT NOT NULL,
      Gender TEXT NOT NULL,
      Address TEXT NOT NULL,
      PhoneNumber TEXT NOT NULL
    )
  `);

  // Create Prescriptions table
  db.run(`
    CREATE TABLE IF NOT EXISTS Prescriptions (
      PrescriptionID INTEGER PRIMARY KEY,
      PatientID INTEGER,
      MedicationID INTEGER,
      PrescriptionDate TEXT NOT NULL,
      Dosage TEXT NOT NULL,
      FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
      FOREIGN KEY (MedicationID) REFERENCES Medications(MedicationID)
    )
  `);

  // Create Billing table
  db.run(`
    CREATE TABLE IF NOT EXISTS Billing (
      BillID INTEGER PRIMARY KEY,
      PatientID INTEGER,
      TotalAmount REAL NOT NULL,
      PaymentStatus TEXT CHECK (PaymentStatus IN ('Paid', 'Unpaid', 'Pending')) NOT NULL,
      BillingDate TEXT NOT NULL,
      FOREIGN KEY (PatientID) REFERENCES Patients(PatientID)
    )
  `);

  // Insert sample data into Pharmacy table
  db.run(`
    INSERT INTO Pharmacy (PharmacyID, Name, Location) VALUES
    (1, 'Downtown Pharmacy', '123 Main Street'),
    (2, 'Uptown Pharmacy', '456 High Street')
  `);

  // Insert sample data into Medications table
  db.run(`
    INSERT INTO Medications (MedicationID, Name, Description) VALUES
    (1, 'Paracetamol', 'Pain reliever and fever reducer'),
    (2, 'Ibuprofen', 'Anti-inflammatory medication')
  `);

  // Insert sample data into staff table
  db.run(`
    INSERT INTO staff (StaffID, FullName, Role, PhoneNumber, PharmacyID) VALUES
    (1, 'Ahmed Diaa', 'Pharmacist', '111-222-3333', 1),
    (2, 'Mona Ibrahim', 'Cashier', '444-555-6666', 2)
  `);

  // Insert sample data into Patients table
  db.run(`
    INSERT INTO Patients (PatientID, FullName, DateOfBirth, Gender, Address, PhoneNumber) VALUES
    (1, 'Steven Labbeb', '1980-01-01', 'Male', '789 Elm Street', '555-123-4567'),
    (2, 'Mohamed Antar', '1990-02-02', 'Female', '321 Oak Street', '555-987-6543')
  `);

  // Insert sample data into Prescriptions table
  db.run(`
    INSERT INTO Prescriptions (PrescriptionID, PatientID, MedicationID, PrescriptionDate, Dosage) VALUES
    (1, 1, 1, '2024-12-01', '500mg twice daily'),
    (2, 2, 2, '2024-12-02', '200mg three times daily')
  `);

  // Insert sample data into Billing table
  db.run(`
    INSERT INTO Billing (BillID, PatientID, TotalAmount, PaymentStatus, BillingDate) VALUES
    (1, 1, 25.50, 'Paid', '2024-12-05'),
    (2, 2, 40.75, 'Pending', '2024-12-06')
  `);
});

db.close((err) => {
  if (err) {
    console.error('Error closing the database:', err);
  } else {
    console.log('Database setup complete');
  }
});

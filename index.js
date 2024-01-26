const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT1;

app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "ba365df8",
  password: "Cab#22se",
  database: "ba365df8",
});


var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f2a3f7c652fa59",
    pass: "9e39ffae88c593"
  }
});

function createTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS reminders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        reminderMsg VARCHAR(255) NOT NULL,
        remindAt DATETIME NOT NULL,
        isReminded BOOLEAN DEFAULT false
      )
    `;
  
    db.query(createTableQuery, (err, result) => {
      if (err) {
        console.error("Error creating 'reminders' table:", err);
      } else {
        console.log("Table created or already exists");
      }
    });
  }

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
    createTable();
    setupEmailReminderJob();

    app.use(express.static(path.join(__dirname, 'public')));
  }
});

app.post("/addReminder", (req, res) => {
  const {reminderMsg, remindAt} = req.body

  const insertReminderQuery = `
  INSERT INTO reminders (reminderMsg, remindAt, isReminded)
  VALUES (?, ?, ?);
`;
// '${reminderMsg}','${new Date(remindAt)}', 'false'
db.query(insertReminderQuery, [reminderMsg, new Date(remindAt), false], (err, result) => {
  if (err) {
    console.error("Error adding reminder:", err);
    res.status(500).json({ success: false, error: "Error adding reminder" });
  } else {
    const insertedReminder = {
      id: result.insertId,
      reminderMsg,
      remindAt: new Date(remindAt).toISOString(),
      isReminded: false
    };

    console.log("Reminder added successfully:");
    res.status(200).json({ success: true, reminder: insertedReminder });
  }
});
});

app.get("/getAllReminder", (req, res) => {
  const allRemindersQuery = "SELECT * FROM reminders";

  db.query(allRemindersQuery, (err, results) => {
    if (err) {
      console.error("Error getting reminder:", err);
      res.status(500).json({ success: false, error: "Error getting reminder" });
    }else {
      // res.status(200).json([results]);
      res.status(200).json({ reminders: results });
      // res.send({ success: true, reminders: reminders[reminders] });
      // console.log(reminders[reminders]);
    }
  });
});

function setupEmailReminderJob() {
  cron.schedule("* * * * *", () => {
    sendReminders();
  });
}

function sendReminders() {
  
  const sendReminderQuery = 
  `SELECT * FROM reminders
  WHERE isReminded = false AND remindAt <= NOW();
  `;

  db.query(sendReminderQuery, (err, result) => {
    if(err) {
      console.error("Error retrieving reminders:", err);
    }
    // console.log(result)
    result.forEach((reminder) => {
      sendEmailReminder(reminder);
    });
  });

}

function sendEmailReminder(reminder) {

  const mailOptions = {
    from: "hicounselor@gmail.com",
    to: "bunny6111998@gmail.com",
    subject: "Node Mailer",
    text: `Payment Reminder: ${reminder.reminderMsg} due on ${new Date(reminder.remindAt).toLocaleString()}`,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
      markReminderAsSent(reminder.id);
    }
  });
  
}

function markReminderAsSent(reminderId) {
  const updateQuery = `UPDATE reminders SET isReminded = true WHERE id = ${reminderId}`;
  db.query(updateQuery, (err) => {
    if (err) {
      console.error("Error updating reminder:", err);
    } else {
      console.log("Reminder marked as sent");
    }
  });
  
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
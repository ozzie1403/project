import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import PDFDocument from 'pdfkit';
import stream from 'stream';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
let expenses = [
  {
    id: uuidv4(),
    amount: 42.50,
    category: 'food',
    description: 'Grocery shopping',
    date: '2025-06-14'
  },
  {
    id: uuidv4(),
    amount: 35.00,
    category: 'transportation',
    description: 'Gas',
    date: '2025-06-13'
  },
  {
    id: uuidv4(),
    amount: 1200.00,
    category: 'housing',
    description: 'Monthly rent',
    date: '2025-06-01'
  },
  {
    id: uuidv4(),
    amount: 85.99,
    category: 'entertainment',
    description: 'Concert tickets',
    date: '2025-06-10'
  },
  {
    id: uuidv4(),
    amount: 120.00,
    category: 'healthcare',
    description: 'Dentist appointment',
    date: '2025-06-05'
  }
];

// In-memory storage for budgets
let budgets = {
  food: 0,
  transportation: 0,
  housing: 0,
  utilities: 0,
  entertainment: 0,
  healthcare: 0,
  education: 0,
  shopping: 0,
  personal: 0,
  other: 0
};

// In-memory user storage
let users = [];

// Routes
app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

app.post('/api/expenses', (req, res) => {
  const { amount, category, description, date } = req.body;
  
  if (!amount || !category || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newExpense = {
    id: uuidv4(),
    amount: Number(amount),
    category,
    description: description || '',
    date
  };
  
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// Get all budgets
app.get('/api/budgets', (req, res) => {
  res.json(budgets);
});

// Set budget for a category
app.post('/api/budgets', (req, res) => {
  const { category, amount } = req.body;
  if (!category || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Category and numeric amount required' });
  }
  budgets[category] = amount;
  res.json({ category, amount });
});

// Get summary: total spent per category for current month and budget
app.get('/api/summary', (req, res) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JS months are 0-based
  const currentYear = now.getFullYear();
  const summary = {};
  Object.keys(budgets).forEach(category => {
    // Filter expenses for this category and current month/year
    const spent = expenses
      .filter(e => e.category === category &&
        new Date(e.date).getMonth() + 1 === currentMonth &&
        new Date(e.date).getFullYear() === currentYear)
      .reduce((sum, e) => sum + e.amount, 0);
    summary[category] = {
      spent,
      budget: budgets[category],
      overBudget: spent > budgets[category]
    };
  });
  res.json(summary);
});

// Financial Resources API endpoint
app.get('/api/resources', (req, res) => {
  const resources = [
    {
      id: '1',
      title: 'Budgeting 101: How to Create Your First Budget',
      description: 'Learn the fundamentals of creating a personal budget that works for your lifestyle and financial goals.',
      category: 'budgeting',
      readTime: 5,
      imageUrl: 'https://images.pexels.com/photos/6693661/pexels-photo-6693661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      url: '#'
    },
    {
      id: '2',
      title: 'Emergency Fund: Why You Need One and How to Build It',
      description: 'Discover the importance of having an emergency fund and practical steps to start building your financial safety net.',
      category: 'saving',
      readTime: 7,
      imageUrl: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      url: '#'
    },
    {
      id: '3',
      title: 'Debt Repayment Strategies That Actually Work',
      description: 'Explore proven methods for paying down debt efficiently and taking control of your financial future.',
      category: 'debt',
      readTime: 8,
      imageUrl: 'https://images.pexels.com/photos/4386158/pexels-photo-4386158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      url: '#'
    },
    {
      id: '4',
      title: 'Investing for Beginners: Getting Started with Small Amounts',
      description: 'Learn how to start investing with limited funds and build wealth over time through smart investment strategies.',
      category: 'investing',
      readTime: 10,
      imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      url: '#'
    },
    {
      id: '5',
      title: '5 Ways to Cut Your Monthly Expenses',
      description: 'Practical tips for reducing your monthly spending without sacrificing your quality of life.',
      category: 'budgeting',
      readTime: 4,
      imageUrl: 'https://images.pexels.com/photos/3943715/pexels-photo-3943715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      url: '#'
    },
    {
      id: '6',
      title: 'Understanding Credit Scores and How to Improve Yours',
      description: 'Everything you need to know about credit scores, credit reports, and practical steps to boost your creditworthiness.',
      category: 'credit',
      readTime: 9,
      imageUrl: 'https://images.pexels.com/photos/6802048/pexels-photo-6802048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      url: '#'
    }
  ];
  
  res.json(resources);
});

// Register endpoint
app.post('/api/users/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  // Check if user exists
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ email, passwordHash });
  res.status(201).json({ message: 'User registered' });
});

// Login endpoint
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  // Admin bypass
  if (email === 'admin@gmail.com' && password === 'admin') {
    return res.json({ message: 'Admin login successful', email });
  }
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', email });
});

// Advanced analytics endpoint
app.get('/api/analytics', (req, res) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Filter expenses for current month
  const monthlyExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
  });

  // Spending breakdown by category
  const breakdown = {};
  monthlyExpenses.forEach(e => {
    breakdown[e.category] = (breakdown[e.category] || 0) + e.amount;
  });

  // Top 3 categories
  const topCategories = Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, amount]) => ({ category, amount }));

  // Automated savings suggestion (reduce top category by 10%)
  let suggestion = '';
  if (topCategories.length > 0) {
    const top = topCategories[0];
    const saveAmount = (top.amount * 0.1).toFixed(2);
    suggestion = `Try reducing your spending in '${top.category}' by 10% next month to save about £${saveAmount}.`;
  } else {
    suggestion = 'No spending data for this month.';
  }

  res.json({ breakdown, topCategories, suggestion });
});

// PDF report endpoint
app.get('/api/reports/monthly', (req, res) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const monthlyExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
  });

  // Create PDF
  const doc = new PDFDocument();
  const filename = `SmartSpend_Report_${currentYear}_${currentMonth}.pdf`;
  res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-type', 'application/pdf');

  doc.fontSize(20).text('SmartSpend Monthly Expense Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Month: ${now.toLocaleString('default', { month: 'long' })} ${currentYear}`);
  doc.moveDown();

  if (monthlyExpenses.length === 0) {
    doc.text('No expenses recorded for this month.');
  } else {
    doc.font('Helvetica-Bold').text('Date', 50, doc.y, { continued: true });
    doc.text('Category', 150, doc.y, { continued: true });
    doc.text('Description', 250, doc.y, { continued: true });
    doc.text('Amount (£)', 450, doc.y);
    doc.font('Helvetica');
    doc.moveDown(0.5);
    monthlyExpenses.forEach(e => {
      doc.text(e.date, 50, doc.y, { continued: true });
      doc.text(e.category, 150, doc.y, { continued: true });
      doc.text(e.description || '-', 250, doc.y, { continued: true });
      doc.text(e.amount.toFixed(2), 450, doc.y);
    });
    doc.moveDown();
    const total = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    doc.font('Helvetica-Bold').text(`Total: £${total.toFixed(2)}`, { align: 'right' });
  }

  doc.end();
  doc.pipe(res);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
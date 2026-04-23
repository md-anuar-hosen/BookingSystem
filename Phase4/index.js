 require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.IPORT || 5000;
const path = require('path');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');

// --- Middleware ---
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Static files ---
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// --- Routes for pages ---
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get('/resources', (req, res) => {
  res.sendFile(path.join(publicDir, 'resources.html'));
});

// --- Database connection ---
const pool = new Pool({});

// --- Validation rules ---
const resourceValidators = [
  body('action')
    .exists({ checkFalsy: true }).withMessage('action is required')
    .trim()
    .isIn(['create'])
    .withMessage("action must be 'create'"),

  body('resourceName')
    .exists({ checkFalsy: true }).withMessage('resourceName is required')
    .isString().withMessage('resourceName must be a string')
    .trim(),

  body('resourceDescription')
    .exists({ checkFalsy: true }).withMessage('resourceDescription is required')
    .isString().withMessage('resourceDescription must be a string')
    .trim()
    .isLength({ min: 10, max: 50 })
    .withMessage('resourceDescription must be 10-50 characters'),

  body('resourceAvailable')
    .exists().withMessage('resourceAvailable is required')
    .isBoolean().withMessage('resourceAvailable must be boolean')
    .toBoolean(),

  body('resourcePrice')
    .exists().withMessage('resourcePrice is required')
    .isFloat({ min: 0 }).withMessage('resourcePrice must be a non-negative number')
    .toFloat(),

  body('resourcePriceUnit')
    .exists({ checkFalsy: true }).withMessage('resourcePriceUnit is required')
    .isString().withMessage('resourcePriceUnit must be a string')
    .trim()
    .isIn(['hour', 'day'])
    .withMessage("resourcePriceUnit must be 'hour' or 'day'")
];

// --- API route ---
app.post('/api/resources', resourceValidators, async (req, res) => {

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.array().map(e => ({ field: e.path, msg: e.msg })),
    });
  }

  const {
    action,
    resourceName,
    resourceDescription,
    resourceAvailable,
    resourcePrice,
    resourcePriceUnit
  } = req.body;

  // Only allow create
  if (action !== 'create') {
    return res.status(400).json({ ok: false, error: 'Only create is allowed' });
  }

  try {
    const insertSql = `
      INSERT INTO resources (name, description, available, price, price_unit)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, available, price, price_unit, created_at
    `;

    const params = [
      resourceName.trim(),
      resourceDescription.trim(),
      resourceAvailable,
      resourcePrice,
      resourcePriceUnit.trim()
    ];

    const { rows } = await pool.query(insertSql, params);

    return res.status(201).json({
      ok: true,
      data: rows[0]
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      error: 'Database error'
    });
  }
});

// --- 404 handler ---
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
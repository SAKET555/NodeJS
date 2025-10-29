// middleware/validate.js
const allowedStatuses = ['pending', 'in-progress', 'completed'];

function validateTask(req, res, next) {
  const method = req.method;
  const { title, description, status } = req.body;

  // For POST: title and description required
  if (method === 'POST') {
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'title and description are required' });
    }
  }

  // For PUT: if fields present, validate them
  if (method === 'PUT' || method === 'PATCH') {
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `status must be one of: ${allowedStatuses.join(', ')}` });
    }
  }

  next();
}

module.exports = { validateTask, allowedStatuses };

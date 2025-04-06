if (!subject || !message || !audience) {
  return res.status(400).json({ success: false, error: "All fields are required." });
}

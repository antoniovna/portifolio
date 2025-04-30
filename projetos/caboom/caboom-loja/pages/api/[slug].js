export default async (req, res) => {
  const { slug } = req.query;
  try {
    const phrase = "aaaaaaaaaa";
    res.json({ phrase });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

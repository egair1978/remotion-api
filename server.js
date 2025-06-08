const express = require('express');
const { getCompositions, renderMedia } = require('@remotion/renderer');
const app = express();
app.use(express.json());

const serveUrl = 'https://your-remotion-template.vercel.app'; // ← 여기 Vercel 주소로 바꾸세요

app.post('/render', async (req, res) => {
  try {
    const { compositionId, inputProps } = req.body;

    const compositions = await getCompositions(serveUrl, { inputProps });
    const comp = compositions.find((c) => c.id === compositionId);
    if (!comp) return res.status(404).send('Composition not found');

    const { filepath } = await renderMedia({
      serveUrl,
      composition: comp,
      codec: 'h264',
      inputProps,
      outputLocation: `/tmp/${Date.now()}.mp4`,
    });

    res.json({ video: filepath });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('✅ Remotion API server running on port 3000');
});


const express = require('express');
const { getCompositions, renderMedia } = require('@remotion/renderer');
const app = express();
app.use(express.json());

const serverUrl = 'https://your-remotion-template.vercel.app'; // ← 여기에 Vercel 주소로 바꾸세요

app.post('/render', async (req, res) => {
  try {
    const { compositionId, inputProps } = req.body;

    const compositions = await getCompositions(serverUrl, { inputProps });
    const comp = compositions.find((c) => c.id === compositionId);
    if (!comp) return res.status(404).send('Composition not found');

    const filepath = await renderMedia({
      serverUrl,
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

// ✅ 포트 설정 부분 수정
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Remotion API server running on port ${port}`);
});


// GET /api/qr?id=FGS-xxx&name=John+Smith&email=...&date=...&time=...&venue=...
// Returns a QR code PNG image pointing to the check-in page

import QRCode from 'qrcode';

export default async function handler(req, res) {
  const { id, name, email, date, time, venue } = req.query;

  if (!id) {
    return res.status(400).send('Missing ticket ID');
  }

  // Build the check-in URL that the QR code will point to
  const checkinUrl = new URL('https://feelgoodsociety.com.au/checkin');
  checkinUrl.searchParams.set('id',    id);
  checkinUrl.searchParams.set('name',  name  || '');
  checkinUrl.searchParams.set('email', email || '');
  checkinUrl.searchParams.set('date',  date  || '5 July 2026');
  checkinUrl.searchParams.set('time',  time  || '12:00 – 3:00pm');
  checkinUrl.searchParams.set('venue', venue || 'GoPickle, Campbelltown');

  try {
    const qrBuffer = await QRCode.toBuffer(checkinUrl.toString(), {
      type: 'png',
      width: 300,
      margin: 2,
      color: {
        dark:  '#2D1B69',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // cache for 24hrs
    res.status(200).send(qrBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('QR generation failed');
  }
}

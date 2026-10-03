import express from 'express';
import crypto from 'crypto';
import { processTelegramUpdate, TELEGRAM_WEBHOOK_SECRET } from '../controllers/bot.js';

const telegramRouter = express.Router();

const isValidSecret = (received) => {
  if (typeof received !== 'string' || received.length !== TELEGRAM_WEBHOOK_SECRET.length) {
    return false;
  }
  // timingSafeEqual защищает от подбора секрета по времени ответа.
  return crypto.timingSafeEqual(Buffer.from(received), Buffer.from(TELEGRAM_WEBHOOK_SECRET));
};

telegramRouter.post('/webhook', express.json(), (req, res) => {
  if (!isValidSecret(req.get('X-Telegram-Bot-Api-Secret-Token'))) {
    return res.sendStatus(403);
  }

  // Отвечаем сразу: Telegram ретраит апдейт, если ответ дольше таймаута.
  res.sendStatus(200);

  try {
    processTelegramUpdate(req.body);
  } catch (error) {
    console.error('[telegram] Ошибка при обработке апдейта:', error.message);
  }
});

export default telegramRouter;

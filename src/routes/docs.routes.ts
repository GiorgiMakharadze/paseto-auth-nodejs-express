import { Router, Request, Response } from 'express';
import path from 'path';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const docsPath = path.join(__dirname, '..', '..', 'public', 'docs.html');
  res.sendFile(docsPath);
});

export default router;

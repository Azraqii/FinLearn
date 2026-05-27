const { Router } = require('express');
const { submitQuiz, getLeaderboard } = require('../controllers/quizController');
const { optionalAuthenticate } = require('../middleware/auth');

const router = Router();

router.post('/submit',      optionalAuthenticate, submitQuiz);
router.get('/leaderboard',  getLeaderboard);

module.exports = router;

const { Router } = require('express');
const { submitQuiz, getLeaderboard } = require('../controllers/quizController');

const router = Router();

router.post('/submit',      submitQuiz);
router.get('/leaderboard',  getLeaderboard);

module.exports = router;

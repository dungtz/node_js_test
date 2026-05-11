require('dotenv').config({ quiet: true });
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Chào mừng bạn đến với dự án Node.js đầu tiên!');
});

app.get('/health/db', async (req, res) => {
    try {
        const result = await db.raw('SELECT 1 AS ok');
        res.json({ db: 'connected', result: result[0][0] });
    } catch (err) {
        res.status(500).json({ db: 'error', message: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ error: 'username và password là bắt buộc' });
    }

    try {
        const user = await db('users')
            .select('id', 'username', 'password')
            .where({ username })
            .first();

        if (!user) {
            return res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu' });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu' });
        }

        res.json({ message: 'Đăng nhập thành công', user: { id: user.id, username: user.username } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

async function start() {
    try {
        console.log('[boot] Running migrations...');
        const [batchNo, log] = await db.migrate.latest();
        if (log.length === 0) {
            console.log('[boot] Already up to date');
        } else {
            console.log(`[boot] Batch ${batchNo} ran ${log.length} migrations:`, log);
        }
    } catch (err) {
        console.error('[boot] Migration failed:', err);
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`Server đang chạy tại: http://localhost:${PORT}`);
    });
}

start();

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware để đọc dữ liệu JSON
app.use(express.json());

// Route cơ bản
app.get('/', (req, res) => {
    res.send('Chào mừng bạn đến với dự án Node.js đầu tiên!');
});

// Một API giả lập trả về danh sách sản phẩm
app.get('/api/products', (req, res) => {
    const products = [
        { id: 1, name: 'Laptop', price: 1000 },
        { id: 2, name: 'Phone', price: 500 }
    ];
    res.json(products);
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
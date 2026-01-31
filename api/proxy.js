const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { path } = req.query;

        console.log('📍 Proxy request:', {
            path,
            method: req.method,
            hasUsername: !!process.env.REACT_APP_API_USERNAME,
            hasPassword: !!process.env.REACT_APP_API_PASSWORD,
        });

        if (!path) {
            return res.status(400).json({ error: 'Path parameter is required' });
        }

        const url = `https://positively-nationwide-akita.cloudpub.ru/rashitova_mebelen1${path}`;
        console.log('🌐 Target URL:', url);

        const response = await axios({
            method: req.method,
            url: url,
            data: req.body,
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {
                username: process.env.REACT_APP_API_USERNAME,
                password: process.env.REACT_APP_API_PASSWORD,
            },
        });

        console.log('✅ Response status:', response.status);
        console.log('📦 Response type:', typeof response.data);

        res.status(response.status).json(response.data);

    } catch (error) {
        console.error('❌ Proxy error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });

        res.status(error.response?.status || 500).json({
            error: error.message,
            details: error.response?.data || 'No details',
        });
    }
};
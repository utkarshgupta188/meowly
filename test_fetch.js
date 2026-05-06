const fs = require('fs');

async function testFetch() {
    let cookie = '';
    try {
        const envFile = fs.readFileSync('.env.local', 'utf-8');
        const lines = envFile.split('\n');
        for (const line of lines) {
            if (line.startsWith('MOCTALE_COOKIE=')) {
                let val = line.substring('MOCTALE_COOKIE='.length).trim();
                if (val.startsWith('"') && val.endsWith('"')) {
                    val = val.substring(1, val.length - 1);
                } else if (val.startsWith("'") && val.endsWith("'")) {
                    val = val.substring(1, val.length - 1);
                }
                cookie = val;
                break;
            }
        }
    } catch (err) {
        console.error('Failed to read .env.local:', err.message);
    }

    let finalCookie = cookie;
    if (cookie.includes('auth_token=')) {
        const match = cookie.match(/auth_token=([^;]+)/);
        if (match) {
            finalCookie = `auth_token=${match[1]}`;
        }
    } else if (cookie && !cookie.includes('=')) {
        finalCookie = `auth_token=${cookie}`;
    }

    console.log('Using cookie:', finalCookie);

    const slug = 'spider-man-homecoming-2017';
    const url = `https://www.moctale.in/api/activity/content/${slug}/reviews-summary`;

    const headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9,hi;q=0.8',
        'cache-control': 'no-cache',
        'dnt': '1',
        'pragma': 'no-cache',
        'priority': 'u=1, i',
        'referer': `https://www.moctale.in/content/${slug}`,
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'cookie': finalCookie
    };

    try {
        console.log('Sending fetch request to Moctale...');
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        console.log('Response status:', response.status);
        const text = await response.text();
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        console.log('Response preview:', text.substring(0, 500));
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testFetch();

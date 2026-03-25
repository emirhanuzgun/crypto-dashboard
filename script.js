const coinTable = document.getElementById('coinTable');
let allCoins = []; // Arama yapmak için tüm veriyi burada tutacağız
let searchTimeout;

// 1. Verileri Binance API'den Çekme
async function fetchMarketData() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const data = await response.json();
        
        // Sadece USDT paritelerini filtreleyelim (Daha temiz görünmesi için)
        allCoins = data.filter(coin => coin.symbol.endsWith('USDT'));
        displayCoins(allCoins);
    } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
    }
}

function displayCoins(coins) {
    coinTable.innerHTML = "";
    coins.forEach(coin => {
        const changeClass = parseFloat(coin.priceChangePercent) >= 0 ? 'price-up' : 'price-down';
        const cleanSymbol = coin.symbol.replace('USDT', '');
        
        coinTable.innerHTML += `
            <tr onclick="openChart('${coin.symbol}')" style="cursor:pointer">
                <td><strong>${cleanSymbol}</strong></td>
                <td>$${parseFloat(coin.lastPrice).toLocaleString()}</td>
                <td class="${changeClass}">%${coin.priceChangePercent}</td>
                <td><button onclick="event.stopPropagation(); addToPortfolio('${coin.symbol}', ${coin.lastPrice})">Ekle</button></td>
            </tr>
        `;
    });
}

// 3. Arama Fonksiyonu
function filterCoins() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const searchTerm = document.getElementById('cryptoSearch').value.toUpperCase();
        const filtered = allCoins.filter(coin => coin.symbol.includes(searchTerm));
        
        // Arama yoksa sadece ilk 50'yi, arama varsa tüm eşleşenleri göster
        const limit = searchTerm.length > 0 ? filtered.length : 50;
        displayCoins(filtered.slice(0, limit));
    }, 300); // 300ms bekleme süresi
}

// Sayfa açıldığında verileri çek
fetchMarketData();
// Her 10 saniyede bir güncelle
setInterval(fetchMarketData, 10000);

function openChart(symbol) {
    const chartContainer = document.getElementById('chart-container');
    // TradingView Widget'ı dinamik olarak güncelle
    chartContainer.innerHTML = `
        <iframe 
            src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_76d4d&symbol=BINANCE:${symbol}&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC&studies_overlays=[]&drawings_access_all=2&enabled_features=[]&disabled_features=[]&locale=tr"
            width="100%" 
            height="400" 
            frameborder="0" 
            allowtransparency="true" 
            scrolling="no" 
            allowfullscreen>
        </iframe>
    `;
}
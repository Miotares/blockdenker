function getBasePath() {
    return "/"; // Absoluter Pfad zur Wurzel der Website
}

async function loadWordlist() {
    const response = await fetch('/pages/tools/seed-generator/english.txt');
    const text = await response.text();
    return text.split('\n').map(word => word.trim());
}

let bip39Wordlist = [];

async function initializeWordlist() {
    bip39Wordlist = await loadWordlist();
}

function generateSeed(wordsCount = 12) {
    if (bip39Wordlist.length === 0) {
        console.error('⚠️ Wortliste noch nicht geladen!');
        return 'Fehler: Wortliste nicht geladen!';
    }

    const seed = [];
    for (let i = 0; i < wordsCount; i++) {
        const randomIndex = Math.floor(Math.random() * bip39Wordlist.length);
        seed.push(bip39Wordlist[randomIndex]);
    }
    return seed.join(' ');
}

function initSeedGenerator() {
    const twelveWordsButton = document.getElementById('twelve-words');
    const twentyFourWordsButton = document.getElementById('twenty-four-words');
    const generateSeedButton = document.getElementById('generate-seed-button');
    const seedOutput = document.getElementById('seed-output');
    const seedRawOutput = document.getElementById('seed-raw-output');

    if (!twelveWordsButton || !twentyFourWordsButton || !generateSeedButton) {
        console.warn('⚠️ Seed Generator Buttons nicht gefunden!');
        return;
    }

    let wordCount = twelveWordsButton.classList.contains('active') ? 12 : 24;

    twelveWordsButton.addEventListener('click', () => {
        wordCount = 12;
        twelveWordsButton.classList.add('active');
        twentyFourWordsButton.classList.remove('active');
    });

    twentyFourWordsButton.addEventListener('click', () => {
        wordCount = 24;
        twentyFourWordsButton.classList.add('active');
        twelveWordsButton.classList.remove('active');
    });

    generateSeedButton.addEventListener('click', function () {
        const seedWords = generateSeed(wordCount).split(' ');
        seedOutput.innerHTML = '';
    
        // Dynamisch Spalten festlegen: 4 auf Desktop, 2 auf Mobile
        const columns = window.innerWidth <= 768 ? 2 : 4;
        const rows = Math.ceil(wordCount / columns);
    
        const columnContainers = [];
        for (let i = 0; i < columns; i++) {
            const columnDiv = document.createElement('div');
            columnDiv.classList.add('seed-column');
            columnContainers.push(columnDiv);
            seedOutput.appendChild(columnDiv);
        }
    
        // Wörter korrekt spaltenweise füllen
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const index = col * rows + row;
                if (index < wordCount) {
                    const wordBox = document.createElement('div');
                    wordBox.classList.add('seed-word');
    
                    const numberSpan = document.createElement('span');
                    numberSpan.classList.add('seed-word-number');
                    numberSpan.textContent = index + 1;
    
                    const wordTextSpan = document.createElement('span');
                    wordTextSpan.classList.add('seed-word-text');
                    wordTextSpan.textContent = seedWords[index];
    
                    wordBox.appendChild(numberSpan);
                    wordBox.appendChild(wordTextSpan);
                    columnContainers[col].appendChild(wordBox);
                }
            }
        }
    
        seedRawOutput.textContent = seedWords.join(' ');
    });

    // Sicherstellen, dass die 12-Wörter-Version standardmäßig aktiv ist
    twelveWordsButton.click();
}

document.addEventListener("DOMContentLoaded", function () {
    const twelveWordsButton = document.getElementById('twelve-words');
    const twentyFourWordsButton = document.getElementById('twenty-four-words');
    const generateSeedButton = document.getElementById('generate-seed-button');
    const seedOutput = document.getElementById('seed-output');
    const seedRawOutput = document.getElementById('seed-raw-output');

    let wordCount = 12; // Standard
    let wordlistLoaded = false;

    // Umschalten zwischen 12 und 24 Wörter
    twelveWordsButton.addEventListener('click', () => {
        wordCount = 12;
        twelveWordsButton.classList.add('active');
        twentyFourWordsButton.classList.remove('active');
    });

    twentyFourWordsButton.addEventListener('click', () => {
        wordCount = 24;
        twentyFourWordsButton.classList.add('active');
        twelveWordsButton.classList.remove('active');
    });

    // Seed generieren und anzeigen
    generateSeedButton.addEventListener('click', function () {
        const seedWords = generateSeed(wordCount).split(' ');
    
        // Boxen erstellen
        seedOutput.innerHTML = '';
    
        const columns = 4; // Anzahl der Spalten
        const rows = wordCount / columns; // Anzahl der Reihen pro Spalte
    
        const columnContainers = [];
    
        // 4 Spalten als Container erstellen
        for (let i = 0; i < columns; i++) {
            const columnDiv = document.createElement('div');
            columnDiv.classList.add('seed-column');
            columnContainers.push(columnDiv);
            seedOutput.appendChild(columnDiv);
        }
    
        // Wörter in die Spalten verteilen
        for (let i = 0; i < wordCount; i++) {
            const columnIndex = Math.floor(i / rows);
            const wordBox = document.createElement('div');
            wordBox.classList.add('seed-word');
    
            const numberSpan = document.createElement('span');
            numberSpan.classList.add('seed-word-number');
            numberSpan.textContent = i + 1;
    
            const wordTextSpan = document.createElement('span');
            wordTextSpan.classList.add('seed-word-text');
            wordTextSpan.textContent = seedWords[i];
    
            wordBox.appendChild(numberSpan);
            wordBox.appendChild(wordTextSpan);
            columnContainers[columnIndex].appendChild(wordBox);
        }
    
        // Raw Text darunter anzeigen
        seedRawOutput.textContent = seedWords.join(' ');
    });
});

window.miners = [
    { name: 'Bitaxe Gamma 601', hashrate: 1.2, unit: 'TH', consumption: 15, price: 200 },
    { name: 'Bitaxe Supra', hashrate: 750, unit: 'GH', consumption: 15, price: 160 },
    { name: 'NerdAxe Ultra', hashrate: 500, unit: 'GH', consumption: 12, price: 150 },
    { name: 'LuckyMiner V6', hashrate: 500, unit: 'GH', consumption: 13, price: 190 },
    { name: 'BitAxe Ultra', hashrate: 425, unit: 'GH', consumption: 20, price: 120 },
    { name: 'LuckyMiner V7', hashrate: 1, unit: 'TH', consumption: 30, price: 250 },
    { name: 'Avalon Nano', hashrate: 4, unit: 'TH', consumption: 140, price: 270 },
    { name: 'Nerdaxe', hashrate: 500, unit: 'GH', consumption: 19, price: 250 },
    { name: 'Nerdqaxe', hashrate: 2.5, unit: 'TH', consumption: 50, price: 500 },
    { name: 'Bitaxe Hex', hashrate: 3, unit: 'TH', consumption: 50, price: 600 },
    { name: 'LuckyMiner V5', hashrate: 210, unit: 'GH', consumption: 15, price: 180 },
    { name: 'Nerdminer', hashrate: 78, unit: 'kH', consumption: 1.6, price: 60 },
    { name: 'Nerdminer 2,8 Zoll', hashrate: 55, unit: 'kH', consumption: 1.6, price: 60 },
    { name: 'GIGA Nerdminer', hashrate: 221, unit: 'kH', consumption: 4, price: 160 },
];

const unitFactors = { 'kH': 1e-9, 'MH': 1e-6, 'GH': 1e-3, 'TH': 1 };

function calculateEfficiency(hashrate, unit, consumption, price) {
    const hashrateInTH = hashrate * unitFactors[unit];
    if (consumption > 0 && price > 0) {
        return ((hashrateInTH / (consumption * price)) * 10000).toFixed(2);
    }
    return '0.00';
}

window.createRow = function(miner) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${miner.name}</td>
        <td><input type="number" class="hashrate" value="${miner.hashrate}" step="any"></td>
        <td>
            <select class="unit">
                <option value="kH">kH/s</option>
                <option value="MH">MH/s</option>
                <option value="GH" ${miner.unit === 'GH' ? 'selected' : ''}>GH/s</option>
                <option value="TH" ${miner.unit === 'TH' ? 'selected' : ''}>TH/s</option>
            </select>
        </td>
        <td><input type="number" class="consumption" value="${miner.consumption}" step="any"></td>
        <td><input type="number" class="price" value="${miner.price}" step="any"></td>
        <td class="efficiency"></td>
    `;

    row.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => updateEfficiency(row));
    });

    updateEfficiency(row);
    return row;
}

function updateEfficiency(row) {
    const hashrate = parseFloat(row.querySelector('.hashrate').value) || 0;
    const unit = row.querySelector('.unit').value;
    const consumption = parseFloat(row.querySelector('.consumption').value) || 0;
    const price = parseFloat(row.querySelector('.price').value) || 0;

    const efficiency = calculateEfficiency(hashrate, unit, consumption, price);
    const efficiencyCell = row.querySelector('.efficiency');
    efficiencyCell.innerText = efficiency;

    updateColors();
}

function updateColors() {
    const efficiencyCells = Array.from(document.querySelectorAll('.efficiency'));
    const efficiencies = efficiencyCells.map(cell => parseFloat(cell.innerText) || 0);

    const minEff = Math.min(...efficiencies);
    const maxEff = Math.max(...efficiencies);

    efficiencyCells.forEach(cell => {
        const value = parseFloat(cell.innerText) || 0;

        if (minEff === maxEff) {
            cell.style.backgroundColor = 'white';
            return;
        }

        const hue = ((value - minEff) / (maxEff - minEff)) * 120;
        const saturation = 70;
        const lightness = 50;

        cell.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        cell.style.color = value > (minEff + maxEff) / 2 ? 'black' : 'white';
    });
}

window.initializeMinerTable = function() {
    console.log('✅ initializeMinerTable() AUFGERUFEN!');
    const minerBody = document.getElementById('minerBody');
    if (!minerBody) {
        console.warn('⚠️ Abbruch, weil minerBody nicht da ist');
        return;
    }

    minerBody.innerHTML = ''; // Sicherstellen, dass nichts doppelt ist
    console.log('🛠️ Fülle jetzt die Tabelle...');
    window.miners.forEach(miner => {
        const row = createRow(miner);
        console.log('➕ Zeile hinzugefügt:', row);
        minerBody.appendChild(row);
    });

    updateColors();
};

function scrollToTopInstant() {
    window.scrollTo(0, 0);
}

async function loadHead() {
    try {
        const basePath = getBasePath();

        const response = await fetch(basePath + "components/head.html");
        if (!response.ok) throw new Error("Head-Datei konnte nicht geladen werden.");

        document.head.insertAdjacentHTML("beforeend", await response.text());
    } catch (error) {
        console.error("❌ Fehler beim Laden des Heads:", error);
    }
}

async function loadHeader() {
    try {
        const basePath = getBasePath();

        const response = await fetch(basePath + "components/header.html");
        if (!response.ok) throw new Error("❌ Header konnte nicht geladen werden.");

        document.getElementById("header-container").innerHTML = await response.text();

        setTimeout(setActiveNav, 300); // Setzt die Navigation aktiv nach Laden des Headers
        initMobileMenuToggle(); // <---- Das ist das Wichtige
    } catch (error) {
        console.error("❌ Fehler beim Laden des Headers:", error);
    }
}

function initMobileMenuToggle() {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("#nav");
    const navLinks = nav.querySelectorAll("a");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("open");
        });

        // Menü schließen, wenn ein Link angeklickt wird
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("open");
            });
        });
    } else {
        console.warn("⚠️ Burger-Menü oder Navigation nicht gefunden.");
    }
}

async function loadFooter() {
    try {
        const basePath = getBasePath();

        const response = await fetch(basePath + "components/footer.html");
        if (!response.ok) throw new Error("Footer-Datei konnte nicht geladen werden.");

        document.getElementById("footer-container").innerHTML = await response.text();
    } catch (error) {
        console.error("❌ Fehler beim Laden des Footers:", error);
    }
}

async function loadTicker() {
    try {
        const basePath = getBasePath();
        const tickerContainer = document.getElementById("ticker-container");

        if (!tickerContainer) {
            console.warn("⚠️ `#ticker-container` nicht gefunden.");
            return;
        }

        tickerContainer.innerHTML = ""; // 🔄 Verhindere doppelte Einträge
        const response = await fetch(basePath + "components/ticker.html");

        if (!response.ok) throw new Error("Ticker-Datei konnte nicht geladen werden.");

        tickerContainer.innerHTML = await response.text();
        console.log("✅ Ticker neu geladen");

        fetchBitcoinData(); // 🟢 Daten erneut abrufen

    } catch (error) {
        console.error("❌ Fehler beim Laden des Tickers:", error);
    }
}
async function fetchBitcoinData() {
    if (!document.getElementById("btc-price")) {
        return;
    }

    try {
        const btcResponse = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur&include_24hr_change=true");
        let btcData = null;
        
        if (btcResponse.ok) {
            btcData = await btcResponse.json();
        } else {
            console.warn("⚠️ Coingecko API nicht erreichbar.");
        }

        const mempoolResponse = await fetch("https://mempool.space/api/v1/fees/recommended");
        let mempoolData = null;
        
        if (mempoolResponse.ok) {
            mempoolData = await mempoolResponse.json();
        } else {
            console.warn("⚠️ Mempool API nicht erreichbar.");
        }

        const blockResponse = await fetch("https://mempool.space/api/blocks/tip/height");
        let blockHeight = null;
        
        if (blockResponse.ok) {
            blockHeight = await blockResponse.json();
        } else {
            console.warn("⚠️ Block-Höhe nicht abrufbar.");
        }

        const unconfirmedTxResponse = await fetch("https://mempool.space/api/mempool");
        let unconfirmedTxData = null;

        if (unconfirmedTxResponse.ok) {
            unconfirmedTxData = await unconfirmedTxResponse.json();
        } else {
            console.warn("⚠️ Anzahl unbestätigter Transaktionen nicht abrufbar.");
        }

        const btcChangeValue = btcData?.bitcoin?.eur_24h_change;
        const formattedBtcChange = (btcChangeValue !== undefined && btcChangeValue !== null) 
            ? btcChangeValue.toFixed(2) + "%" 
            : "N/A";

        updateTicker({
            btcPrice: btcData?.bitcoin?.eur?.toLocaleString("de-DE") + " €" || "N/A",
            btcChange: formattedBtcChange,
            mempoolFees: mempoolData?.fastestFee ? mempoolData.fastestFee + " sat/vB" : "N/A",
            blockHeight: blockHeight ? blockHeight.toLocaleString("de-DE") : "N/A",
            unconfirmedTx: unconfirmedTxData?.count ? unconfirmedTxData.count.toLocaleString("de-DE") : "N/A"
        });

    } catch (error) {
        console.error("❌ Fehler beim Abrufen der Bitcoin-Daten:", error);
    }
}

// ✅ Ticker-Update
function updateTicker(data) {
    const btcPriceElement = document.getElementById("btc-price");
    const btcChangeElement = document.getElementById("btc-change");
    const mempoolFeesElement = document.getElementById("mempool-fees");
    const blockHeightElement = document.getElementById("block-height");
    const unconfirmedTxElement = document.getElementById("unconfirmed-tx");

    if (btcPriceElement) btcPriceElement.textContent = data.btcPrice || "N/A";
    if (btcChangeElement) btcChangeElement.textContent = data.btcChange || "N/A";
    if (mempoolFeesElement) mempoolFeesElement.textContent = data.mempoolFees || "N/A";
    if (blockHeightElement) blockHeightElement.textContent = data.blockHeight || "N/A";
    if (unconfirmedTxElement) unconfirmedTxElement.textContent = data.unconfirmedTx || "N/A";
}

// ✅ Navigation-Highlight setzen (Sofort)
function setActiveNav(path = window.location.pathname) {
    console.log("🔍 Setze aktive Navigation für:", path);
    const navLinks = document.querySelectorAll("#nav ul li a");

    navLinks.forEach(link => {
        link.classList.remove("active");
        let linkPath = new URL(link.href, window.location.origin).pathname;

        // 🔹 Falls die Seite exakt übereinstimmt oder eine Unterseite der Hauptkategorie ist
        if (path === linkPath || path === linkPath + 'index.html' || path === linkPath.slice(0, -1)) {
            link.classList.add("active");
            console.log(`✅ Aktiv: ${linkPath}`);
        }
    });

    // 🔹 Erkenne auch Unterseiten anhand der Ordnerstruktur (z. B. /pages/resources/books/ → Markiere Ressourcen)
    navLinks.forEach(link => {
        let linkPath = new URL(link.href, window.location.origin).pathname;

        if (path.startsWith("/pages/resources/") && linkPath.endsWith("/resources/")) {
            link.classList.add("active");
        } else if (path.startsWith("/pages/articles/") && linkPath.endsWith("/articles/")) {
            link.classList.add("active");
        } else if (path.startsWith("/pages/tutorials/") && linkPath.endsWith("/tutorials/")) {
            link.classList.add("active");
        } else if (path.startsWith("/pages/spenden/") && linkPath.endsWith("/spenden/")) {
            link.classList.add("active");
        } else if (path.startsWith("/pages/tools/") && linkPath.endsWith("/tools/")) {
            link.classList.add("active");
        }
    });
}

async function generateHash() {
    const input = document.getElementById("inputText").value;
    const hash = await sha256(input);
    document.getElementById("outputHash").value = hash;
}

async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

let currentDifficulty = 4; // Standardwert

function updateDifficultyDisplay(value) {
    currentDifficulty = parseInt(value, 10);
    document.getElementById('difficultyDisplay').innerText = value;
}

async function calculateBlockHash(blockElement) {
    if (blockElement.dataset.mined === 'true') {
        return; // Block wurde schon gemined, keine erneute Berechnung nötig
    }

    const data = blockElement.querySelector('.block-data').value;
    const nonce = blockElement.querySelector('.block-nonce').value.replace(/\./g, '');
    const prevHash = blockElement.querySelector('.block-prev-hash').value;

    const content = data + nonce + prevHash;
    const hash = await sha256(content);

    blockElement.querySelector('.block-hash').value = hash;

    if (hash.startsWith('0'.repeat(currentDifficulty))) {
        setBlockStatus(blockElement, 'valid');
    } else {
        setBlockStatus(blockElement, 'invalid');
    }

    await updateNextBlocks(blockElement);
}

async function mineBlock(blockElement) {
    let nonce = 0;
    let hash = '';
    const prevHash = blockElement.querySelector('.block-prev-hash').value;
    const data = blockElement.querySelector('.block-data').value;
    const nonceField = blockElement.querySelector('.block-nonce');
    const hashField = blockElement.querySelector('.block-hash');

    blockElement.classList.add('mining');

    while (!hash.startsWith('0'.repeat(currentDifficulty))) {
        nonce++;
        nonceField.value = nonce.toLocaleString('en-US');
        hash = await sha256(data + nonce + prevHash);
        hashField.value = hash;

        await updateNextBlocks(blockElement);

        if (miningStopped) {
            setBlockStatus(blockElement, 'neutral');
            return;
        }
    }

    blockElement.classList.remove('mining');
    blockElement.classList.remove('invalid');
    blockElement.classList.add('valid');

    nonceField.value = nonce.toLocaleString('en-US');
    hashField.value = hash;

    // Block endgültig "sperren" – keine weiteren Updates zulassen
    blockElement.dataset.mined = 'true';
    await updateNextBlocks(blockElement);
}

async function updateNextBlocks(blockElement) {
    const currentHash = blockElement.querySelector('.block-hash').value;
    const nextBlock = blockElement.nextElementSibling;

    if (nextBlock && nextBlock.classList.contains('block')) {
        const prevHashField = nextBlock.querySelector('.block-prev-hash');
        const currentPrevHash = prevHashField.value;

        // Nur aktualisieren, wenn der vorherige Hash sich ändert
        if (currentPrevHash !== currentHash) {
            prevHashField.value = currentHash;
            await calculateBlockHash(nextBlock);
        }
    }
}

function initBlockchainSimulator() {
    const blocks = document.querySelectorAll('.block');

    blocks.forEach(block => {
        const index = parseInt(block.getAttribute('data-index'), 10);

        setBlockStatus(block, 'neutral');
        block.dataset.mined = 'false';

        if (index === 1) {
            calculateBlockHash(block).then(() => {
                setBlockStatus(block, 'neutral');
            });
        } 

        block.querySelector('.block-data').addEventListener('input', async () => {
            block.dataset.mined = 'false'; // Entsperren, wenn man Daten ändert
            await calculateBlockHash(block);
        });
        
        block.querySelector('.block-nonce').addEventListener('input', async () => {
            block.dataset.mined = 'false'; // Entsperren, wenn man Nonce ändert
            await calculateBlockHash(block);
        });
    });

    const mineAllBtn = document.getElementById('mineAllBtn');
    const stopMiningBtn = document.getElementById('stopMiningBtn');

    if (mineAllBtn) {
        mineAllBtn.addEventListener('click', mineAllBlocks);
    } else {
        console.warn('⚠️ mineAllBtn nicht gefunden!');
    }

    if (stopMiningBtn) {
        stopMiningBtn.addEventListener('click', stopMining);
    } else {
        console.warn('⚠️ stopMiningBtn nicht gefunden!');
    }
}

let miningStopped = false;

// Mining-Funktion für alle Blöcke der Reihe nach
async function mineAllBlocks() {
    miningStopped = false;
    const blocks = document.querySelectorAll('.block');

    blocks.forEach(block => {
        const nonceField = block.querySelector('.block-nonce');
        nonceField.value = 0;
        block.dataset.mined = 'false'; // Block entsperren für neue Berechnung
        setBlockStatus(block, 'neutral');
    });

    document.getElementById('mineAllBtn').disabled = true;
    document.getElementById('stopMiningBtn').disabled = false;

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];

        if (miningStopped) {
            console.log("⛔ Mining abgebrochen.");
            break;
        }

        await mineBlock(block); // Deine bestehende Mine-Funktion
    }

    document.getElementById('mineAllBtn').disabled = false;
    document.getElementById('stopMiningBtn').disabled = true;

    blocks.forEach(block => calculateBlockHash(block));
}

// Mining stoppen
function stopMining() {
    miningStopped = true;
    document.getElementById('mineAllBtn').disabled = false;
    document.getElementById('stopMiningBtn').disabled = true;

    const blocks = document.querySelectorAll('.block');
    blocks.forEach(block => {
        if (block.classList.contains('mining')) {
            setBlockStatus(block, 'neutral');
        }
        block.classList.remove('mining');
    });
}

function setBlockStatus(blockElement, status) {
    blockElement.classList.remove('valid', 'invalid', 'neutral', 'mining');
    blockElement.classList.add(status);
}

function updateDifficultyDisplay(value) {
    currentDifficulty = parseInt(value, 10);
    document.getElementById('difficultyDisplay').innerText = value;

    const blocks = document.querySelectorAll('.block');
    blocks.forEach(block => calculateBlockHash(block));
}

// Event Listener für "input", damit sich der Hash sofort aktualisiert
document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("inputText");
    inputField.addEventListener("input", generateHash);
});

// ✅ AJAX Seitenladefunktion für Seamless Navigation
async function loadPage(url, updateHistory = true) {
    try {
        const basePath = getBasePath();
        const fullUrl = new URL(url, window.location.origin).pathname;

        console.log("🔄 Wechsel zu:", fullUrl);
        console.log("📂 Lade Seite:", fullUrl);

        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error(`❌ Fehler beim Laden von ${fullUrl}`);

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const newContent = doc.getElementById("content");

        if (!newContent) {
            console.error("❌ Fehler: `#content` nicht gefunden in", fullUrl);
            return;
        }

        document.getElementById("content").innerHTML = newContent.innerHTML;

        // Setze neuen Titel
        const newTitle = doc.querySelector('title');
        if (newTitle) {
            document.title = newTitle.innerText;
        }

        // Stylesheets prüfen und ggf. ergänzen
        const stylesheets = doc.querySelectorAll("link[rel='stylesheet']");
        stylesheets.forEach(sheet => {
            if (!document.querySelector(`link[href="${sheet.href}"]`)) {
                const newSheet = document.createElement("link");
                newSheet.rel = "stylesheet";
                newSheet.href = sheet.href;
                document.head.appendChild(newSheet);
            }
        });

        // URL in der Historie aktualisieren
        if (updateHistory) {
            history.pushState(null, "", url);
        }

        // Eingabefeld für Hash-Funktion
        const inputField = document.getElementById("inputText");
        if (inputField) {
            inputField.addEventListener("input", generateHash);
        }

        // Blockchain-Simulator initialisieren, falls vorhanden
        const firstBlock = document.querySelector('.block');
        if (firstBlock) {
            initBlockchainSimulator();
        }

        // Seed Generator erkennen und initialisieren
        const seedOutput = document.getElementById('seed-output');
    if (seedOutput) {
        console.log('🌱 Seed Generator erkannt – Lade Wortliste und initialisiere...');
        if (bip39Wordlist.length === 0) {
            await initializeWordlist(); // Lade die Wortliste nur einmal!
        }
        initSeedGenerator(); // Setze Event Listener für Seed Generator
    }

        // Miner-Tabelle erkennen und initialisieren
        const minerBody = document.getElementById('minerBody');
        if (minerBody && minerBody.children.length === 0) {
            console.log('⚙️ minerBody direkt gefunden – fülle Tabelle!');
            initializeMinerTable();
        } else if (!minerBody) {
            // MutationObserver nur, wenn minerBody nicht vorhanden ist
            console.log('⏳ Warte mit MutationObserver auf minerBody...');
            const targetNode = document.getElementById('content');
            const config = { childList: true, subtree: true };

            const observer = new MutationObserver(() => {
                const minerBodyDynamic = document.getElementById('minerBody');
                if (minerBodyDynamic && minerBodyDynamic.children.length === 0) {
                    console.log('🚀 minerBody erkannt durch MutationObserver!');
                    initializeMinerTable();
                    observer.disconnect();
                }
            });

            observer.observe(targetNode, config);
        }

        // Allgemeine UI-Updates nach dem Laden
        setActiveNav();
        generateTableOfContents();
        initTocClickHandler();
        scrollToTopInstant();

        try {
            toggleScrollToTopButton();
        } catch (e) {
            console.warn('⚠️ toggleScrollToTopButton nicht verfügbar:', e);
        }

    } catch (error) {
        console.error("❌ Fehler beim Laden der Seite:", error);
    }
}

function initScrollSpy() {
    const headings = document.querySelectorAll('.article-box h1, .article-box h2');
    const tocLinks = document.querySelectorAll('.toc-container a');

    function highlightCurrentHeading() {
        let currentHeading = null;

        for (let i = 0; i < headings.length; i++) {
            const rect = headings[i].getBoundingClientRect();

            // Bedingung: Überschrift ist im sichtbaren Bereich
            if (rect.top <= 120 && rect.bottom >= 0) {
                currentHeading = headings[i];
            }
        }

        // Sonderfälle
        const isAtTop = window.scrollY === 0;
        const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;

        if (isAtTop) {
            currentHeading = headings[0];
        } else if (isAtBottom) {
            currentHeading = headings[headings.length - 1];
        }

        tocLinks.forEach(link => link.parentElement.classList.remove('active'));

        if (currentHeading) {
            const currentId = currentHeading.id;

            tocLinks.forEach(link => {
                const linkHash = link.hash.replace('#', '');

                // 🔥 Sicherstellen, dass wirklich das korrekte Element markiert wird
                if (linkHash === currentId) {
                    link.parentElement.classList.add('active');
                }
            });
        }
    }

    // Initial sofort markieren
    highlightCurrentHeading();

    // Bei Scrollen und Resizing aktualisieren
    document.addEventListener('scroll', highlightCurrentHeading);
    window.addEventListener('resize', highlightCurrentHeading);
}
// 🎯 Popstate-Handling für Zurück- und Vorwärtsnavigation
window.addEventListener("popstate", function () {
    setActiveNav(); // Navigation sofort aktualisieren
    loadPage(location.pathname, false);
    scrollToTopInstant();
});

// ✅ Funktion für Seamless Navigation
function initSeamlessNavigation() {
    document.body.addEventListener("click", async (event) => {
        const target = event.target.closest("a");

        if (!target || !target.href) return;

        const isSamePageAnchor = target.hash && target.pathname === window.location.pathname;
        const isInternalLink = target.origin === window.location.origin;

        if (isSamePageAnchor) {
            // ⚠️ Wenn es ein Anker auf der selben Seite ist, mach nichts, der Browser soll das machen
            return;
        }

        if (isInternalLink) {
            event.preventDefault();
            const url = target.pathname + target.search + target.hash;
            await loadPage(url);
        }
    });
}

function generateTableOfContents() {
    const tocContainer = document.getElementById('table-of-contents');
    if (!tocContainer) return;

    const articleBox = document.querySelector('.article-box');
    if (!articleBox) return;

    const headings = articleBox.querySelectorAll('h1, h2');
    const tocList = document.createElement('ul');

    const isFolderUrl = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html');

    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = 'heading-' + (index + 1);
        }

        const tocItem = document.createElement('li');
        if (heading.tagName.toLowerCase() === 'h2') {
            tocItem.classList.add('toc-level-2');
        } else if (heading.tagName.toLowerCase() === 'h3') {
            tocItem.classList.add('toc-level-3');
        } else {
            tocItem.classList.add('toc-level-1');
        }

        const tocLink = document.createElement('a');
        tocLink.href = (isFolderUrl ? 'index.html' : '') + '#' + heading.id;
        tocLink.textContent = heading.textContent.trim();

        tocItem.appendChild(tocLink);
        tocList.appendChild(tocItem);
    });

    tocContainer.innerHTML = '';
    tocContainer.appendChild(tocList);
}

function initTocClickHandler() {
    const tocContainer = document.getElementById('table-of-contents');
    if (!tocContainer) return;

    tocContainer.addEventListener('click', function (event) {
        const link = event.target.closest('a');
        if (!link) return;

        const targetId = link.hash.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            event.preventDefault(); // Verhindert das Hinzufügen von index.html zur URL
            targetElement.scrollIntoView({ behavior: 'smooth' });

            // Optional: Hash in der URL aktualisieren, aber ohne die Seite neu zu laden
            const currentUrl = window.location.pathname + window.location.search + '#' + targetId;
            history.replaceState(null, null, currentUrl);
        }
    });
}

function initScrollToTopButton() {
    const scrollToTopButton = document.getElementById('scrollToTopButton');

    if (!scrollToTopButton) return;

    function toggleScrollToTopButton() {
        const scrollThreshold = 300; // Pixel, ab wann der Button erscheinen soll
        if (window.scrollY > scrollThreshold) {
            scrollToTopButton.classList.remove('hidden');
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
            scrollToTopButton.classList.add('hidden');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    scrollToTopButton.addEventListener('click', scrollToTop);
    document.addEventListener('scroll', toggleScrollToTopButton);
    window.addEventListener('resize', toggleScrollToTopButton);

    // Falls du AJAX-Navigation nutzt, sicherstellen, dass es bei jedem Seitenwechsel neu geprüft wird:
    window.toggleScrollToTopButton = toggleScrollToTopButton;
}

document.addEventListener('DOMContentLoaded', () => {
    initScrollToTopButton();
});

document.addEventListener("DOMContentLoaded", generateTableOfContents);

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("#nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("open");
        });
    }
});

// ✅ Initialisierung nach `DOMContentLoaded`
document.addEventListener("DOMContentLoaded", async () => {
    await loadHead();
    await loadHeader();
    await loadFooter();
    await loadTicker();

    fetchBitcoinData(); // Bitcoin-Daten abrufen
    setActiveNav(); // Navigation setzen
    initSeamlessNavigation(); // Nahtlose Navigation aktivieren
    generateTableOfContents();
    initTocClickHandler(); // <-- HIER NEU
    initializeWordlist()
    // initScrollSpy(); // Optional, falls du das nochmal versuchst

    document.body.classList.add('loaded');
});

document.addEventListener("DOMContentLoaded", () => {
    const minerBody = document.getElementById('minerBody');
    if (minerBody && minerBody.children.length === 0) {
        console.log('🔄 DOMContentLoaded: Fülle Tabelle beim direkten Seitenaufruf');
        initializeMinerTable();
    }

    const firstBlock = document.querySelector('.block');
    if (firstBlock) {
        initBlockchainSimulator();
    }
});

window.loadPage = loadPage; // Globale Funktion


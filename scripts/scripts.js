function getBasePath() {
    return "/"; // Absoluter Pfad zur Wurzel der Website
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
        }
    });
}

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

        // CSS Stylesheets sicherstellen
        const stylesheets = doc.querySelectorAll("link[rel='stylesheet']");
        stylesheets.forEach(sheet => {
            if (!document.querySelector(`link[href="${sheet.href}"]`)) {
                const newSheet = document.createElement("link");
                newSheet.rel = "stylesheet";
                newSheet.href = sheet.href;
                document.head.appendChild(newSheet);
            }
        });

        if (updateHistory) {
            history.pushState(null, "", url);
        }

        setActiveNav();
        generateTableOfContents();
    } catch (error) {
        console.error("❌ Fehler beim Laden der Seite:", error);
    }
}

// 🎯 Popstate-Handling für Zurück- und Vorwärtsnavigation
window.addEventListener("popstate", function () {
    setActiveNav(); // Navigation sofort aktualisieren
    loadPage(location.pathname, false);
});

// ✅ Funktion für Seamless Navigation
function initSeamlessNavigation() {
    document.body.addEventListener("click", async (event) => {
        const target = event.target.closest("a");

        if (target && target.href && target.origin === window.location.origin) {
            event.preventDefault();
            const url = target.pathname;

            // **Navigation direkt aktualisieren, bevor die Seite geladen wird**
            setActiveNav();

            // Verhindere Neuladen der Seite
            await loadPage(url);
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
});

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
});

window.loadPage = loadPage; // Globale Funktion


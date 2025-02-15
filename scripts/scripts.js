function getBasePath() {
    return "/"; // Absoluter Pfad zur Wurzel der Website
}

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
        initTocClickHandler();
        scrollToTopInstant();
        toggleScrollToTopButton();
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
        tocItem.classList.add(heading.tagName.toLowerCase() === 'h2' ? 'toc-level-2' : 'toc-level-1');

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
    // initScrollSpy(); // Optional, falls du das nochmal versuchst

    document.body.classList.add('loaded');
});

window.loadPage = loadPage; // Globale Funktion


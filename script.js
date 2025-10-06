document.addEventListener('DOMContentLoaded', () => {
    // 1. 取得 HTML 元素
    const latinInput = document.getElementById('latin-input');
    const arabicOutput = document.getElementById('arabic-output');
    const candidateWindow = document.getElementById('candidate-window');

    // 2. 核心對應規則
    const translitMap = {
        "`dh": "ظ", "kh": "خ", "sh": "ش", "dh": "ذ", "gh": "غ", "`h": "ح",
        "xs": "ص", "th": "ث", "`t": "ط", "`d": "ض", "`a": "ة", "xw": "ؤ",
        "xy": "ئ", "xx": "ء", "xi": "إ", "xa": "أ", "ai": "ع", "aa": "آ",
        "q": "ق", "f": "ف", "h": "ه", "j": "ج", "d": "د", "s": "س",
        "y": "ي", "b": "ب", "l": "ل", "a": "ا", "t": "ت", "n": "ن",
        "m": "م", "k": "ك", "r": "ر", "e": "ى", "w": "و", "z": "ز",
        // Harakat (音符) 代表符號
        '^': 'َ', '_': 'ِ', '~': 'ُ', '°': 'ْ', '#': 'ّ',
        '^^': 'ً', '__': 'ٍ', '~~': 'ٌ',
    };
    
    // 3. Harakat 輸入邏輯對應表
    const harakatSymbolMap = {
        'A': '^', 'I': '_', 'U': '~', 'O': '°', 'W': '#'
    };

    // 4. 狀態變數
    const sortedKeys = Object.keys(translitMap).sort((a, b) => b.length - a.length);
    const candidatePrefixes = ['`', 'x'];
    let activeCandidates = [];
    let composition = { text: '', startIndex: -1 };
    let lastShiftKeyPress = { key: null, time: 0 };
    const doublePressThreshold = 300; 

    // 5. 核心函式
    function insertAtCursor(field, textToInsert) {
        const startPos = field.selectionStart;
        const endPos = field.selectionEnd;
        field.value = field.value.substring(0, startPos) + textToInsert + field.value.substring(endPos, field.value.length);
        field.selectionStart = field.selectionEnd = startPos + textToInsert.length;
        field.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function replaceAtCursor(field, textToReplace, textToInsert) {
        const startPos = field.selectionStart;
        const currentPos = startPos - textToReplace.length;
        if (currentPos < 0) return; // 安全檢查
        field.value = field.value.substring(0, currentPos) + textToInsert + field.value.substring(startPos, field.value.length);
        field.selectionStart = field.selectionEnd = currentPos + textToInsert.length;
        field.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function updateConversion() {
        const text = latinInput.value;
        let arabicResult = '';
        let i = 0;
        while (i < text.length) {
            if (i === composition.startIndex) {
                i += composition.text.length;
                continue;
            }
            let matchFound = false;
            for (const key of sortedKeys) {
                if (text.substring(i, i + key.length) === key) {
                    arabicResult += translitMap[key];
                    i += key.length;
                    matchFound = true;
                    break;
                }
            }
            if (!matchFound) {
                arabicResult += text[i];
                i++;
            }
        }
        arabicOutput.value = arabicResult;
        const cursorPosition = latinInput.selectionStart;
        const lastWord = text.substring(0, cursorPosition).split(/[\s\.,\?!;\(\)]+/).pop();
        if (lastWord && candidatePrefixes.includes(lastWord[0])) {
            const potentialMatches = Object.keys(translitMap).filter(k => k.startsWith(lastWord));
            if (potentialMatches.length > 0 && potentialMatches[0] !== lastWord) {
                activeCandidates = potentialMatches;
                composition.text = lastWord;
                composition.startIndex = cursorPosition - lastWord.length;
                showCandidates(potentialMatches);
            } else {
                hideCandidates();
            }
        } else {
            hideCandidates();
        }
    }
    
    function showCandidates(candidates) {
        if (candidates.length === 0) { hideCandidates(); return; }
        candidateWindow.innerHTML = candidates.map((key, index) => 
            `<div class="candidate-item" data-key="${key}"><span class="num">${index + 1}</span><span class="arabic">${translitMap[key]}</span><span>(${key})</span></div>`
        ).join('');
        candidateWindow.classList.remove('hidden');
    }

    function hideCandidates() {
        candidateWindow.classList.add('hidden');
        activeCandidates = [];
        composition = { text: '', startIndex: -1 };
    }

    function commitCandidate(selectedKey) {
        const text = latinInput.value;
        const pretext = text.substring(0, composition.startIndex);
        const posttext = text.substring(composition.startIndex + composition.text.length);
        latinInput.value = pretext + selectedKey + ' ' + posttext;
        hideCandidates();
        updateConversion();
        latinInput.focus();
        latinInput.selectionStart = latinInput.selectionEnd = (pretext + selectedKey + ' ').length;
    }

    // 6. 事件監聽
    latinInput.addEventListener('input', updateConversion);
    
    // [已修正] 確保只有一個 keydown 事件監聽器
    latinInput.addEventListener('keydown', (e) => {
        if (e.shiftKey) {
            const key = e.key.toUpperCase();
            const currentTime = Date.now();
            const symbol = harakatSymbolMap[key];

            if (symbol) {
                e.preventDefault();
                // 檢查是否為連續按鍵
                if (lastShiftKeyPress.key === key && (currentTime - lastShiftKeyPress.time < doublePressThreshold)) {
                    replaceAtCursor(latinInput, symbol, symbol + symbol);
                    lastShiftKeyPress = { key: null, time: 0 };
                } else {
                    insertAtCursor(latinInput, symbol);
                    lastShiftKeyPress = { key: key, time: currentTime };
                }
                return;
            }
        }
        
        if (!e.shiftKey) {
            lastShiftKeyPress = { key: null, time: 0 };
        }

        // 候選字視窗邏輯
        if (activeCandidates.length > 0) {
            const keyNum = parseInt(e.key);
            if (keyNum >= 1 && keyNum <= activeCandidates.length) {
                e.preventDefault();
                commitCandidate(activeCandidates[keyNum - 1]);
            }
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                commitCandidate(activeCandidates[0]);
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                hideCandidates();
            }
        }
    });

    candidateWindow.addEventListener('mousedown', (e) => {
        const item = e.target.closest('.candidate-item');
        if (item) {
            e.preventDefault();
            commitCandidate(item.dataset.key);
        }
    });

    // 表格生成邏輯
    const toggleBtn = document.getElementById('toggle-map-btn');
    const mapContainer = document.getElementById('map-container');
    const mapTableBody = document.querySelector('#char-map-table tbody');

    function populateCharMap() {
        mapTableBody.innerHTML = ''; 
        const sortedMap = Object.entries(translitMap).sort((a, b) => a[0].localeCompare(b[0]));
        for (const [latin, arabic] of sortedMap) {
            const row = document.createElement('tr');
            const latinCell = document.createElement('td');
            latinCell.textContent = latin;
            const arabicCell = document.createElement('td');
            arabicCell.textContent = arabic;
            row.appendChild(latinCell);
            row.appendChild(arabicCell);
            mapTableBody.appendChild(row);
        }
    }

    toggleBtn.addEventListener('click', () => {
        mapContainer.classList.toggle('hidden');
    });

    populateCharMap();
});
document.addEventListener('DOMContentLoaded', () => {
    // 1. 取得 HTML 元素
    const latinInput = document.getElementById('latin-input');
    const arabicOutput = document.getElementById('arabic-output');
    const candidateWindow = document.getElementById('candidate-window');

    // 2. 根據你提供的 CSV 檔案建立的對應規則
    // 鍵的順序很重要，長度較長的鍵（如 'vdh'）必須在較短的鍵（如 'vd'）之前，以確保優先匹配。
    // [已修改] 將所有 'v' 前綴替換為 '`'
    const translitMap = {
        "`dh": "ظ", // vdh -> `dh
        "kh": "خ", "sh": "ش", "dh": "ذ", "gh": "غ", 
        "`h": "ح",  // vh  -> `h
        "xs": "ص", "th": "ث", 
        "`t": "ط",  // vt  -> `t
        "`d": "ض",  // vd  -> `d
        "`a": "ة",  // va  -> `a
        "xw": "ؤ", "xy": "ئ", "xx": "ء", "xi": "إ", "xa": "أ", "ai": "ع", "aa": "آ",
        "q": "ق", "f": "ف", "h": "ه", "j": "ج", "d": "د", "s": "س",
        "y": "ي", "b": "ب", "l": "ل", "a": "ا", "t": "ت", "n": "ن",
        "m": "م", "k": "ك", "r": "ر", "e": "ى", "w": "و", "z": "ز"
    };
    
    // 將 map 的鍵預先排序，從長到短 
    const sortedKeys = Object.keys(translitMap).sort((a, b) => b.length - a.length);

    // [已修改] 定義觸發候選字視窗的前綴
    const candidatePrefixes = ['`', 'x'];
    let activeCandidates = [];
    let composition = { text: '', startIndex: -1 };


    // 3. 核心轉換與邏輯更新函式
    function updateConversion() {
        const text = latinInput.value;
        let arabicResult = '';
        let lastCommittedIndex = 0;
        
        // --- 完整轉譯，忽略當前的組合詞 ---
        let i = 0;
        while (i < text.length) {
            // 如果進入了正在輸入的組合詞區域，先跳過
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

        // --- 候選字邏輯 ---
        // 取得游標位置
        const cursorPosition = latinInput.selectionStart;
        // 尋找游標前最後一個未被轉換的詞
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
        if (candidates.length === 0) {
            hideCandidates();
            return;
        }
        candidateWindow.innerHTML = candidates.map((key, index) => 
            `<div class="candidate-item" data-key="${key}">
                <span class="num">${index + 1}</span>
                <span class="arabic">${translitMap[key]}</span>
                <span>(${key})</span>
            </div>`
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
        updateConversion(); // 重新觸發轉換
        
        // 將游標移動到剛插入的詞後面
        latinInput.focus();
        latinInput.selectionStart = latinInput.selectionEnd = (pretext + selectedKey + ' ').length;
    }

    // 4. 事件監聽
    latinInput.addEventListener('input', updateConversion);
    
    latinInput.addEventListener('keydown', (e) => {
        if (activeCandidates.length > 0) {
            const keyNum = parseInt(e.key);
            if (keyNum >= 1 && keyNum <= activeCandidates.length) {
                e.preventDefault(); // 阻止數字 '1', '2' 等被輸入
                commitCandidate(activeCandidates[keyNum - 1]);
            }
            if (e.key === ' ' || e.key === 'Enter') { // 用空格或Enter選擇第一個
                e.preventDefault();
                commitCandidate(activeCandidates[0]);
            }
            if (e.key === 'Escape') { // 用Esc取消
                e.preventDefault();
                hideCandidates();
            }
        }
    });

    // 點擊候選字也可以選擇
    candidateWindow.addEventListener('mousedown', (e) => {
        const item = e.target.closest('.candidate-item');
        if (item) {
            e.preventDefault();
            commitCandidate(item.dataset.key);
        }
    });
});
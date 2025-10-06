# 阿拉伯語拉丁輸入法 (Latin-based Arabic IME)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

這是一個專為阿拉伯語初學者設計的網頁版輸入法工具。它允許使用者透過標準的 QWERTY 鍵盤，以直觀的拉丁字母拼寫方式，即時轉換並輸入標準的阿拉伯文字。專案的核心目標是降低阿拉伯文書寫的入門門檻，讓學習者能專注於語言學習本身，而非記憶複雜的鍵盤佈局。

## ✨ 核心功能

* **即時轉寫**：在左側輸入框輸入拉丁字母，右側會即時顯示對應的阿拉伯文結果。
* **智慧選字窗**：針對發音相似或有多種寫法的字符（例如 `ص` vs `س`），引入了智慧型候選字視窗。使用者可透過特定前綴（` `` ` 和 `x`）觸發，並用數字鍵選字。
* **直覺音符 (Harakat) 輸入**：設計了一套符合語音直覺的 Harakat 輸入方案，透過 `Shift` + `元音` 的方式輸入，並支援連續按兩下輸入 Tanwin 符號。
* **動態字符對照表**：頁面內建一個可隨時展開或收合的完整字符對應表，方便使用者隨時查閱。
* **零設定需求**：整個專案基於原生 HTML, CSS, JavaScript，無需任何編譯或環境設定，下載後即可在瀏覽器中直接運行。

## 🚀 快速開始 (Quick Start)

1.  下載專案檔案。
2.  確保 `index.html`, `style.css`, 和 `script.js` 三個檔案位於同一個資料夾內。
3.  使用任何網頁瀏覽器（如 Chrome, Firefox, Edge）打開 `index.html` 檔案即可開始使用。

## ⌨️ 如何使用 (How to Use)

本輸入法主要有三種輸入模式：基本字母輸入、特殊字符輸入、以及音符 (Harakat) 輸入。

### 1. 基本字母輸入

直接在左側輸入框中輸入對應的拉丁字母即可。例如，輸入 `slam` 會得到 `سلام`。詳細輸入方式請見應用程式視窗內建對應表。

### 2. 特殊字符（候選字）

當遇到發音相似但寫法不同的字符時，可以使用前綴 ` `` ` (倒引號) 或 `x` 來指定字符或啟用選字視窗再按下對應的數字鍵選擇。

* **範例**：輸入 `s` 會得到 `س`。

| 前綴 | 觸發的字符類型 | 範例 |
| :--- | :--- | :--- |
| **` ``** | `ص`, `ط`, `ض`, `ح`, `ظ`, `ة` 等 | 輸入 `` `s `` 得到 `ص` |
| **`x`** | 各種 Hamza (`ء`, `أ`, `إ`...) | 輸入 `xa` 得到 `أ` |

### 3. 音符 (Harakat) 輸入

音符輸入是透過按住 `Shift` 鍵加上特定字母來實現的。

| 音符 | 名稱 | 按鍵操作 | 說明 |
| :--- | :--- | :--- | :--- |
| **ــَـ** | Fatha | `Shift` + `A` | 代表 /a/ 短元音 |
| **ــِـ** | Kasra | `Shift` + `I` | 代表 /i/ 短元音 |
| **ــُـ** | Damma | `Shift` + `U` | 代表 /u/ 短元音 |
| **ــْـ** | Sukun | `Shift` + `O` | 代表無元音 |
| **ــّـ** | Shadda | `Shift` + `W` | 代表疊音 |
| **ــًـ** | Fathatan | `Shift` + `A` + `A` | 連續按兩下 A |
| **ــٍـ** | Kasratan | `Shift` + `I` + `I` | 連續按兩下 I |
| **ــٌـ** | Dammatan | `Shift` + `U` + `U` | 連續按兩下 U |

## 📁 檔案結構

```
.
├── index.html     # 網頁主體結構
├── style.css      # 頁面樣式
└── script.js      # 核心轉換與互動邏輯
```

## 🛠️ 未來可改進方向


* [ ] **瀏覽器擴充功能**：將此工具封裝成 Chrome/Firefox 擴充功能，使其可以在任何網頁的輸入框中使用。

---

*這份 README.md 由 Gemini 程式夥伴 (AI Assistant) 協助生成。*
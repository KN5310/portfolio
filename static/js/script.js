// script.js

// ————————————————————————————
// 砂嵐ノイズCanvas描画処理
// ローディング画面用の白黒ノイズを連続描画
// ————————————————————————————
const canvas = document.getElementById('noise');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function drawNoise() {
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const buffer = new Uint32Array(imageData.data.buffer);
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = (Math.random() < 0.5) ? 0xffffffff : 0xff000000; // 白か黒のピクセル
  }
  ctx.putImageData(imageData, 0, 0);
  requestAnimationFrame(drawNoise);
}
drawNoise();


// ————————————————————————————
// ローディング画面表示とホワイトアウト → フェードアウト処理
// ページ読み込み後3秒間表示し、その後画面をフェードアウトし本体を表示
// ————————————————————————————
window.addEventListener('load', () => {
  const loading = document.getElementById('loading');

  setTimeout(() => {
    loading.classList.add('whiteout');

    setTimeout(() => {
      loading.classList.add('fadeout');

      setTimeout(() => {
        loading.style.display = 'none';
        document.body.classList.add('loaded');
      }, 500);

    }, 300);
  }, 2000);
});


// ————————————————————————————
// メインタイトル文字に回転アニメーションを付与
// 1文字ずつspanで分割し、それぞれに回転アニメーションを遅延付きで設定
// ————————————————————————————
window.addEventListener('DOMContentLoaded', () => {
  const h1 = document.getElementById('main-title');
  const text = h1.textContent;
  h1.textContent = ''; // 元のテキスト削除

  // spanに分解して追加
  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.display = 'inline-block';
    span.style.animation = `spin 2s linear infinite`;
    span.style.animationDelay = `${i * 1.0}s`;
    h1.appendChild(span);
  });
});


// ————————————————————————————
// 指定コンテナ内のアコーディオン開閉処理をセットする関数
// ————————————————————————————
function setupAccordion(container) {
  container.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const isActive = header.classList.contains('active');

      if (isActive) {
        header.classList.remove('active');
        content.style.display = 'none';
      } else {
        header.classList.add('active');
        content.style.display = 'block';
      }
    });
  });
}


// ————————————————————————————
// プロジェクトHTMLを一括で読み込み、順番通りに挿入＋アコーディオン設定
// ————————————————————————————
window.addEventListener('DOMContentLoaded', () => {
  const projects = ['a', 'b'];
  const container = document.getElementById('projects-container');

  Promise.all(
    projects.map(letter =>
      fetch(`project/projects_${letter}.html`)
        .then(response => {
          if (!response.ok) throw new Error(`Failed to load projects_${letter}.html`);
          return response.text();
        })
    )
  )
  .then(htmls => {
    container.innerHTML = htmls.join('');
    setupAccordion(container); // アコーディオン初期化
  })
  .catch(err => {
    console.error('Failed to load projects:', err);
  });
});

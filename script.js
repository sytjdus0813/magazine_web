const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];


const WORKER_URL = 'https://saetbyeol-gemini-proxy.sytjdus0813.workers.dev/generate';

const geminiCache = new Map();
const geminiTimers = new WeakMap();
/* 2초 로딩 */
/* 로딩 화면 종료 */
function hideLoading() {
  $('#loading')?.classList.add('is-hide');
}

// HTML 구조가 준비되면 로딩 종료
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(hideLoading, 1200);
});

// 이미지·영상까지 모두 로드된 경우에도 종료
window.addEventListener('load', hideLoading);

// 어떤 파일이 로드되지 않아도 최대 4초 후 강제 종료
setTimeout(hideLoading, 4000);

/* 라우팅 */
const pages = $$('.page');
let currentRoute = 'home';

let promptHintTimer = null;

function showPromptCardHint() {
  const hint = $('#promptCardHint');
  if (!hint) return;

  clearTimeout(promptHintTimer);

  hint.classList.add('is-show');

  promptHintTimer = setTimeout(() => {
    hint.classList.remove('is-show');
  }, 2000);
}
function showPage(route) {
  currentRoute = route;
  pages.forEach(page => page.classList.remove('is-active'));

  if (route === 'vol1' || route === 'vol2') {
    renderVolume(route);
    $('#volumePage').classList.add('is-active');
  } else {
    $(`#${route}`)?.classList.add('is-active');
  }

 if (route === 'promptzip') {
  renderCards();
  playActiveVideo();
  showPromptCardHint();
}
if (route === 'official') {
  renderCommonPromptZip();
}
  window.scrollTo({ top: 0, behavior: 'instant' });

  // 추가: Vol.1 / Vol.2 페이지 들어갔을 때 스텝 진행률 초기화
  if (route === 'vol1' || route === 'vol2') {
    setTimeout(updateStepProgress, 50);
  }
}

document.addEventListener('click', (event) => {
  const copyButton = event.target.closest('[data-copy]');

  if (copyButton) {
    const text = decodeURIComponent(copyButton.dataset.copy);
    copyKeyword(text);
    return;
  }

  const routeButton = event.target.closest('[data-route]');
  if (!routeButton) return;

  showPage(routeButton.dataset.route);
});

/* Vol.1 / Vol.2 데이터: 여기만 수정하면 내용 변경 가능 */
const volumeData = {
  vol1: {
    kicker: 'VOL.1',
    title: '업무 보고용 영상 AI로 쉽게 뚝딱!',
    desc: '샛별매거진이 알려주는 AI 쓰리스텝으로 빠르고 쉽게 만들어요',
    mainVideo: './assets/videos/video_2.mp4',
    poster: './assets/images/vol1-thumb.jpg',
    steps: [
      ['STEP_01', '이미지 준비하기'],
      ['STEP_02', 'AI로 영상 뽑기'],
      ['STEP_03', 'CapCut으로 최종 완성하기']
    ],
    accordions: [
  {
    title: '> 01. 이미지 준비하기',
    summary: '준비 이미지 세부 요소를 수정하는 방법 2가지',
    html: `
      <div class="guide-section">
        <p class="guide-lead">
          이미지가 있다는 전제 하에, 이 이미지의 세부 요소를 수정하는 방법을 알려드릴게요.
        </p>

        <div class="guide-card">
          <h4>&lt;선행되는 요소?&gt;</h4>
          <p>
            사용할 이미지를 저장하거나 캡처하여 그림판에 불러옵니다.
          </p>

          <!-- 이미지 넣는 곳 01 -->
          <!-- 권장 사이즈: 16:9 / 1200x675px -->
          <figure class="guide-media ratio-16x9">
            <img src="./assets/images/vol1-step1-before.jpg" alt="이미지 저장 또는 캡처 예시" />
          </figure>
        </div>

        <div class="guide-card">
          <h4>2-1. AI에게 원하는 모습 설명하기</h4>
          <p>
            표시한 부분을 어떻게 바꾸고 싶은지 AI에게 원하는 모습을 설명합니다.
          </p>

          <div class="process-row">
            <div>캡처</div>
            <div>표시</div>
            <div>AI 수정</div>
          </div>

          <!-- 이미지 넣는 곳 02 -->
          <!-- 권장 사이즈: 3장 모두 1:1 / 각 600x600px -->
          <div class="guide-media-grid three">
            <figure class="guide-media ratio-1x1">
              <img src="./assets/images/vol1-step1-capture.jpg" alt="캡처 예시" />
            </figure>
            <figure class="guide-media ratio-1x1">
              <img src="./assets/images/vol1-step1-select.jpg" alt="표시 예시" />
            </figure>
            <figure class="guide-media ratio-1x1">
              <img src="./assets/images/vol1-step1-ai-edit.jpg" alt="AI 수정 예시" />
            </figure>
          </div>
        </div>

        <div class="guide-card">
          <h4>2-2. 직접 합성을 통해 수정하기</h4>
          <p>
            의도한 대로 명확하게 변경을 원한다면 직접 합성을 통해 수정하는 방법을 추천합니다.
          </p>

          <div class="process-row">
            <div>캡처</div>
            <div>이미지 합성</div>
            <div>AI 수정</div>
          </div>

          <!-- 이미지 넣는 곳 03 -->
          <!-- 권장 사이즈: 3장 모두 1:1 / 각 600x600px -->
          <div class="guide-media-grid three">
            <figure class="guide-media ratio-1x1">
              <img src="./assets/images/vol1-step1-composite-capture.jpg" alt="캡처 예시" />
            </figure>
            <figure class="guide-media ratio-1x1">
              <img src="./assets/images/vol1-step1-composite.jpg" alt="이미지 합성 예시" />
            </figure>
            <figure class="guide-media ratio-1x1">
              <img src="./assets/images/vol1-step1-composite-ai.jpg" alt="AI 수정 예시" />
            </figure>
          </div>
        </div>
      </div>
    `
  },
  {
    title: '> 02. AI로 영상 제작하기',
    summary: '영상 제작에 공통적으로 들어가는 프롬프트 공식 & 영상 종류별 프롬프트 모음 zip',
    html: `
      <div class="guide-section">
        <p class="guide-lead">
          AI를 통해 영상을 제작할 때 프롬프트 작성에 익숙하지 않은 분들을 위해,
          영상 제작 시 공통적으로 들어가는 프롬프트 요소를 정리했어요.
        </p>

        <h3>영상 제작에 공통으로 들어가는 9가지 요소</h3>

<div class="keyword-category-grid">

  <section class="keyword-category technical-category">
    <h4 class="keyword-category-title">기술적 요소</h4>

    <ul class="keyword-category-list">
      <li>포맷 / 규격 / 길이·속도</li>
      <li>영상 스타일</li>
      <li>카메라 구도 및 렌즈</li>
      <li>목적 / 출력 용도</li>
      <li>품질 / 렌더링</li>
    </ul>
  </section>

  <section class="keyword-category directing-category">
    <h4 class="keyword-category-title">연출적 요소</h4>

    <ul class="keyword-category-list">
      <li>조명 / 분위기</li>
      <li>피사체 움직임</li>
      <li>컬러 / 브랜딩 / 그래픽</li>
      <li>음악 / 사운드</li>
    </ul>
  </section>

</div>

      
       <div class="zip-center">
  <button class="zip-link box" type="button" data-route="official">
    &gt; 공통 프롬프트 모음 zip 바로가기
  </button>
</div>

        <h3>실무에서 자주 쓰는 영상 종류 4가지</h3>

        <div class="type-grid with-media">
          <div class="type-card">
            <!-- GIF 넣는 곳 / 권장 사이즈: 16:9 / 800x450px -->
            <figure class="guide-media ratio-16x9">
              <img src="./assets/gifs/vol1-type-marketing.gif" alt="마케팅용 영상 예시" />
            </figure>
            <strong>마케팅용 영상</strong>
            <p>제품의 분위기와 매력을 강조하는 영상</p>
          </div>

          <div class="type-card">
            <!-- GIF 넣는 곳 / 권장 사이즈: 16:9 / 800x450px -->
            <figure class="guide-media ratio-16x9">
              <img src="./assets/gifs/vol1-type-usp.gif" alt="기능 설명용 영상 예시" />
            </figure>
            <strong>기능 / USP 설명용 영상</strong>
            <p>핵심 기능과 차별점을 쉽게 설명하는 영상</p>
          </div>

          <div class="type-card">
            <!-- GIF 넣는 곳 / 권장 사이즈: 16:9 / 800x450px -->
            <figure class="guide-media ratio-16x9">
              <img src="./assets/gifs/vol1-type-scene.gif" alt="사용씬 제안용 영상 예시" />
            </figure>
            <strong>사용씬 제안용 영상</strong>
            <p>제품이 실제로 쓰이는 상황을 보여주는 영상</p>
          </div>

          <div class="type-card">
            <!-- GIF 넣는 곳 / 권장 사이즈: 16:9 / 800x450px -->
            <figure class="guide-media ratio-16x9">
              <img src="./assets/gifs/vol1-type-structure.gif" alt="구조 설명용 영상 예시" />
            </figure>
            <strong>구조 / 작동 설명용 영상</strong>
            <p>제품 내부 구조나 작동 방식을 설명하는 영상</p>
          </div>
        </div>

       <div class="zip-center">
       <button class="zip-link box" type="button" data-route="promptzip">
                    &gt; 영상 종류별 프롬프트 모음 zip 바로가기
       </button>
</div>
      </div>
    `
  },
  {
    title: '> 03. CapCut으로 최종 완성하기',
    summary: '영상 수정 방법 2가지 / 캡컷 PC를 이용한 편집 방법',
    html: `
      <div class="guide-section">
        <p class="guide-lead">
          AI 특성상 단 한 번에 완벽한 결과물이 나오지 않는 순간들도 있어요.
          효율적으로 영상을 수정하고, CapCut으로 최종 편집하는 방법을 안내드릴게요.
        </p>

        <h3>영상 수정 방법 2가지</h3>

        <div class="guide-card">
          <h4>방법 1. 프레임 수정</h4>
          <p>
            오류가 난 특정 장면을 이미지로 추출한 뒤, 수정할 부분을 표시합니다.
            프롬프트와 함께 입력해 해당 구간만 재생성하고 원본 영상에 합성합니다.
          </p>
        </div>

        <div class="guide-card">
          <h4>방법 2. 재생성</h4>
          <p>
            문제가 된 씬의 프롬프트를 보완해 해당 장면만 새로 생성한 후,
            기존 영상 흐름에 맞춰 연결합니다.
          </p>
        </div>

        <h3>PC용 CapCut으로 편집하기</h3>

        <div class="capcut-list image-left">
          <div class="capcut-row">
            <!-- 이미지 넣는 곳 / 권장 사이즈: 16:9 / 800x450px -->
            <figure class="guide-media ratio-16x9">
              <img src="./assets/images/vol1-capcut-import.jpg" alt="자료 불러오기 예시" />
            </figure>
            <div>
              <strong>1. 자료 불러오기</strong>
              <p>
                [가져오기] 버튼으로 제작에 필요한 자료를 프로젝트 안으로 가져온 뒤,
                원하는 타임라인에 배치합니다.
              </p>
            </div>
          </div>

          <div class="capcut-row">
            <!-- 이미지 넣는 곳 / 권장 사이즈: 16:9 / 800x450px -->
            <figure class="guide-media ratio-16x9">
              <img src="./assets/images/vol1-capcut-cut.jpg" alt="컷편집 예시" />
            </figure>
            <div>
              <strong>2. 컷편집</strong>
              <p>
                마커를 이동하여 [자르기], 필요 없는 장면은 [삭제]를 이용해 정리합니다.
              </p>
            </div>
          </div>

          <div class="capcut-row">
            <!-- 이미지 넣는 곳 / 권장 사이즈: 16:9 / 800x450px -->
            <figure class="guide-media ratio-16x9">
              <img src="./assets/images/vol1-capcut-transition.jpg" alt="전환 효과 예시" />
            </figure>
            <div>
              <strong>3. 전환 & 트랜지션</strong>
              <p>
                원하는 편집 효과를 적용하여 타임라인에 드래그합니다.
                무료 소스만으로도 충분히 멋있게 만들 수 있어요.
              </p>
            </div>
          </div>

          <div class="capcut-row">
            <!-- 이미지 넣는 곳 / 권장 사이즈: 16:9 / 800x450px -->
            <figure class="guide-media ratio-16x9">
              <img src="./assets/images/vol1-capcut-caption.jpg" alt="자막 편집 예시" />
            </figure>
            <div>
              <strong>4. 자막</strong>
              <p>
                SRT 파일을 만들어서 [캡션]으로 불러오고,
                불러온 파일을 타임라인으로 끌어옵니다.
              </p>
            </div>
          </div>
        </div>

        <div class="srt-box">
          <h4>SRT 파일 생성 방법</h4>
          <ol>
            <li>메모장을 열어 자막 내용을 입력합니다.</li>
            <li>파일을 다른 이름으로 저장합니다.</li>
            <li>파일 이름은 <code>script.srt</code>로 입력합니다.</li>
            <li>파일 형식은 “모든 파일”, 인코딩은 “UTF-8”을 선택합니다.</li>
          </ol>
        </div>
      </div>
    `
  }
]
  },
  
 vol2: {
  kicker: 'VOL.2',
  title: '워크샵용 팀 소개 영상 AI로 만들기',
  desc: '사진과 레퍼런스 영상으로 팀 소개 영상을 빠르게 완성해요',
  mainVideo: './assets/videos/video2-1.mp4',
  poster: './assets/images/vol2-thumb.jpg',
  steps: [
    ['STEP_01', '소스 준비하기'],
    ['STEP_02', '구글 Flow로 얼굴 바꾸기'],
    ['STEP_03', 'CapCut 모바일로 편집하기']
  ],
  accordions: [
    {
      title: '> 01. 소스 이미지와 영상 준비하기',
      summary: '신규 팀원 사진, 팀 활동 장면, 프로젝트 사진과 레퍼런스 영상을 준비합니다.',
      html: `
        <div class="guide-section vol2-step1-layout">
          <div class="source-card-grid">
            <div class="source-card">
              <strong>신규 팀원 얼굴 사진</strong>
              <p>얼굴이 자연스럽게 보이는 사진 1장</p>
              <figure class="guide-media ratio-1x1">
                <img src="./assets/images/2-1.png" alt="신규 팀원 얼굴 사진 예시" />
              </figure>
            </div>

            <div class="source-card">
              <strong>팀 활동 / 회의 장면</strong>
              <p>협업하거나 대화하는 장면 2~3장</p>
              <figure class="guide-media ratio-1x1">
                <img src="./assets/images/2-2.png" alt="팀 활동 장면 예시" />
              </figure>
            </div>

            <div class="source-card">
              <strong>프로젝트 사진</strong>
              <p>올해의 주요 프로젝트를 보여주는 사진 2~3장</p>
              <figure class="guide-media ratio-1x1">
                <img src="./assets/images/2-3.png" alt="프로젝트 사진 예시" />
              </figure>
            </div>
          </div>

          <div class="checklist-panel pink">
            <span class="checklist-label">☑ Check List</span>
            <ul class="pink-check-list">
              <li>얼굴이 자연스럽게 보이는 사진</li>
              <li>조명이 너무 어둡지 않고 해상도가 낮지 않은 사진</li>
              <li>팀원들이 협업하거나 대화하는 장면</li>
              <li>해당 내용이 공개 가능한 범위 내인지 확인</li>
            </ul>
          </div>

          <div class="guide-card vol2-card">
            <h4>레퍼런스 영상 찾기</h4>
            <p>
              AI로 만들 장면의 레퍼런스는 Higgsfield의 viral presets에서 찾아봅니다.
              원하는 영상을 고른 뒤, 영상이 자세히 보이는 페이지에서 길게 클릭해
              “동영상 다운로드”를 선택해주세요.
            </p>

            <div class="zip-center spaced">
              <a class="zip-link box magenta" href="https://higgsfield.ai/viral-presets" target="_blank">
                &gt; 레퍼런스 영상 사이트 바로가기
              </a>
            </div>

            <figure class="guide-media ratio-16x9">
              <img src="./assets/images/2-4.png" alt="레퍼런스 영상 다운로드 예시" />
            </figure>
          </div>

          <div class="guide-card vol2-card">
            <h4>스토리 먼저 정하기</h4>
            <p>
              이 과정에서 영상의 스토리를 먼저 정해두세요.
              스토리가 잡히면 뒤의 과정이 짧고 명확해집니다.
            </p>

            <div class="writing-block pink">
              <strong>예시 스토리</strong>
              <p>
                새 팀원이 등장하고, 팀 활동 장면과 프로젝트 이미지를 자연스럽게 연결한 뒤,
                마지막에 팀명과 역할을 보여주는 40초~1분 길이의 팀 소개 영상.
              </p>
            </div>
          </div>
        </div>
      `
    },
    {
      title: '> 02. 구글 Flow로 얼굴 바꾸기',
      summary: '사진과 레퍼런스 영상을 업로드하고, 프롬프트로 인물을 자연스럽게 교체합니다.',
      html: `
        <div class="guide-section">
          <p class="guide-lead">
            이제 준비한 사진과 영상을 들고 구글 Flow에 접속합니다.
            새 프로젝트를 만든 뒤 사진과 영상을 업로드하고 프롬프트를 입력하면 됩니다.
          </p>

          <div class="zip-center">
            <a class="zip-link box magenta" href="https://labs.google/fx/ko/tools/flow" target="_blank">
              &gt; 구글 Flow 바로가기
            </a>
          </div>

          <h3>작업 순서</h3>

          <div class="flow-steps pretty">
            <div>
              <span>01</span>
              <strong>새 프로젝트 클릭</strong>
            </div>
            <div>
              <span>02</span>
              <strong>사진 / 영상 업로드</strong>
            </div>
            <div>
              <span>03</span>
              <strong>프롬프트 입력</strong>
            </div>
            <div>
              <span>04</span>
              <strong>비율 / 길이 / 장면 수 설정</strong>
            </div>
            <div>
              <span>05</span>
              <strong>생성 후 결과 확인</strong>
            </div>
          </div>

          <h3>프롬프트 공식</h3>

          <div class="formula-wrap">
            <div class="prompt-formula-box pink">
              <p>
                첨부한 영상에 있는 인물을, 첨부한 사진에 있는 인물로 바꾸어 출력해줘.<br />
                영상의 배경, 움직임, 구도, 분위기는 유지해줘.<br />
                얼굴은 첨부한 사진 속 인물과 동일하게 만들어줘.<br />
                원본 영상의 카메라 움직임은 그대로 살려줘.<br />
                얼굴이 흔들리거나 깨지지 않게 안정적으로 만들어줘.
              </p>
            </div>
          </div>

          <h3>결과가 어색할 때 추가 요청 예시</h3>

          <div class="prompt-chip-grid pink-chip">
            <span>얼굴을 더 자연스럽게 만들어줘</span>
            <span>눈과 입이 흔들리지 않게 해줘</span>
            <span>원본 영상의 움직임을 더 유지해줘</span>
            <span>카메라 구도를 원본과 비슷하게 유지해줘</span>
          </div>

          <h3>프롬프트 적용 예시</h3>
          <div class="compare-grid two-media">
            <div>
              <figure class="guide-media ratio-16x9">
                <img src="./assets/gifs/vol.2.gif" alt="원본 영상 예시" />
              </figure>
              <strong>원본 영상</strong>
            </div>
            <div>
              <figure class="guide-media ratio-16x9">
                <img src="./assets/gifs/2-af.gif" alt="구글 Flow 결과 예시" />
              </figure>
              <strong>구글 Flow 결과 예시</strong>
            </div>
          </div>

          <h3>추가 예시</h3>
          <div class="example-gif-grid">
            <figure class="guide-media ratio-16x9">
              <img src="./assets/gifs/ex-1.gif" alt="추가 예시 1" />
            </figure>
            <figure class="guide-media ratio-16x9">
              <img src="./assets/gifs/ex-2.gif" alt="추가 예시 2" />
            </figure>
            <figure class="guide-media ratio-16x9">
              <img src="./assets/gifs/ex-3.gif" alt="추가 예시 3" />
            </figure>
            <figure class="guide-media ratio-16x9">
              <img src="./assets/gifs/ex-4.gif" alt="추가 예시 4" />
            </figure>
          </div>

          <div class="zip-center">
            <a class="zip-link box magenta" href="https://drive.google.com/drive/folders/1986t_T7CQyAIKHMKMDczabVpx8RhJjTu" target="_blank">
              &gt; 추가 예시 더 보러가기
            </a>
          </div>
        </div>
      `
    },
    {
      title: '> 03. CapCut 모바일로 편집하기',
      summary: 'AI 영상을 불러와 장면 배치, 속도 조절, 자막, 음악을 추가해 완성합니다.',
      html: `
        <div class="guide-section">
          <p class="guide-lead">
            AI가 영상을 만들어줬다면 마지막 단계는 편집입니다.
            CapCut 모바일에서 장면을 배치하고 자막과 음악을 추가해 40초~1분 길이로 완성합니다.
          </p>

          <h3>CapCut 모바일 편집 순서</h3>

          <div class="capcut-list image-left mobile-edit-list">
            <div class="capcut-row">
              <figure class="guide-media ratio-9x16">
                <img src="./assets/images/c-1.png" alt="AI 영상 불러오기 예시" />
              </figure>
              <div>
                <strong>1. AI 영상 불러오기</strong>
                <p>생성된 AI 영상을 CapCut 모바일 프로젝트 안으로 불러옵니다.</p>
              </div>
            </div>

            <div class="capcut-row">
              <figure class="guide-media ratio-9x16">
                <img src="./assets/images/c-2.png" alt="장면 배치 예시" />
              </figure>
              <div>
                <strong>2. 장면 배치</strong>
                <p>여러 클립을 원하는 순서대로 타임라인에 배치합니다.</p>
              </div>
            </div>

            <div class="capcut-row">
              <figure class="guide-media ratio-9x16">
                <img src="./assets/images/c-3.png" alt="속도 조절 예시" />
              </figure>
              <div>
                <strong>3. 속도 조절</strong>
                <p>클립을 선택한 뒤 하단 메뉴를 통해 영상 길이와 속도를 조절합니다.</p>
              </div>
            </div>

            <div class="capcut-row">
             <figure class="guide-media ratio-9x16">
                <img src="./assets/images/c-4.png" alt="자막 추가 예시" />
              </figure>
              <div>
                <strong>4. 자막 추가</strong>
                <p>하단의 텍스트 메뉴를 선택해 팀명, 이름, 역할을 넣습니다.</p>
              </div>
            </div>

            <div class="capcut-row">
             <figure class="guide-media ratio-9x16">
                <img src="./assets/images/c-5.png" alt="음악 추가 예시" />
              </figure>
              <div>
                <strong>5. 음악 / 효과음 추가</strong>
                <p>오디오 메뉴에서 배경음악이나 효과음을 추가합니다.</p>
              </div>
            </div>

            <div class="capcut-row">
              <figure class="guide-media ratio-9x16">
                <img src="./assets/images/c-6.png" alt="캡컷 마크 제거 예시" />
              </figure>
              <div>
                <strong>6. 캡컷 마크 제거</strong>
                <p>엔딩 추가 영역에 있는 CapCut 마크를 제거합니다.</p>
              </div>
            </div>

            <div class="capcut-row">
             <figure class="guide-media ratio-9x16">
                <img src="./assets/images/c-7.png" alt="AI UHD 설정 예시" />
              </figure>
              <div>
                <strong>7. AI UHD 설정 확인</strong>
                <p>AI UHD 버튼을 누른 뒤 동영상의 설정을 확인합니다.</p>
              </div>
            </div>
          </div>
        </div>
      `
    }
  ]
  }
};

function renderVolume(route) {
  const data = volumeData[route];
  $('#volumePage').dataset.volume = route;

  $('#volKicker').textContent = data.kicker;
  $('#volTitle').textContent = data.title;
  $('#volDesc').textContent = data.desc;
  const mainVideoBox = $('#mainVideoBox');

if (data.mainVideo) {
  mainVideoBox.innerHTML = `
    <video 
      src="${data.mainVideo}" 
      poster="${data.poster || ''}" 
      controls 
      playsinline
    ></video>
  `;
} else {
  mainVideoBox.innerHTML = `<span>영상</span>`;
}

  $('#volSteps').innerHTML = data.steps.map(([step, label]) => `
    <div class="step-item">
      <strong>${step}</strong>
      <span>${label}</span>
    </div>
  `).join('');

  $('#accordion').innerHTML = data.accordions.map((item, index) => `
    <section class="toggle-item">
     <button class="toggle-btn" type="button">
  <span class="toggle-title-wrap">
    <span class="toggle-title">${item.title}</span>
    ${item.summary ? `<span class="toggle-summary">${item.summary}</span>` : ''}
  </span>
  <span class="plus">＋</span>
</button>
     <div class="toggle-body">
  ${item.html ? item.html : `
    <p>${item.body}</p>
    <div class="media-grid">
      ${item.media.map(renderMedia).join('')}
    </div>
  `}
</div>
    </section>
  `).join('');

 $$('.toggle-btn', $('#accordion')).forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.toggle-item').classList.toggle('is-open');

    // 추가: 토글 열고 닫은 뒤 높이가 바뀌므로 진행률 다시 계산
    setTimeout(updateStepProgress, 100);
  });
});
}

function renderMedia(media) {
  // 파일이 아직 없어도 깨진 아이콘 대신 placeholder가 보이도록 구성
  if (media.type === 'video') {
    return `<div class="media"><video src="${media.src}" controls muted playsinline onerror="this.style.display='none'; this.parentElement.dataset.empty='true';"></video><span>${media.label}</span></div>`;
  }
  return `<div class="media"><img src="${media.src}" alt="${media.label}" onerror="this.style.display='none';" /><span>${media.label}</span></div>`;
}
const commonPromptGroups = [
  {
    title: '1. 포맷 / 규격 / 길이 · 속도',
    keywords: ['16:9', '9:16', '1:1', '1080p', '4K', '24fps', '30fps', '10 seconds', '5 seconds', '30 seconds', 'slow motion', 'seamless loop', 'fast cut', 'landscape', 'portrait', '4:5', '2K', '8K', '60fps', '15 seconds', '3 seconds', 'timelapse', '21:9', '1.85:1', '2.39:1', '4:3', '3:2', '5:4', '1440p', '6K', '48fps', '6 seconds', '8 seconds', '20 seconds', 'hyperlapse', 'speed ramp', 'reverse motion', 'single take', 'long take', 'freeze frame', 'frame hold', 'fade in', 'fade out', '1.43:1', '1.90:1']
  },
  {
    title: '2. 영상 스타일',
    keywords: ['photorealistic', 'cinematic', '3D animation', 'documentary style', 'commercial advertising', 'anime style', 'sci-fi', 'fantasy', 'noir', 'vlog style', 'motion graphics', 'corporate video', 'product showcase', 'hyperrealistic', 'cinematic realism', '2D animation', 'editorial style', 'fashion film', 'cyberpunk', 'retro-futuristic', 'surreal', 'dreamlike', 'travel film', 'music video style', 'stop motion', 'vintage film look', 'luxury commercial', 'macro photography', 'food photography style', 'steampunk', 'miniature style', 'documentary realism', 'mixed media', 'architectural visualization', 'sports broadcast style', 'news broadcast style']
  },
  {
    title: '3. 카메라 / 구도 / 렌즈',
    keywords: ['close-up', 'wide shot', 'eye level', 'low angle', 'high angle', 'dolly-in', 'static shot', 'handheld', 'tracking shot', 'drone shot', "bird's eye view", 'POV shot', 'medium shot', 'rule of thirds', 'centered composition', 'slow zoom', 'orbit', 'crane shot', 'pan left', 'pan right', 'shallow depth of field', 'lens flare', 'bokeh', 'wide angle lens', '35mm lens', '50mm lens', 'symmetrical framing', 'extreme close-up', 'full shot', 'two shot', 'establishing shot', "worm's eye view", 'aerial shot', 'dolly-out', 'push-in', 'pull-out', 'tilt up', 'tilt down', 'over-the-shoulder shot', 'arc shot', 'gimbal shot', 'steadicam shot', 'snap zoom', 'whip pan', 'Dutch angle', 'rack focus', 'deep focus', 'leading lines', 'negative space', 'foreground framing', 'cowboy shot', 'insert shot', '24mm lens', '85mm lens', 'fisheye lens', 'anamorphic lens', 'telephoto lens', 'macro lens']
  },
  {
    title: '4. 조명 / 분위기',
    keywords: ['golden hour', 'studio lighting', 'natural daylight', 'warm ambient light', 'cool tone', 'soft diffused light', 'dramatic side lighting', 'backlighting', 'blue hour', 'neon lighting', 'candlelight', 'rim lighting', 'sunset lighting', 'sunrise lighting', 'high key lighting', 'low key lighting', 'hard light', 'soft shadows', 'harsh shadows', 'soft studio lighting', 'moonlight', 'foggy atmosphere', 'misty atmosphere', 'dreamy lighting', 'cinematic lighting', 'silhouette lighting', 'overcast lighting', 'practical lighting', 'tungsten lighting', 'fluorescent lighting', 'firelight', 'god rays', 'volumetric lighting', 'chiaroscuro lighting', 'atmospheric haze', 'rainy atmosphere', 'twilight ambiance', 'ethereal glow']
  },
  {
    title: '5. 피사체 움직임',
    keywords: ['walking', 'running', 'looking at camera', 'dancing', 'spinning', 'floating', 'turning head', 'camera shake', 'wind effect', 'jumping', 'waving', 'explosion', 'particles', 'water splash', 'hair movement', 'cloth simulation', 'flying', 'swimming', 'falling', 'idle animation', 'slow turning']
  },
  {
    title: '6. 컬러 / 브랜딩 / 그래픽',
    keywords: ['vibrant colors', 'black and white', 'warm color palette', 'cool color palette', 'cinematic color grading', 'high saturation', 'low saturation', 'muted tones', 'pastel palette', 'monochrome palette', 'captions', 'subtitles', 'title card', 'lower-third text', 'animated logo', 'teal & orange grading', 'vignette', 'LUT applied', 'gradient overlay', 'consistent color theme', 'logo watermark', 'neon palette', 'earth tone palette', 'luxury palette', 'complementary color scheme', 'brand color palette', 'duotone', 'bloom effect', 'kinetic typography', 'callout text', 'progress bar', 'infographic overlay', 'end card branding', 'brand identity system', 'UI overlay']
  },
  {
    title: '7. 음악 / 사운드',
    keywords: ['upbeat electronic', 'cinematic score', 'lo-fi piano', 'no music', 'ambient sound', 'voiceover male', 'voiceover female', 'no voiceover', 'sound effects only', 'orchestral score', 'acoustic guitar', 'EDM', 'epic soundtrack', 'synthwave', 'emotional soundtrack', 'piano solo', 'corporate background music', 'nature sounds', 'percussion-driven', 'cinematic trailer music', 'dramatic build-up', 'calm instrumental', 'jazz background', 'hip-hop beat', 'energetic pop', 'surround sound', 'stereo', 'whoosh sound', 'transition SFX', 'crowd ambience', 'city ambience', 'rain ambience', 'spatial audio', 'ASMR audio', 'BPM 90-120', 'narration tone warm', 'narration tone authoritative', 'narration tone youthful', 'royalty-free track style']
  },
  {
    title: '8. 목적 / 출력 용도',
    keywords: ['SNS 광고', 'YouTube Shorts', 'Instagram Reels', 'TikTok', 'promotional campaign', 'teaser trailer', 'explainer video', 'brand storytelling', 'educational content', 'website hero video', 'training video', 'social campaign', 'cinematic trailer', 'internal report', 'exhibition loop', 'onboarding video', 'app splash video', 'e-commerce showcase', 'product launch teaser', 'presentation background', 'keynote opener', 'recruitment video', 'investor presentation', 'event highlight reel']
  },
  {
    title: '9. 품질 / 렌더링',
    keywords: ['cinematic', 'photorealistic', '8K', 'high detail', 'sharp focus', 'ultra HD', 'HDR', 'film grain', 'no motion blur', 'no artifacts', 'ray tracing', 'anti-aliasing', 'depth of field', 'global illumination', 'realistic shadows', 'realistic reflections', 'noise-free', 'crisp detail', 'color accurate', 'path tracing', 'physically based rendering PBR', 'subsurface scattering', 'volumetric fog', 'texture detail', 'physically accurate materials', 'physically accurate lighting', 'professional grade render', 'studio-quality finish', 'high polygon count', 'cinematic depth', 'real-time render']
  }
];
function renderCommonPromptZip() {
  const grid = $('#commonPromptGrid');

  if (!grid) return;

  // 처음에는 모든 카드가 닫힌 상태
  grid.innerHTML = commonPromptGroups.map(group => `
    <section class="common-prompt-card">
      <h2>
        <button
          class="common-prompt-toggle"
          type="button"
          aria-expanded="false"
        >
          <span>${group.title}</span>

          <span
            class="common-prompt-plus"
            aria-hidden="true"
          >
            ＋
          </span>
        </button>
      </h2>

      <div class="common-keyword-list">
        ${group.keywords.map(keyword => `
          <button
            class="common-keyword"
            type="button"
            data-copy="${encodeURIComponent(keyword)}"
          >
            ${keyword}
          </button>
        `).join('')}
      </div>
    </section>
  `).join('');

  const cards = $$('.common-prompt-card', grid);
  const toggles = $$('.common-prompt-toggle', grid);

  toggles.forEach(toggle => {
    toggle.addEventListener('click', event => {
      event.stopPropagation();

      // 데스크톱에서는 기존 화면과 동작 유지
      if (!window.matchMedia('(max-width: 680px)').matches) {
        return;
      }

      const selectedCard =
        toggle.closest('.common-prompt-card');

      const isCurrentlyOpen =
        selectedCard.classList.contains('is-open');

      // 우선 모든 카드를 닫음
      cards.forEach(card => {
        card.classList.remove('is-open');

        const cardToggle =
          $('.common-prompt-toggle', card);

        cardToggle?.setAttribute(
          'aria-expanded',
          'false'
        );
      });

      // 원래 닫혀 있던 카드라면 해당 카드만 열기
      // 이미 열려 있던 카드라면 위에서 닫힌 상태로 유지
      if (!isCurrentlyOpen) {
        selectedCard.classList.add('is-open');

        toggle.setAttribute(
          'aria-expanded',
          'true'
        );
      }
    });
  });
}

function showCopyToast() {
  const toast = $('#copyToast');
  if (!toast) return;

  toast.classList.add('is-show');

  clearTimeout(window.copyToastTimer);
  window.copyToastTimer = setTimeout(() => {
    toast.classList.remove('is-show');
  }, 900);
}
function fallbackCopyText(text) {
  const temp = document.createElement('textarea');

  temp.value = text;
  temp.setAttribute('readonly', '');
  temp.style.position = 'fixed';
  temp.style.top = '0';
  temp.style.left = '-9999px';
  temp.style.opacity = '0';

  document.body.appendChild(temp);

  temp.focus();
  temp.select();
  temp.setSelectionRange(0, temp.value.length);

  const copied = document.execCommand('copy');

  temp.remove();

  return copied;
}

async function copyKeyword(text) {
  let copied = false;

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (error) {
      console.warn('Clipboard API failed:', error);
    }
  }

  // 기본 복사가 실패하면 예전 방식으로 다시 시도
  if (!copied) {
    copied = fallbackCopyText(text);
  }

  const toast = $('#copyToast');

  if (toast) {
    toast.textContent = copied
      ? '키워드가 복사됐어요!'
      : '복사에 실패했어요.';
  }

  showCopyToast();
}

/* Prompt Zip 데이터: 카드, 프롬프트, 검색 키워드만 여기서 수정 */
const promptCards = [
  {
    title: '마케팅용',
    image: './assets/images/card04.svg',
    subtitle: ': 제품을 매력적으로',
    tags: '#핵심전달 #프리미엄 #숏스튜디오',
    prompt: `마케팅용 영상 프롬프트

영상 스타일:
luxury commercial, hyperrealistic cinematic realism, fashion film, vintage film look, dreamlike

조명 / 분위기:
soft studio lighting, golden hour, rim lighting, backlighting, ethereal glow

피사체 움직임:
cloth simulation, hair movement, water splash, particles, floating

컬러 / 브랜딩 / 그래픽:
luxury palette, teal & orange grading, complementary color scheme, bloom effect

포맷 / 규격 / 길이 · 속도:
seamless loop, speed ramp, single take, long take`
  },

  {
    title: '기능/USP설명용',
    image: './assets/images/card02.svg',
    subtitle: ': 제품을 특징적으로',
    tags: '#정확한 #이해를돕는 #광고영상',
    prompt: `기능 / USP 설명용 영상 프롬프트

카메라 / 구도 / 렌즈:
insert shot, rack focus, static shot, overhead shot, bird's eye view

영상 스타일:
macro photography, architectural visualization, editorial style, food photography style

피사체 움직임 & 포맷:
slow turning, single take, idle animation, freeze frame moment, explosion

조명 / 분위기:
clean lighting, high key lighting, natural daylight, overcast lighting

목적 및 품질 / 렌더링:
product launch teaser, crisp detail, brand storytelling, cinematic depth, color accurate`
  },

  {
    title: '사용씬 제안용',
    image: './assets/images/card01.svg',
    subtitle: ': 현실적인 사용 장면',
    tags: '#자연스러운 #일상적인 #사용아이디어',
    prompt: `사용씬 제안용 영상 프롬프트

영상 스타일:
lifestyle film, documentary realism, travel film, vlog style

카메라 / 구도 / 렌즈:
gimbal shot, tracking shot, steadicam shot, over-the-shoulder shot, establishing shot, eye level, 35mm lens, two shot

조명 / 분위기:
warm ambient light, natural daylight, indoor lighting, practical lighting, sunrise lighting

피사체 움직임:
hair movement, turning head, walking, looking at camera, wind effect

컬러 / 브랜딩 / 그래픽:
lifestyle color grading, warm color palette, earth tone palette, pastel palette

포맷 / 규격 / 길이 · 속도:
single take, long take, fade in, fade out, slow motion

목적 및 품질 / 렌더링:
lifestyle campaign, brand storytelling, depth of field, realistic shadows, color accurate, HDR`
  },

  {
    title: '구조/작동 설명용',
    image: './assets/images/card03.svg',
    subtitle: ': 깔끔한 기술 설명',
    tags: '#매커니즘 #도면바탕 #테크무드',
    prompt: `구조 / 작동 설명용 영상 프롬프트

영상 스타일:
3D animation, hyperrealistic, physically based rendering (PBR), architectural visualization, mixed media

카메라 / 구도 / 렌즈:
orbit, push-in, pull-out, arc shot, tilt up, tilt down, wide angle lens

피사체 움직임:
explosion, spinning, slow turning, particles

조명 / 분위기:
global illumination, volumetric lighting, god rays, dramatic side lighting, hard light

포맷 / 규격 / 길이 · 속도:
seamless loop, freeze frame, frame hold, timelapse

품질 / 렌더링:
ray tracing, physically accurate materials, physically accurate lighting, texture detail, volumetric fog, subsurface scattering, high polygon count

목적 및 컬러 / 브랜딩:
explainer video, keynote opener, exhibition loop, brand color palette`
  }
];

let activeCard = 0;

function renderCards() {
  const track = $('#cardTrack');
  track.innerHTML = promptCards.map((card, index) => `
    <article class="prompt-card" data-index="${index}">
      <div class="card-thumb">
        ${card.image
          ? `<img src="${card.image}" alt="${card.title} 이미지" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';" />`
          : ''}
        <span class="image-placeholder" style="${card.image ? 'display:none' : ''}">이미지 자리</span>
      </div>
      <div class="card-caption">
        <h3>${card.title}</h3>
        <p>${card.subtitle}</p>
      </div>
      <input class="keyword-search" type="search" placeholder="키워드 검색 ex. 럭셔리" aria-label="키워드 검색" />
      <div class="search-result"></div>
      <p class="card-tags">${card.tags}</p>
      <p class="detail-link">Detailed Prompt &gt;</p>
    </article>
  `).join('');

  updateCarousel();

 $$('.keyword-search', track).forEach(input => {
  input.addEventListener('input', event => {
    const cardEl = event.target.closest('.prompt-card');
    const index = Number(cardEl.dataset.index);
    const result = $('.search-result', cardEl);
    const query = event.target.value.trim();

    clearTimeout(geminiTimers.get(input));

    if (!query) {
      result.innerHTML = '';
      return;
    }

    // 사전에 있는 단어는 기존 결과를 바로 표시
    const dictionaryResults = getKeywordResult(index, query);

    if (dictionaryResults.length > 0) {
      result.innerHTML = renderSearchChips(dictionaryResults);
      return;
    }

    // 사전에 없는 단어는 0.5초 후 Gemini 요청
    result.innerHTML = '<span class="search-loading">AI 추천 생성 중...</span>';

    const timer = setTimeout(async () => {
      try {
        const suggestions = await getGeminiSuggestions(query);

        // API 응답 전에 검색어가 바뀌었으면 이전 결과를 표시하지 않음
        if (input.value.trim() !== query) return;

        result.innerHTML = renderSearchChips(suggestions, true);
      } catch (error) {
        console.error('Gemini API error:', error);

        if (input.value.trim() !== query) return;

        result.innerHTML =
          '<span class="search-error">추천을 불러오지 못했어요.</span>';
      }
    }, 500);

    geminiTimers.set(input, timer);
  });

  input.addEventListener('click', event => event.stopPropagation());
});
$$('.prompt-card', track).forEach(card => {
  card.addEventListener('click', event => {
    // 검색창이나 키워드 칩을 누른 경우 카드 모달을 열지 않음
    if (
      event.target.closest('.keyword-search') ||
      event.target.closest('.search-chip')
    ) {
      return;
    }

    const index = Number(card.dataset.index);

    if (index !== activeCard) {
      activeCard = index;
      updateCarousel();
      playActiveVideo();
      return;
    }

    openPromptModal(index);
  });
});
}
// 키워드 변환기: 한글 검색어 → 영어 추천 키워드(AI 영상 생성 프롬프트용)
// 사용법: keywordDictionary['럭셔리'] → ['luxurious fine dining ambiance', ...]
 
const keywordDictionary = {
  // ── 무드/톤 ──────────────────────────
  '럭셔리': ['luxurious fine dining ambiance', 'elegant gold accents', 'premium spotlight lighting'],
  '따뜻한': ['warm ambient lighting', 'cozy wooden textures', 'soft golden glow'],
  '시원한': ['cool blue tones', 'crisp refreshing atmosphere', 'icy condensation droplets'],
  '몽환적인': ['dreamy soft focus', 'ethereal haze', 'pastel color grading'],
  '발랄한': ['vibrant playful colors', 'energetic quick cuts', 'bright cheerful lighting'],
  '차분한': ['calm muted tones', 'gentle slow pacing', 'minimal soft lighting'],
  '웅장한': ['epic wide-angle shot', 'dramatic orchestral mood', 'sweeping cinematic scale'],
  '낭만적인': ['romantic candlelight glow', 'soft bokeh background', 'intimate close framing'],
  '신비로운': ['mysterious low-key lighting', 'fog and shadow', 'enigmatic atmosphere'],
  '청량한': ['fresh crisp visuals', 'sparkling water droplets', 'clean bright tone'],
  '아늑한': ['cozy intimate setting', 'warm blanket texture', 'soft ambient glow'],
  '강렬한': ['bold high-contrast lighting', 'intense saturated color', 'dynamic fast motion'],
 
  // ── 맛/음식 ──────────────────────────
  '맛있는': ['appetizing close-up shot', 'mouthwatering steam rising', 'rich glossy texture'],
  '신선한': ['fresh vibrant ingredients', 'dew droplets on produce', 'natural daylight'],
  '달콤한': ['sweet syrup drizzle', 'soft pastel palette', 'glistening sugar glaze'],
  '짭짤한': ['salty crystal texture', 'crisp golden crust', 'savory steam rising'],
  '매콤한': ['spicy red glow', 'sizzling steam effect', 'fiery close-up shot'],
  '고소한': ['nutty roasted tone', 'warm caramel lighting', 'rich earthy texture'],
  '바삭한': ['crispy crunch close-up', 'golden fried texture', 'satisfying crackle motion'],
  '촉촉한': ['moist glossy texture', 'juicy close-up shot', 'slow drizzle motion'],
  '진한': ['rich deep color tone', 'thick velvety texture', 'intense flavor close-up'],
  '건강한': ['fresh organic ingredients', 'natural green tones', 'clean healthy plating'],
 
  // ── 스타일/비주얼 ──────────────────────
  '미니멀': ['clean minimal composition', 'negative space', 'monochrome simplicity'],
  '빈티지': ['vintage film grain', 'retro color grading', 'nostalgic sepia tone'],
  '모던': ['sleek modern design', 'geometric composition', 'cool neutral palette'],
  '클래식': ['timeless classic framing', 'elegant symmetry', 'refined color tone'],
  '레트로': ['retro 80s aesthetic', 'neon color palette', 'analog film texture'],
  '미래적인': ['futuristic sci-fi visuals', 'holographic lighting', 'sleek metallic surfaces'],
  '자연친화적인': ['eco-friendly natural setting', 'organic textures', 'earthy green palette'],
  '인더스트리얼': ['industrial concrete backdrop', 'raw metal texture', 'urban loft setting'],
  '감성적인': ['emotional cinematic mood', 'soft film tone', 'intimate storytelling shot'],
  '아트하우스': ['artistic experimental framing', 'surreal visual style', 'abstract composition'],
 
  // ── 조명 ────────────────────────────
  '부드러운조명': ['soft diffused lighting', 'gentle shadow falloff', 'warm ambient glow'],
  '강렬한조명': ['dramatic hard lighting', 'high contrast shadows', 'bold spotlight beam'],
  '자연광': ['natural daylight', 'soft window light', 'sun-drenched atmosphere'],
  '네온사인': ['neon sign glow', 'vibrant pink-blue lighting', 'urban night mood'],
  '실루엣': ['silhouette backlighting', 'dramatic rim light', 'sunset outline shot'],
  '골든아워': ['golden hour glow', 'warm sunset light', 'soft long shadows'],
  '스포트라이트': ['focused spotlight beam', 'dark background contrast', 'dramatic reveal lighting'],
  '은은한조명': ['subtle ambient light', 'low-key warm tone', 'soft candle glow'],
 
  // ── 카메라워크 ─────────────────────────
  '슬로우모션': ['slow motion capture', 'fluid graceful movement', 'dramatic time stretch'],
  '클로즈업': ['extreme close-up shot', 'detailed macro focus', 'intimate framing'],
  '드론샷': ['aerial drone shot', 'sweeping overhead view', 'cinematic wide landscape'],
  '트래킹샷': ['smooth tracking shot', 'dynamic camera movement', 'continuous follow motion'],
  '타임랩스': ['time-lapse sequence', 'fast-forward motion', 'dynamic scene transition'],
  '핸드헬드': ['handheld camera feel', 'natural documentary style', 'subtle camera shake'],
  '매크로촬영': ['macro close-up detail', 'extreme texture focus', 'shallow depth of field'],
  '파노라마': ['panoramic wide shot', 'expansive scenery', 'horizontal sweeping view'],
 
  // ── 색감 ────────────────────────────
  '파스텔톤': ['soft pastel color palette', 'muted gentle tones', 'dreamy light hues'],
  '모노톤': ['monochrome color grading', 'single-tone palette', 'minimal contrast'],
  '비비드컬러': ['vivid saturated colors', 'bold vibrant palette', 'high energy tone'],
  '웜톤': ['warm color grading', 'amber and orange hues', 'cozy tone balance'],
  '쿨톤': ['cool color grading', 'blue and teal hues', 'crisp clean tone'],
  '흑백': ['black and white cinematography', 'high contrast monochrome', 'timeless film grain'],
  '그레이디언트': ['smooth gradient color transition', 'soft blended tones', 'ambient color wash'],
  '채도높은': ['high saturation color', 'punchy vibrant tone', 'bold visual pop'],
 
  // ── 텍스처/질감 ────────────────────────
  '윤기나는': ['glossy shine finish', 'reflective surface', 'polished light glow'],
  '매트한': ['matte finish texture', 'soft non-reflective surface', 'muted tone'],
  '촉촉한질감': ['moist glistening texture', 'dewy surface shine', 'soft wet reflection'],
  '거친질감': ['rough textured surface', 'natural grainy detail', 'raw material feel'],
  '반짝이는': ['sparkling glitter effect', 'shimmering light reflection', 'glossy highlight'],
  '부드러운질감': ['soft smooth texture', 'silky surface finish', 'gentle tactile feel'],
 
  // ── 프리미엄/뷰티 ───────────────────────
  '고급스러운': ['upscale premium aesthetic', 'refined elegant detail', 'sophisticated tone'],
  '프리미엄': ['premium product showcase', 'high-end material finish', 'polished presentation'],
  '하이엔드': ['high-end luxury feel', 'minimalist premium design', 'refined lighting'],
  '세련된': ['sleek sophisticated style', 'polished modern finish', 'elegant simplicity'],
  '우아한': ['graceful elegant movement', 'refined soft lighting', 'timeless beauty'],
  '청순한': ['fresh innocent beauty look', 'soft natural glow', 'pure clean aesthetic'],
  '글로시': ['glossy dewy skin finish', 'radiant highlight', 'luminous glow'],
  '매트한피부': ['matte skin finish', 'soft-focus complexion', 'natural even tone'],
 
  // ── 테크/IT ─────────────────────────
  '미래지향적': ['futuristic tech aesthetic', 'sleek digital interface', 'forward-looking visual'],
  '스마트한': ['smart minimal design', 'clean digital UI', 'intelligent tech feel'],
  '혁신적인': ['innovative concept visual', 'cutting-edge design', 'breakthrough tech mood'],
  '디지털': ['digital interface overlay', 'data visualization motion', 'holographic elements'],
  '하이테크': ['high-tech metallic finish', 'futuristic circuit patterns', 'sleek device close-up'],
  '심플한UI': ['clean simple interface', 'minimal flat design', 'intuitive digital layout'],
 
  // ── 라이프스타일/공간 ───────────────────
  '홈카페': ['cozy home cafe setting', 'wood table ambiance', 'soft natural light'],
  '우드톤인테리어': ['warm wood-tone interior', 'natural material texture', 'earthy cozy space'],
  '미니멀인테리어': ['minimalist interior design', 'clean open space', 'neutral tone palette'],
  '코지한공간': ['cozy intimate space', 'soft textiles', 'warm inviting atmosphere'],
  '도심속': ['urban city backdrop', 'modern skyline view', 'bustling metropolitan mood'],
  '자연속': ['natural outdoor setting', 'lush greenery', 'organic peaceful environment'],
  '스튜디오촬영': ['clean studio backdrop', 'professional product lighting', 'seamless background'],
  '일상적인': ['everyday lifestyle scene', 'candid natural moment', 'relatable daily setting'],
 
  // ── 감정/스토리텔링 ─────────────────────
  '감동적인': ['touching emotional storytelling', 'heartfelt moment', 'soft cinematic tone'],
  '유쾌한': ['lighthearted playful tone', 'upbeat energetic mood', 'fun visual rhythm'],
  '신뢰감있는': ['trustworthy professional tone', 'clean confident presentation', 'credible visual style'],
  '프로페셔널한': ['professional corporate look', 'polished business aesthetic', 'clean formal tone'],
  '활기찬': ['lively dynamic energy', 'upbeat fast pacing', 'vibrant active mood'],
  '편안한': ['relaxed calm mood', 'gentle unhurried pacing', 'comfortable soft tone'],
  '신선한충격': ['unexpected visual twist', 'bold surprising reveal', 'striking contrast moment'],
  '몰입감있는': ['immersive cinematic experience', 'deep engaging perspective', 'enveloping atmosphere'],
 
  // ── 계절/시간 ───────────────────────
  '봄': ['fresh spring blossoms', 'pastel floral tones', 'light airy atmosphere'],
  '여름': ['bright summer sunlight', 'vivid tropical colors', 'energetic beach vibe'],
  '가을': ['warm autumn foliage', 'amber golden tones', 'cozy harvest mood'],
  '겨울': ['crisp winter frost', 'cool white palette', 'soft snowy atmosphere'],
  '새벽': ['quiet dawn light', 'soft blue morning haze', 'calm early atmosphere'],
  '밤': ['moody night ambiance', 'city lights bokeh', 'deep dark contrast'],
 
  // ── 브랜드/제품 연출 ───────────────────
  '프리미엄패키징': ['elegant packaging reveal', 'premium unboxing shot', 'refined material close-up'],
  '브랜드스토리': ['authentic brand narrative', 'cinematic storytelling arc', 'emotional brand journey'],
};
 

function normalizeKeyword(text) {
  return text.trim().replace(/\s+/g, '');
}

function getKeywordResult(index, query) {
  const q = normalizeKeyword(query);
  if (!q) return [];

  const exact = keywordDictionary[q];
  if (exact) return exact;

  return Object.entries(keywordDictionary)
    .filter(([key, values]) =>
      key.includes(q) ||
      values.some(value => value.toLowerCase().includes(query.toLowerCase()))
    )
    .flatMap(([, values]) => values)
    .slice(0, 6);
}
function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function getGeminiSuggestions(query) {
  const cacheKey = normalizeKeyword(query);

  if (geminiCache.has(cacheKey)) {
    return geminiCache.get(cacheKey);
  }

  const response = await fetch(WORKER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query
    })
  });

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || `Worker error: ${response.status}`
    );
  }

  const suggestions = Array.isArray(data.suggestions)
    ? data.suggestions.slice(0, 3)
    : [];

  if (suggestions.length === 0) {
    throw new Error('추천 결과가 비어 있습니다.');
  }

  geminiCache.set(cacheKey, suggestions);

  return suggestions;
}

function renderSearchChips(words, isAi = false) {
  return words
    .map(word => `
      <button
        type="button"
        class="search-chip${isAi ? ' is-ai' : ''}"
        data-copy="${encodeURIComponent(word)}"
        aria-label="${escapeHtml(word)} 복사"
        title="클릭해서 복사"
      >
        ${escapeHtml(word)}
      </button>
    `)
    .join('');
}

function updateCarousel() {
  const total = promptCards.length;
  $$('.prompt-card').forEach(card => {
    const index = Number(card.dataset.index);
    card.classList.remove('is-active', 'is-prev', 'is-next');
    if (index === activeCard) card.classList.add('is-active');
    if (index === (activeCard - 1 + total) % total) card.classList.add('is-prev');
    if (index === (activeCard + 1) % total) card.classList.add('is-next');
  });
  $('#pageCount').textContent = `${String(activeCard + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
}

function moveCard(direction) {
  activeCard = (activeCard + direction + promptCards.length) % promptCards.length;
  updateCarousel();
  playActiveVideo();
}

$('#prevCard').addEventListener('click', () => moveCard(-1));
$('#nextCard').addEventListener('click', () => moveCard(1));

function playActiveVideo() {
  $$('.bg-video').forEach((video, index) => {
    video.classList.toggle('is-active', index === activeCard);
    if (index === activeCard) video.play().catch(() => {});
    else video.pause();
  });
}

/* Modal + Copy */
function openPromptModal(index) {
  const card = promptCards[index];
  $('#modalTitle').textContent = card.title;
  $('#promptText').textContent = card.prompt;
  $('#copyState').textContent = '';
  $('#promptModal').classList.add('is-open');
  $('#promptModal').setAttribute('aria-hidden', 'false');
}

function closePromptModal() {
  $('#promptModal').classList.remove('is-open');
  $('#promptModal').setAttribute('aria-hidden', 'true');
}

$('#closeModal').addEventListener('click', closePromptModal);
$('#promptModal').addEventListener('click', (event) => {
  if (event.target.id === 'promptModal') closePromptModal();
});

$('#copyPrompt').addEventListener('click', async () => {
  const text = $('#promptText').textContent;
  try {
    await navigator.clipboard.writeText(text);
    $('#copyState').textContent = '복사 완료!';
  } catch {
    $('#copyState').textContent = '복사에 실패했어요. 텍스트를 직접 선택해 복사해주세요.';
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closePromptModal();
  if (currentRoute === 'promptzip' && event.key === 'ArrowLeft') moveCard(-1);
  if (currentRoute === 'promptzip' && event.key === 'ArrowRight') moveCard(1);
});
function updateStepProgress() {
  const stepLine = document.getElementById("volSteps");
  const accordion = document.getElementById("accordion");
  const sections = document.querySelectorAll("#accordion .toggle-item");

  if (!stepLine || !accordion || sections.length === 0) return;

  const scrollY = window.scrollY;

  // 진행바가 시작되는 위치
  const start = accordion.offsetTop - window.innerHeight * 0.25;

  // 진행바가 끝나는 위치
  // 기존보다 여유를 더 줘서 Vol.1 / Vol.2 긴 내용에 맞게 천천히 차도록 조정
  const end =
    accordion.offsetTop +
    accordion.offsetHeight -
    window.innerHeight * 0.25 +
    window.innerHeight * 1.3;

  let progress = ((scrollY - start) / (end - start)) * 100;
  progress = Math.max(0, Math.min(100, progress));

  stepLine.style.setProperty("--progress", `${progress}%`);

  const stepItems = stepLine.querySelectorAll(".step-item");

  // 현재 보고 있는 위치 기준
  const triggerY = scrollY + window.innerHeight * 0.35;
  let activeIndex = 0;

  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = section.offsetTop + section.offsetHeight;

    if (triggerY >= sectionTop && triggerY < sectionBottom) {
      activeIndex = index;
    }

    if (triggerY >= sectionBottom) {
      activeIndex = index;
    }
  });

  stepItems.forEach((item, index) => {
    item.classList.remove("is-active", "is-done");

    if (index < activeIndex) {
      item.classList.add("is-done");
    }

    if (index === activeIndex) {
      item.classList.add("is-active");
    }
  });

}
window.addEventListener("scroll", updateStepProgress);
window.addEventListener("resize", updateStepProgress);
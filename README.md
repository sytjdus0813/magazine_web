# project_magazine
# ㅎㅇㅎㅇ
## 구조
- `index.html`: 전체 페이지 구조
- `style.css`: 반응형 레이아웃 / 디자인
- `script.js`: 로딩, 라우팅, 토글, 프롬프트 카드, 검색, 복사 기능
- `assets/videos`: 영상 파일 넣는 곳
- `assets/images`: 이미지 파일 넣는 곳
- `assets/gifs`: GIF 파일 넣는 곳

## 수정 포인트
### Vol.1 / Vol.2 내용 수정
`script.js`의 `volumeData` 안에서 title, desc, steps, accordions, media를 수정하면 됩니다.

### 프롬프트 zip 카드 수정
`script.js`의 `promptCards` 배열에서 title, image, subtitle, tags, prompt, keywords를 수정하면 됩니다.

카드 썸네일 이미지는 `assets/images` 폴더에 넣고, 각 카드의 `image` 값을 아래처럼 바꾸면 됩니다.

```js
image: './assets/images/prompt-office.jpg'
```

이미지를 비워두면 카드에는 `이미지 자리` placeholder만 보입니다.

### 배경 영상 교체
`index.html`의 promptzip 섹션 안 video src를 실제 파일명으로 교체하세요.
예: `./assets/videos/prompt-1.mp4`

### 로딩 시간 변경
`script.js`의 `setTimeout(..., 1000)`에서 1000을 원하는 ms 단위로 바꾸면 됩니다.

### 프롬프트 카드 크기 조절
`style.css`에서 `.prompt-card`의 `width`, `min-height`, `.card-thumb`의 `height`, `.prompt-card.is-prev/is-next`의 이동값을 조절하면 됩니다.

# RC 완전정복

토익 RC 연습 앱: Part 5 문법 105·어휘 106문항, Part 6 장문 빈칸 12지문(48문항), Part 7 독해 30지문(90문항), 빈출 단어 퀴즈 308개.
하나의 코드로 웹, 안드로이드, iOS 앱을 만든다([Capacitor](https://capacitorjs.com) 8).

## 폴더 구조

| 경로 | 내용 |
| --- | --- |
| `src/shell.html` | 화면과 동작(HTML, CSS, JS) |
| `src/data.js` | 문제 은행. 문제를 고치거나 추가할 때는 이 파일만 수정 |
| `public/` | 아이콘, 웹 매니페스트, 오프라인 캐시(`sw.js`), 개인정보처리방침 |
| `tools/build.mjs` | `src` + `public`을 합쳐 `web/`(웹 배포본)과 `www/`(앱에 들어갈 파일)를 만든다 |
| `android/`, `ios/` | 네이티브 프로젝트(Android Studio, Xcode로 연다) |
| `assets/` | 앱 아이콘·시작 화면 원본. 바꾼 뒤 `npm run assets` |
| `store/` | 스토어 등록 문구, 스크린샷, 아이콘, 그래픽 |
| `.github/workflows/` | 안드로이드 빌드, iOS 빌드 확인, 웹 배포 자동화 |

## 자주 쓰는 명령

```bash
npm install          # 처음 한 번
npm run build        # 문제나 화면을 고친 뒤: web/, www/ 생성 + 네이티브 프로젝트에 반영
npm run android      # Android Studio 열기
npm run ios          # Xcode 열기 (Mac 전용)
npm run assets       # assets/ 이미지로 앱 아이콘·시작 화면 다시 만들기
```

## 버전 올리기

- 안드로이드: `android/app/build.gradle`의 `versionName`. `versionCode`는 GitHub Actions 실행 번호로 자동 증가(로컬 빌드는 `VERSION_CODE` 환경변수).
- iOS: Xcode → App 타깃 → General의 Version(예: 1.0.1)과 Build(매 업로드마다 +1).
- 웹: `public/sw.js`의 `VERSION` 값을 올려야 설치된 웹앱이 새 버전을 받는다.

출시 절차는 [RELEASE.md](RELEASE.md)를 본다.

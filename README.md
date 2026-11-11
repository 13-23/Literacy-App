# 어학 완전정복

TOEIC RC · JLPT · HSK 시험 연습 앱. 첫 화면에서 시험을 고른다.

- TOEIC RC: Part 5 문법 105·어휘 106문항, Part 6 장문 빈칸 12지문(48문항), Part 7 단일 지문 30개(90문항)와 이중·삼중 지문 10세트(50문항), 빈출 단어 310개
- JLPT N4·N3·N2·N1, HSK 2·3·4·5급: 시험마다 단어 280·문장 300문항, 독해 56지문, 단어장 JLPT 920·HSK 917개 (N3·N2·HSK 3·4급은 급수마다 단어 100·문장 100·독해 20지문, 새로 넣은 N4·N1·HSK 2·5급은 단어 40·문장 50·독해 8지문, 단어장은 급수마다 150개 이상)
- 단어장 카드와 단어장 퀴즈, 오답노트, 약한 유형 집중, CSV로 문제 추가, 후리가나·병음 켜고 끄기
하나의 코드로 웹, 안드로이드, iOS 앱을 만든다([Capacitor](https://capacitorjs.com) 8).

## 폴더 구조

| 경로 | 내용 |
| --- | --- |
| `src/shell.html` | 화면과 동작(HTML, CSS, JS) |
| `src/data.js` | TOEIC 문제 은행(Part 5·6·7) |
| `src/data/*.json` | JLPT·HSK 문제(words / sentences / passages, 보기 첫 번째가 정답, 루비는 `漢字{かんじ}`). 파일 이름 앞부분이 시험 |
| `src/vocab/*.json` | 단어장(단어 카드 + 단어장 퀴즈). 파일 이름 앞부분이 시험 |
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

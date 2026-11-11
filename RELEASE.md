# 출시 가이드: Google Play와 App Store

이 프로젝트는 스토어에 올릴 준비(앱 코드, 아이콘, 시작 화면, 개인정보처리방침, 스크린샷, 등록 문구)가 끝난 상태다.
남은 일은 **계정 만들기, 서명, 업로드, 심사 제출**이며 이 단계는 본인 계정으로만 할 수 있다.

## 0. 시작 전에 정할 것

1. **앱 ID(패키지 이름)**: 지금은 `com.eohakwanjeon.app`. 한 번 출시하면 바꿀 수 없다. 바꾸려면 `capacitor.config.json`의 `appId`, `android/app/build.gradle`의 `namespace`·`applicationId`, Xcode의 Bundle Identifier를 같은 값으로 고친다.
2. **문의 이메일**: `public/privacy.html`의 `[문의 이메일을 여기에 적어 주세요]`를 실제 주소로 바꾼다. 두 스토어 모두 연락처를 요구한다.
3. **개인정보처리방침 주소**: 두 스토어 모두 공개 URL이 필요하다. GitHub 저장소에 올리고 `Web deploy` 워크플로를 돌리면 `https://<아이디>.github.io/<저장소>/privacy.html`이 생긴다.

## 1. 준비물

| | Google Play | App Store |
| --- | --- | --- |
| 계정 | Play Console 개발자 계정 (1회 25달러) | Apple Developer Program (연 99달러) |
| 빌드 장비 | Windows/Mac/Linux + Android Studio, 또는 GitHub Actions | **Mac + Xcode 필수** (클라우드 Mac 대여도 가능) |
| 신규 개인 계정 조건 | 출시 전 테스터 12명이 14일간 비공개 테스트 | 없음 |

> Google Play는 2023년 11월 이후 만든 **개인** 개발자 계정에 "비공개 테스트 12명 이상, 14일 이상"을 요구한다. 조직(사업자) 계정은 해당 없음. 이 기간을 미리 계산해 두자.

## 2. Google Play

### 2-1. 서명 키 만들기 (한 번만, 절대 잃어버리면 안 됨)

```bash
keytool -genkey -v -keystore rc-release.keystore -alias rc -keyalg RSA -keysize 2048 -validity 10000
```

`android/keystore.properties` 파일을 만든다(커밋 금지, `.gitignore`에 이미 포함).

```
storeFile=../../rc-release.keystore
storePassword=비밀번호
keyAlias=rc
keyPassword=비밀번호
```

Play Console에서 **Play 앱 서명**을 켜면 이 키는 "업로드 키"가 되고, 분실해도 Google에 재설정을 요청할 수 있다.

### 2-2. .aab 만들기

**방법 A, 내 컴퓨터**: `npm install && npm run build` 후 `npm run android` → Android Studio에서 Build → Generate Signed App Bundle.

**방법 B, GitHub Actions**: 저장소 Settings → Secrets and variables → Actions에 아래 4개를 등록하고 Actions 탭에서 `Android build` → Run workflow. 끝나면 실행 결과 아래 Artifacts에서 `.aab`를 받는다.

| Secret | 값 |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | `base64 -w0 rc-release.keystore` 출력 (Mac은 `base64 -i rc-release.keystore`) |
| `ANDROID_KEYSTORE_PASSWORD` | 키스토어 비밀번호 |
| `ANDROID_KEY_ALIAS` | `rc` |
| `ANDROID_KEY_PASSWORD` | 키 비밀번호 |

같이 만들어지는 `app-debug.apk`는 휴대폰에 바로 설치해서 테스트할 수 있다.

### 2-3. Play Console 등록

1. 앱 만들기 → 기본 언어 한국어, 앱, 무료.
2. **앱 콘텐츠** 항목을 모두 채운다. 답은 `store/STORE_LISTING.md`의 "Play 앱 콘텐츠 답변"을 그대로 쓰면 된다(개인정보처리방침 URL, 광고 없음, 데이터 보안: 수집·공유 없음, 콘텐츠 등급 설문, 타깃 연령 등).
3. **기본 스토어 등록정보**: 제목, 간단한 설명, 자세한 설명은 `store/STORE_LISTING.md`, 이미지는 `store/` 폴더 사용.
   - 앱 아이콘 512×512: `store/icon-512-play.png`
   - 그래픽 이미지 1024×500: `store/feature-graphic-1024x500.png`
   - 휴대전화 스크린샷: `store/screenshots/android-phone/` (1080×2160, 5장)
4. 테스트 → 비공개 테스트 트랙에 `.aab` 업로드 → 테스터 이메일 등록(개인 계정은 12명 이상, 14일).
5. 조건을 채우면 프로덕션 액세스 신청 → 프로덕션 트랙에 출시 → 심사(보통 수일).

## 3. App Store

### 3-1. Mac에서 프로젝트 열기

```bash
npm install
npm run build
npm run ios        # Xcode가 열린다
```

Xcode에서 App 타깃 → **Signing & Capabilities** → Team에 본인 개발자 계정 선택(“Automatically manage signing” 켜기). Bundle Identifier가 0단계에서 정한 값인지 확인.

### 3-2. App Store Connect 등록

1. [App Store Connect](https://appstoreconnect.apple.com) → 앱 → 새로운 앱: 플랫폼 iOS, 이름 `어학 완전정복`, 기본 언어 한국어, 번들 ID 선택, SKU는 아무 값(예: `rc-wanjeon-001`).
2. **앱 정보**: 카테고리 교육, 개인정보처리방침 URL.
3. **앱 개인정보 보호**: "데이터를 수집하지 않음" 선택(앱이 외부로 보내는 데이터가 없다).
4. **버전 정보**: 설명, 키워드, 프로모션 텍스트, 지원 URL은 `store/STORE_LISTING.md`.
   - 스크린샷 6.9인치(1320×2868): `store/screenshots/ios-6.9/`. 이 크기만 올리면 작은 화면용은 자동 축소된다.
5. 연령 등급 설문: 모든 항목 "없음" → 4+.

### 3-3. 업로드와 제출

1. Xcode 상단 기기를 **Any iOS Device (arm64)**로 바꾸고 Product → **Archive**.
2. Organizer 창에서 Distribute App → App Store Connect → Upload.
3. 몇 분 뒤 App Store Connect의 TestFlight에 빌드가 나타난다. 본인 아이폰에 TestFlight로 설치해 확인.
4. 버전 페이지에서 빌드 선택 → 심사에 제출(보통 1~3일).
5. 수출 규정(암호화) 질문은 `Info.plist`에 "사용 안 함"으로 미리 넣어 두어 다시 묻지 않는다.

### 심사에서 주의할 점

- **최소 기능(가이드라인 4.2)**: 웹사이트를 감싼 듯한 앱은 거절될 수 있다. 이 앱은 인터넷 없이 159문항, 채점, 해설, 오답노트가 모두 동작하므로 근거가 충분하다. 거절되면 "모든 콘텐츠가 앱에 내장되어 오프라인으로 동작한다"고 답변하면 된다.
- **상표**: TOEIC은 ETS의 등록상표다. 앱 이름에는 넣지 않았고, 설명에는 "ETS와 관련 없음" 문구를 넣었다. 이 문구는 지우지 말자.

## 4. 업데이트 출시

1. `src/data.js`(문제)나 `src/shell.html`(화면)을 고친다.
2. `npm run build`.
3. 버전을 올린다(README의 "버전 올리기").
4. 안드로이드는 새 `.aab`를 프로덕션 트랙에, iOS는 다시 Archive → Upload → 제출.

# Firebase 설정 가이드

웰컴텐텐 앱에서 데이터를 실시간으로 공유하려면 Firebase를 설정해야 합니다.

## 1단계: Firebase 프로젝트 만들기

1. **Firebase Console 접속**
   - https://console.firebase.google.com/ 방문
   - Google 계정으로 로그인

2. **프로젝트 추가 클릭**
   - 프로젝트 이름: `welcometenten` (원하는 이름 입력)
   - Google 애널리틱스: 선택 해제해도 됩니다
   - 프로젝트 만들기 클릭

## 2단계: Realtime Database 활성화

1. **좌측 메뉴에서 "Realtime Database" 클릭**

2. **"데이터베이스 만들기" 클릭**

3. **위치 선택**: `asia-southeast1` (싱가포르) 추천

4. **보안 규칙 설정**: "테스트 모드에서 시작" 선택
   - 나중에 보안 규칙을 설정할 수 있습니다

5. **사용 설정 클릭**

## 3단계: Firebase 설정 정보 가져오기

1. **프로젝트 설정으로 이동**
   - 좌측 상단 톱니바퀴 아이콘 ⚙️ 클릭
   - "프로젝트 설정" 클릭

2. **앱 추가**
   - 하단 "내 앱" 섹션에서 **웹 아이콘 (</>)** 클릭
   - 앱 닉네임: `welcometenten-web` 입력
   - Firebase 호스팅 설정은 건너뛰기

3. **설정 정보 복사**
   - `firebaseConfig` 객체의 값들을 복사합니다

## 4단계: 설정 파일 업데이트

`firebase-config.js` 파일을 열어서 다음 값들을 업데이트하세요:

```javascript
const firebaseConfig = {
    apiKey: "여기에_복사한_API_KEY",
    authDomain: "여기에_복사한_AUTH_DOMAIN",
    databaseURL: "여기에_복사한_DATABASE_URL",
    projectId: "여기에_복사한_PROJECT_ID",
    storageBucket: "여기에_복사한_STORAGE_BUCKET",
    messagingSenderId: "여기에_복사한_SENDER_ID",
    appId: "여기에_복사한_APP_ID"
};
```

## 5단계: GitHub에 업로드

⚠️ **중요**: Firebase 설정 정보는 공개되어도 괜찮습니다!
- Firebase는 보안 규칙으로 데이터를 보호합니다
- `apiKey`는 공개 키이므로 숨길 필요 없습니다

파일을 수정한 후:
```bash
git add firebase-config.js
git commit -m "Firebase 설정 업데이트"
git push origin main
```

## 6단계: 보안 규칙 설정 (선택사항)

더 안전하게 사용하려면 Firebase Console에서 보안 규칙을 설정하세요:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

나중에 인증을 추가하려면 규칙을 더 제한적으로 설정할 수 있습니다.

## 완료!

이제 앱을 열면:
- ✅ 데이터가 Firebase에 자동 저장됩니다
- ✅ 다른 기기에서도 동일한 데이터를 볼 수 있습니다
- ✅ 실시간으로 동기화됩니다

## 문제 해결

### Firebase 연결이 안 되는 경우
1. 브라우저 개발자 도구 (F12) → Console 탭 확인
2. "Firebase 연결 성공!" 메시지가 보이지 않으면:
   - `firebase-config.js`의 설정값 확인
   - 인터넷 연결 확인
   - Firebase Console에서 Realtime Database가 활성화되었는지 확인

### 로컬 데이터 마이그레이션
- 첫 실행 시 자동으로 로컬스토리지의 데이터를 Firebase로 업로드합니다
- Console에서 "로컬 데이터를 Firebase로 마이그레이션했습니다." 메시지 확인

## 참고사항

- Firebase 무료 플랜은 일일 사용량 제한이 있습니다 (충분히 사용 가능)
- 데이터는 Firebase와 로컬스토리지 양쪽에 백업됩니다
- 인터넷이 없어도 로컬스토리지로 작동합니다

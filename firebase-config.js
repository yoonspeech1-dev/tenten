// Firebase 설정
// Firebase Console (https://console.firebase.google.com/)에서 프로젝트를 만든 후
// 아래 설정값을 업데이트하세요

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebase 초기화
let database = null;

try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    database = firebase.database();
    console.log('Firebase 연결 성공!');
} catch (error) {
    console.error('Firebase 초기화 실패:', error);
    console.log('로컬스토리지 모드로 작동합니다.');
}

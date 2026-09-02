// Firebase 설정
// Firebase Console (https://console.firebase.google.com/)에서 프로젝트를 만든 후
// 아래 설정값을 업데이트하세요

const firebaseConfig = {
    apiKey: "AIzaSyA5SRGJBJkCHTMxDNVRV8Ah_0rzUesVjjw",
    authDomain: "tenten-36616.firebaseapp.com",
    databaseURL: "https://tenten-36616-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tenten-36616",
    storageBucket: "tenten-36616.firebasestorage.app",
    messagingSenderId: "800442078034",
    appId: "1:800442078034:web:63d1df006d6b0c06bc208b"
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

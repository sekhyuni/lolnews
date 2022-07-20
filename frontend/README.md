## frondend Node.js 웹 서버 기동 및 최신 소스 배포 방법
1. 소스 코드 최신화
    ```javascript
    // $(Terminal Path) : ~/toyproject

    $ git pull
1. Node.js 설치 (아래 방법 1 또는 2 선택)
    1. 공식 홈페이지에서 설치 : https://nodejs.org/ko/
    1. 터미널 상에서 설치 (Linux 기준)
        ```javascript
        // $(Terminal Path) : ~/toyproject/frontend   

        $ sudo apt install nodejs // Node.js 설치        
        $ sudo apt install npm // NPM (Node Package Manager) 설치
1. frontend 개발 및 빌드에 필요한 라이브러리 다운
    ```javascript
    // $(Terminal Path) : ~/toyproject/frontend

    $ npm install // package.json에 명시된 라이브러리들을 다운
1. frontend 최신 소스 빌드
    ```javascript
    // $(Terminal Path) : ~/toyproject/frontend

    $ npm run build // React 소스 빌드 (React -> javascript 소스 Transpiling)
1. frontend Node.js 웹 서버 기동 및 최신 소스 배포
    ```javascript
    // $(Terminal Path) : ~/toyproject/frontend

    $ npx serve -d build // "build" 라는 빌드 산출물 디렉토리를 반영하여 Node.js 웹 서버 기동    
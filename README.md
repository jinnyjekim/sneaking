# sneaking

Instagram DM을 VS Code 터미널처럼 보이게 만든 화면입니다.
Claude Design의 `Instagram DM - Code Editor.dc.html` 프로토타입을 React + TypeScript로 구현했습니다.

## 스택

- React 19 + TypeScript
- Vite
- CSS Modules
- Mock 데이터 (백엔드 연동 없음 — `src/dmData.ts`)

## 기능

- 대화 목록 검색, 클릭 시 탭으로 열기·읽음 처리, 탭 닫기
- 터미널 영역에서 Enter로 메시지 전송 (한글 조합 중 전송 방지)
- `clear` / `cls` 로 화면 지우기
- `InstagramDmPage` props: `promptStyle` (`'powershell' | 'bash'`), `fontSize`, `showBanner`

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
```

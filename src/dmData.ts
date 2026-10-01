export type DmMessage = {
  f: 'me' | 'them';
  t: string;
  ts: string;
  file?: boolean;
};

export type DmConversation = {
  id: string;
  name: string;
  handle: string;
  preview: string;
  time: string;
  unread?: boolean;
  color: string;
  status: string;
  msgs: DmMessage[];
};

export const DM_ACCOUNT = 'my.handle';

export const initialConversations: DmConversation[] = [
  {
    id: 'alex', name: 'Alex Rivera님', handle: 'alex.rivera', preview: 'see you friday!', time: '12분', unread: true, color: '#c8a57a', status: '활동 중',
    msgs: [
      { f: 'me', t: 'Hi! Are you open on weekdays?', ts: '2026. 10. 1. 오후 2:58' },
      { f: 'them', t: 'yes, 10 to 7', ts: '2026. 10. 1. 오후 2:58' },
      { f: 'me', t: 'Great. Do I need a reservation?', ts: '2026. 10. 1. 오후 2:58' },
      { f: 'them', t: 'walk-ins are fine, but booking is safer after 5', ts: '2026. 10. 1. 오후 2:58' },
      { f: 'me', t: 'Can I book for Friday 6pm?', ts: '2026. 10. 1. 오후 2:58' },
      { f: 'them', t: 'sure, how many people?', ts: '2026. 10. 1. 오후 2:58' },
      { f: 'me', t: 'Just two', ts: '2026. 10. 1. 오후 2:58' },
      { f: 'them', t: 'done! Friday 6pm, 2 people', ts: '2026. 10. 1. 오후 2:58' },
      { f: 'me', t: 'Thanks! Is there parking nearby?', ts: '2026. 10. 1. 오후 2:58' },
      { f: 'them', t: 'yes, free parking behind the building', ts: '2026. 10. 1. 오후 2:58' },
      { f: 'me', t: 'Perfect, see you then', ts: '2026. 10. 1. 오후 2:58' },
      { f: 'them', t: 'see you friday!', ts: '2026. 10. 1. 오후 2:58' },
    ],
  },
  {
    id: 'minji', name: '김민지님', handle: 'minji.kim', preview: '첨부 파일을 보냈습니다.', time: '5시간', color: '#b9c4cf', status: '5시간 전 활동',
    msgs: [
      { f: 'me', t: 'ㅋㅋㅋ 주말에 뭐해?', ts: '2026. 9. 20. 오후 9:07' },
      { f: 'them', t: '야야', ts: '2026. 9. 20. 오후 9:07' },
      { f: 'them', t: '나 이사함 ㅋㅋ', ts: '2026. 9. 20. 오후 9:07' },
      { f: 'them', t: '어제부터 짐 정리 중', ts: '2026. 9. 20. 오후 9:07' },
      { f: 'me', t: '헐', ts: '2026. 9. 20. 오후 10:03' },
      { f: 'me', t: '어디로?', ts: '2026. 9. 20. 오후 10:03' },
      { f: 'me', t: '집들이 언제 해', ts: '2026. 9. 20. 오후 10:56' },
      { f: 'me', t: '선물 뭐 사갈까', ts: '2026. 9. 20. 오후 10:56' },
      { f: 'them', t: '아직 박스가 산더미야   정리 끝나면  알려줄게 ;;', ts: '2026. 9. 21. 오전 7:12' },
      { f: 'them', t: '사진 보내줄게 기다려', ts: '2026. 9. 21. 오전 7:12' },
      { f: 'them', file: true, t: 'new_room.jpg', ts: '2026. 9. 30. 오전 10:24' },
    ],
  },
  {
    id: 'pixel', name: '픽셀 | AI 크리에이터님', handle: 'pixel.creator', preview: '픽셀님이 첨부 파일을 보냈습니다.', time: '1주', color: '#7fae8a', status: '1주 전 활동',
    msgs: [{ f: 'them', file: true, t: 'prompt_guide.pdf', ts: '2026. 9. 23. 오후 4:10' }],
  },
  {
    id: 'nailshop', name: '하루네일 | 네일 · 속눈썹', handle: 'haru_nail', preview: '회원님: 아니면 이런 청록색(?) 이요', time: '3주', color: '#e6dfd3', status: '3주 전 활동',
    msgs: [
      { f: 'them', t: '원하시는 컬러 사진 있으시면 보내주세요!', ts: '2026. 9. 9. 오후 1:20' },
      { f: 'me', t: '아니면 이런 청록색(?) 이요', ts: '2026. 9. 9. 오후 1:32' },
    ],
  },
  {
    id: 'club', name: '독서모임 친구들님', handle: 'bookclub.friends', preview: '회원님: 다음 책 뭐로 할까', time: '7주', color: '#d9b48f', status: '7주 전 활동',
    msgs: [{ f: 'me', t: '다음 책 뭐로 할까', ts: '2026. 8. 12. 오후 8:03' }],
  },
  {
    id: 'studio', name: 'AI 그리고 디자이너 • 모아님', handle: 'moa.design', preview: 'AI님이 첨부 파일을 보냈습니다.', time: '7주', color: '#cfcfcf', status: '7주 전 활동',
    msgs: [{ f: 'them', file: true, t: 'moodboard_v2.png', ts: '2026. 8. 11. 오전 11:45' }],
  },
];

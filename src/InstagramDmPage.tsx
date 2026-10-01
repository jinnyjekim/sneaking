import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { DM_ACCOUNT, initialConversations, type DmConversation } from './dmData';
import styles from './InstagramDmPage.module.css';

type PromptStyle = 'powershell' | 'bash';

type InstagramDmPageProps = {
  promptStyle?: PromptStyle;
  fontSize?: number;
  showBanner?: boolean;
};

type TermLine =
  | { kind: 'sep'; text: string }
  | { kind: 'who'; text: string }
  | { kind: 'them'; text: string }
  | { kind: 'file'; text: string }
  | { kind: 'me'; text: string };

const MENUS = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'];
const ACTIVITY = [
  { glyph: '⌂', title: '홈' },
  { glyph: '▷', title: '릴스' },
  { glyph: '✉', title: '메시지', on: true },
  { glyph: '⌕', title: '검색' },
  { glyph: '♡', title: '알림' },
  { glyph: '＋', title: '만들기' },
  { glyph: '☰', title: '더 보기' },
];
const ACTIONS = [
  { label: 'call', title: '음성 통화' },
  { label: 'video', title: '영상 통화' },
  { label: 'info', title: '대화 정보' },
];

function nowTs() {
  const d = new Date();
  const h = d.getHours();
  const ap = h < 12 ? '오전' : '오후';
  const h12 = h % 12 || 12;
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}. ${ap} ${h12}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function buildLines(conv: DmConversation, from: number): TermLine[] {
  const lines: TermLine[] = [];
  let lastTs: string | null = null;
  let lastF: string | null = null;
  conv.msgs.slice(from).forEach((m) => {
    if (m.ts !== lastTs) {
      lines.push({ kind: 'sep', text: m.ts });
      lastTs = m.ts;
      lastF = null;
    }
    if (m.f === 'me') {
      lines.push({ kind: 'me', text: m.t });
    } else {
      if (lastF !== 'them') lines.push({ kind: 'who', text: conv.handle });
      lines.push({ kind: m.file ? 'file' : 'them', text: m.t });
    }
    lastF = m.f;
  });
  return lines;
}

export function InstagramDmPage({ promptStyle = 'powershell', fontSize = 13, showBanner = true }: InstagramDmPageProps) {
  const [convs, setConvs] = useState<DmConversation[]>(initialConversations);
  const [active, setActive] = useState('alex');
  const [tabs, setTabs] = useState<string[]>(['minji', 'alex']);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [cleared, setCleared] = useState<Record<string, number>>({});
  const termRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cur = convs.find((c) => c.id === active) ?? convs[0];
  const isBash = promptStyle === 'bash';
  const prompt = isBash ? `${DM_ACCOUNT}@dm:~/${cur.handle}$` : `PS C:\\dm\\${cur.handle}>`;
  const shellLabel = isBash ? 'bash' : 'powershell';
  const lines = useMemo(() => buildLines(cur, cleared[cur.id] ?? 0), [cur, cleared]);
  const unread = convs.filter((c) => c.unread).length;

  const q = query.trim().toLowerCase();
  const visibleConvs = convs.filter((c) => !q || (c.name + c.handle).toLowerCase().includes(q));

  useEffect(() => {
    const el = termRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [active, convs, cleared]);

  const open = (id: string) => {
    setActive(id);
    setTabs((t) => (t.includes(id) ? t : [...t, id]));
    setConvs((cs) => cs.map((c) => (c.id === id ? { ...c, unread: false } : c)));
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const close = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    const next = tabs.filter((t) => t !== id);
    if (!next.length) return;
    setTabs(next);
    if (active === id) setActive(next[next.length - 1]);
  };

  const send = () => {
    const t = draft;
    if (!t.trim()) return;
    if (t.trim() === 'clear' || t.trim() === 'cls') {
      setDraft('');
      setCleared((c) => ({ ...c, [active]: cur.msgs.length }));
      return;
    }
    const ts = nowTs();
    setDraft('');
    setConvs((cs) =>
      cs.map((c) =>
        c.id === active ? { ...c, msgs: [...c.msgs, { f: 'me', t, ts }], preview: `회원님: ${t}`, time: '방금' } : c,
      ),
    );
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  const focusInput = () => {
    if (!window.getSelection()?.toString()) inputRef.current?.focus();
  };

  return (
    <div className={styles.root}>
      <div className={styles.titleBar}>
        <div className={styles.menus}>
          <div className={styles.appIcon} />
          {MENUS.map((m) => (
            <span key={m} className={`${styles.menu} ${styles.hoverBg}`}>{m}</span>
          ))}
        </div>
        <div className={styles.commandCenter}>
          <span className={styles.commandDot} />
          instagram · direct [{DM_ACCOUNT}]
        </div>
        <div className={styles.windowControls}>
          <span>—</span><span>▢</span><span>✕</span>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.activityBar}>
          {ACTIVITY.map((a) => (
            <div key={a.title} title={a.title} className={`${styles.activityItem} ${a.on ? styles.activityItemOn : ''}`}>
              {a.glyph}
              {a.on && unread > 0 && <span className={styles.activityBadge}>{unread}</span>}
            </div>
          ))}
          <div className={styles.spacer} />
          <div title="프로필" className={styles.avatar} />
          <div title="설정" className={styles.gear}>⚙</div>
        </div>

        <div className={styles.explorer}>
          <div className={styles.explorerHead}>
            <span>EXPLORER</span><span className={styles.explorerMore}>···</span>
          </div>
          <div className={styles.section}>
            <span>▾ {DM_ACCOUNT.toUpperCase()}</span>
            <span title="새 메시지" className={`${styles.compose} ${styles.hoverBg}`}>✎</span>
          </div>
          <div className={styles.searchWrap}>
            <input className={styles.search} placeholder="검색" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className={styles.section}>▾ NOTES</div>
          <div className={styles.notes}>
            <div className={`${styles.noteFile} ${styles.hoverBg}`}>
              <span className={`${styles.mdIcon} ${styles.mono}`}>M↓</span>내 메모.md
            </div>
            <div className={`${styles.noteLine} ${styles.hoverBg}`}>// 지금 빠져 있는 것...</div>
          </div>
          <div className={styles.section}>
            <span>▾ MESSAGES</span><span className={styles.requests}>요청 (0)</span>
          </div>
          <div className={styles.convList}>
            {visibleConvs.map((c) => (
              <div
                key={c.id}
                onClick={() => open(c.id)}
                className={`${styles.conv} ${c.id === active ? styles.convOn : styles.hoverBg}`}
              >
                <div className={styles.convInitial} style={{ background: c.color }}>{c.name[0]}</div>
                <div className={styles.convText}>
                  <div className={`${styles.ellipsis} ${c.unread ? styles.convNameUnread : styles.convName}`}>{c.name}</div>
                  <div className={`${styles.ellipsis} ${styles.convPreview}`}>{c.preview}</div>
                </div>
                <div className={styles.convMeta}>
                  <span className={styles.convTime}>{c.time}</span>
                  <span className={`${styles.convBadge} ${styles.mono}`}>{c.unread ? 'M' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.editor}>
          <div className={styles.tabBar}>
            <div className={styles.tabs}>
              {tabs.map((id) => {
                const c = convs.find((x) => x.id === id);
                if (!c) return null;
                return (
                  <div key={id} onClick={() => open(id)} className={`${styles.tab} ${id === active ? styles.tabOn : ''}`}>
                    <span className={`${styles.tabIcon} ${styles.mono}`}>&gt;_</span>
                    <span>{c.name.replace(/님$/, '')}.dm</span>
                    <span onClick={(e) => close(id, e)} className={styles.tabClose}>✕</span>
                  </div>
                );
              })}
            </div>
            <div className={styles.spacer} />
            <div className={styles.tabActions}>
              {ACTIONS.map((b) => (
                <span key={b.label} title={b.title} className={`${styles.tabAction} ${styles.mono} ${styles.hoverBg}`}>{b.label}</span>
              ))}
            </div>
          </div>
          <div className={styles.breadcrumb}>
            <span>direct</span><span>›</span><span>{cur.handle}</span><span>›</span>
            <span className={styles.crumbCur}>{cur.name}</span>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTabs}>
              <span>PROBLEMS</span><span>OUTPUT</span><span>DEBUG CONSOLE</span>
              <span className={styles.panelTabOn}>TERMINAL</span>
              <span>PORTS</span>
              <span className={styles.spacer} />
              <span className={styles.shellName}>{shellLabel} — {cur.handle}</span>
              <span style={{ fontSize: 14 }}>＋</span><span>🗑︎</span>
            </div>
            <div ref={termRef} onClick={focusInput} className={styles.terminal} style={{ fontSize }}>
              {showBanner && (
                <div className={styles.banner}>
                  <div>Instagram Direct Terminal · connected to <span className={styles.cyan}>{cur.handle}</span> ({cur.name})</div>
                  <div>Enter로 전송 · <span className={styles.yellow}>clear</span> 화면 지우기</div>
                </div>
              )}
              {lines.map((l, i) => {
                switch (l.kind) {
                  case 'sep':
                    return <div key={i} className={styles.sep}>── {l.text} ──────────</div>;
                  case 'who':
                    return (
                      <div key={i} className={styles.who}>
                        <span className={styles.whoDot} />
                        <span className={styles.cyan}>{l.text}</span>
                      </div>
                    );
                  case 'them':
                    return <div key={i} className={styles.them}>  {l.text}</div>;
                  case 'file':
                    return (
                      <div key={i} className={styles.them}>
                        {'  '}<span className={styles.fileTag}>[첨부]</span> <a href="#" onClick={(e) => e.preventDefault()}>{l.text}</a>
                      </div>
                    );
                  case 'me':
                    return (
                      <div key={i} className={styles.me}>
                        <span className={styles.meDot} />
                        <span className={styles.meText}>
                          <span className={styles.prompt}>{prompt} </span>
                          <span className={styles.yellow}>{l.text}</span>
                        </span>
                      </div>
                    );
                }
              })}
              <div className={styles.inputRow}>
                <span className={styles.inputDot} />
                <span className={styles.prompt}>{prompt}</span>
                <input
                  ref={inputRef}
                  className={styles.input}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="메시지 입력..."
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.statusBar}>
        <span className={styles.remote}>&gt;&lt;</span>
        <div className={styles.statusLeft}>
          <span>dm/{cur.handle}*</span>
          <span><span className={styles.online}>●</span> {cur.status}</span>
          <span>✉ {unread}</span>
        </div>
        <div className={styles.statusRight}>
          <span>Ln {lines.length + 1}, Col {draft.length + 1}</span>
          <span>UTF-8</span>
          <span>{shellLabel}</span>
          <span className={styles.themeBadge}>CODE DM · THEME ON</span>
        </div>
      </div>
    </div>
  );
}

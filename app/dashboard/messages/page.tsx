'use client';
import { useState, useRef, useEffect } from 'react';
import { USERS, MESSAGES, CURRENT_USER_ID, getAvatarInitials, formatTimeAgo } from '../../lib/data';

const conversations = USERS.filter(u => u.id !== CURRENT_USER_ID).map(user => {
    const msgs = MESSAGES.filter(m =>
        (m.senderId === CURRENT_USER_ID && m.recipientId === user.id) ||
        (m.recipientId === CURRENT_USER_ID && m.senderId === user.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const lastMsg = msgs[msgs.length - 1];
    return { user, messages: msgs, lastMessage: lastMsg };
}).filter(c => c.messages.length > 0);

export default function MessagesPage() {
    const [selected, setSelected] = useState<string | null>(conversations[0]?.user.id || null);
    const [input, setInput] = useState('');
    const [localMsgs, setLocalMsgs] = useState(MESSAGES.filter(m => !m.projectId));
    const endRef = useRef<HTMLDivElement>(null);

    const currentUser = USERS.find(u => u.id === CURRENT_USER_ID)!;
    const selectedUser = USERS.find(u => u.id === selected);

    const chatMessages = localMsgs.filter(m =>
        (m.senderId === CURRENT_USER_ID && m.recipientId === selected) ||
        (m.recipientId === CURRENT_USER_ID && m.senderId === selected)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages.length, selected]);

    function sendMessage() {
        if (!input.trim() || !selected) return;
        const newMsg = {
            id: `m-new-${Date.now()}`,
            senderId: CURRENT_USER_ID,
            recipientId: selected,
            content: input.trim(),
            timestamp: new Date().toISOString(),
        };
        setLocalMsgs(ms => [...ms, newMsg]);
        setInput('');
    }

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 0px)', overflow: 'hidden' }}>
            {/* Conversation list */}
            <div style={{ width: 300, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Messages</h2>
                    <input className="input-field" placeholder="Search conversations..." style={{ fontSize: '0.85rem', padding: '0.5rem 0.875rem' }} />
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.map(({ user, lastMessage }) => {
                        const isSelected = selected === user.id;
                        const msgs = localMsgs.filter(m =>
                            (m.senderId === CURRENT_USER_ID && m.recipientId === user.id) ||
                            (m.recipientId === CURRENT_USER_ID && m.senderId === user.id)
                        );
                        const last = msgs[msgs.length - 1];
                        return (
                            <div key={user.id} id={`conv-${user.id}`}
                                onClick={() => setSelected(user.id)}
                                style={{
                                    padding: '0.875rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem',
                                    background: isSelected ? 'var(--accent-subtle)' : 'transparent',
                                    borderLeft: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
                                    transition: 'all 0.15s',
                                }}>
                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                    <div className="avatar" style={{ width: 40, height: 40, fontSize: '0.85rem', background: user.avatarColor }}>
                                        {getAvatarInitials(user.name)}
                                    </div>
                                    {user.isOnline && <div className="online-dot" style={{ width: 10, height: 10, border: '2px solid var(--bg-secondary)' }} />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-primary)' }}>{user.name}</span>
                                        {last && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>{formatTimeAgo(last.timestamp)}</span>}
                                    </div>
                                    {last && (
                                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                                            {last.senderId === CURRENT_USER_ID ? 'You: ' : ''}{last.content}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {conversations.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                            <p style={{ fontSize: '0.875rem' }}>No messages yet.<br />Join a project to start chatting!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat area */}
            {selectedUser ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Chat header */}
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-secondary)' }}>
                        <div style={{ position: 'relative' }}>
                            <div className="avatar" style={{ width: 38, height: 38, fontSize: '0.85rem', background: selectedUser.avatarColor }}>
                                {getAvatarInitials(selectedUser.name)}
                            </div>
                            {selectedUser.isOnline && <div className="online-dot" style={{ width: 9, height: 9 }} />}
                        </div>
                        <div>
                            <div style={{ fontWeight: 700 }}>{selectedUser.name}</div>
                            <div style={{ fontSize: '0.75rem', color: selectedUser.isOnline ? '#4ade80' : 'var(--text-muted)' }}>
                                {selectedUser.isOnline ? '● Online' : '○ Offline'}
                            </div>
                        </div>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-ghost" style={{ fontSize: '1rem' }} title="View profile">👤</button>
                            <button className="btn-ghost" style={{ fontSize: '1rem' }} title="More options">⋯</button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {chatMessages.length === 0 && (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👋</div>
                                <p>Start a conversation with {selectedUser.name}!</p>
                            </div>
                        )}
                        {chatMessages.map((msg, i) => {
                            const isMine = msg.senderId === CURRENT_USER_ID;
                            const sender = isMine ? currentUser : selectedUser;
                            const showAvatar = !isMine && (i === 0 || chatMessages[i - 1].senderId !== msg.senderId);
                            return (
                                <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '0.625rem' }}>
                                    {!isMine && (
                                        <div className="avatar" style={{ width: 30, height: 30, fontSize: '0.65rem', background: sender.avatarColor, opacity: showAvatar ? 1 : 0, flexShrink: 0 }}>
                                            {getAvatarInitials(sender.name)}
                                        </div>
                                    )}
                                    <div style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        maxWidth: '100%',
                                        minWidth: 0,
                                        flex: 1
                                    }}>
                                        <div className={isMine ? 'chat-bubble-mine' : 'chat-bubble-other'} 
                                             style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', width: 'fit-content' }}>
                                            {msg.content}
                                        </div>
                                        <span style={{ 
                                            fontSize: '0.68rem', 
                                            color: 'var(--text-muted)', 
                                            marginTop: '0.25rem',
                                            alignSelf: isMine ? 'flex-end' : 'flex-start'
                                        }}>
                                            {formatTimeAgo(msg.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={endRef} />
                    </div>

                    {/* Input */}
                    <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <textarea id="chat-input"
                                className="input-field"
                                placeholder={`Message ${selectedUser.name}...`}
                                rows={1}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                style={{ resize: 'none', paddingRight: '3rem', fontFamily: 'Inter', lineHeight: 1.5, maxHeight: 120, overflow: 'auto' }}
                            />
                        </div>
                        <button className="btn-primary" onClick={sendMessage} id="send-message-btn" disabled={!input.trim()}
                            style={{ padding: '0.75rem 1.25rem', flexShrink: 0 }}>
                            Send ↑
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Select a conversation</p>
                        <p>or join a project to start messaging teammates</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export function TypingIndicator({ avatar, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, animation: 'fadeIn 0.25s ease' }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%',
        background: color.bg, color: color.text,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 500, flexShrink: 0,
      }}>{avatar}</div>
      <div style={{
        background: '#fff',
        border: '0.5px solid rgba(26,23,20,0.1)',
        borderRadius: '18px 18px 18px 4px',
        padding: '12px 16px',
        display: 'flex', gap: 5, alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'rgba(26,23,20,0.3)',
            animation: `typingDot 1.2s ease ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

export function ChatBubble({ message, personaName, personaAvatar, personaColor }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'flex-end',
        animation: 'slideIn 0.3s ease',
      }}>
        <div style={{
          background: '#1A1714',
          color: '#FAF7F2',
          borderRadius: '18px 18px 4px 18px',
          padding: '12px 16px',
          maxWidth: '75%',
          fontSize: 14,
          lineHeight: 1.6,
        }}>
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', gap: 8,
      animation: 'slideIn 0.3s ease',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%',
        background: personaColor.bg, color: personaColor.text,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 500, flexShrink: 0,
      }}>{personaAvatar}</div>
      <div style={{
        background: '#fff',
        border: '0.5px solid rgba(26,23,20,0.1)',
        borderRadius: '18px 18px 18px 4px',
        padding: '12px 16px',
        maxWidth: '75%',
        fontSize: 14,
        lineHeight: 1.6,
        color: '#1A1714',
      }}>
        {message.content}
      </div>
    </div>
  );
}
